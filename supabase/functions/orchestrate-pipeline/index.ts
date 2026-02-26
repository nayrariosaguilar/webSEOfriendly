import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// ─── Timeouts por fase ────────────────────────────────────────────────────────

const TIMEOUTS = {
  seo_structure: 30_000,   // Claude Haiku: rápido
  seo_content:   90_000,   // Gemini: más largo
  image:        120_000,   // Qwen: el más lento
};

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Phase = "seo_structure" | "seo_content" | "image" | "validation";

interface WebhookPayload {
  type: "INSERT" | "UPDATE";
  table: string;
  record: {
    id: string;
    drawing_id: string;
    status: string;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function log(phase: string, msg: string, data?: unknown) {
  console.log(JSON.stringify({ ts: new Date().toISOString(), phase, msg, ...( data ? { data } : {}) }));
}

async function callPhase(
  fnName: string,
  drawing_id: string,
  timeoutMs: number
): Promise<{ success: boolean; error?: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/${fnName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SERVICE_KEY}`,
      },
      body: JSON.stringify({ drawing_id }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, error: body.error ?? `HTTP ${res.status}` };
    }
    if (body.success === false) {
      return { success: false, error: body.error ?? "Edge function returned success:false" };
    }

    return { success: true };
  } catch (err: any) {
    clearTimeout(timer);
    if (err.name === "AbortError") {
      return { success: false, error: `Timeout: ${fnName} superó ${timeoutMs}ms` };
    }
    return { success: false, error: err.message };
  }
}

async function setPhase(supabase: any, runId: string, phase: Phase) {
  await supabase
    .from("pipeline_runs")
    .update({ phase })
    .eq("id", runId);
  log(phase, "fase iniciada");
}

async function failRun(
  supabase: any,
  runId: string,
  drawingId: string,
  phase: Phase,
  error: string
) {
  log(phase, "fase fallida", { error });
  await Promise.all([
    supabase
      .from("pipeline_runs")
      .update({ status: "failed", phase, error, finished_at: new Date().toISOString() })
      .eq("id", runId),
    // Devolver drawing a draft para que se pueda reintentar
    supabase
      .from("drawings")
      .update({ status: "draft" })
      .eq("id", drawingId),
  ]);
}

// ─── Validación de outputs ────────────────────────────────────────────────────

async function validateOutputs(
  supabase: any,
  drawingId: string
): Promise<string[]> {
  const errors: string[] = [];

  const { data: drawing } = await supabase
    .from("drawings")
    .select("seo_structure, content_html")
    .eq("id", drawingId)
    .single();

  // Validar seo_structure
  const seo = drawing?.seo_structure;
  if (!seo) {
    errors.push("seo_structure ausente");
  } else {
    const required = ["tema", "keyword_principal", "variantes_keyword", "titulo_seo", "h2_sugeridos", "resumen_base"];
    for (const field of required) {
      if (!seo[field]) errors.push(`seo_structure.${field} ausente`);
    }
    if (!Array.isArray(seo.variantes_keyword) || seo.variantes_keyword.length < 3) {
      errors.push("seo_structure.variantes_keyword debe tener al menos 3 elementos");
    }
    if (!Array.isArray(seo.h2_sugeridos) || seo.h2_sugeridos.length < 2) {
      errors.push("seo_structure.h2_sugeridos debe tener al menos 2 elementos");
    }
  }

  // Validar content_html
  const html = drawing?.content_html ?? "";
  if (html.length < 500) {
    errors.push(`content_html demasiado corto: ${html.length} chars (mínimo 500)`);
  }
  if (!html.includes("<h2") && !html.includes("<H2")) {
    errors.push("content_html no contiene ningún H2");
  }

  // Validar que existe el asset de imagen
  const { data: asset } = await supabase
    .from("drawing_assets")
    .select("path")
    .eq("drawing_id", drawingId)
    .eq("kind", "original_png")
    .single();

  if (!asset?.path) {
    errors.push("asset original_png no encontrado en drawing_assets");
  }

  return errors;
}

// ─── Handler principal ────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  try {
    const payload: WebhookPayload | { drawing_id?: string; id?: string; status?: string } =
      await req.json();

    // Soporta tanto llamada directa como payload de DB Webhook
    const record = "record" in payload ? payload.record : payload as any;

    if (!record?.id || !record?.drawing_id) {
      return json({ error: "Payload inválido: faltan id o drawing_id" }, 400);
    }

    // Solo procesar runs en estado queued
    if (record.status !== "queued") {
      log("init", "skipped: status no es queued", { status: record.status });
      return json({ skipped: true, reason: `status es ${record.status}` });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const runId = record.id;
    const drawingId = record.drawing_id;

    log("init", "pipeline iniciado", { runId, drawingId });

    // ── Lock atómico: solo un worker toma este run ─────────────────────────
    const { data: locked } = await supabase
      .from("pipeline_runs")
      .update({ status: "generating", started_at: new Date().toISOString() })
      .eq("id", runId)
      .eq("status", "queued")   // condición de guarda
      .select("id")
      .single();

    if (!locked) {
      log("init", "skipped: run ya tomado por otro worker");
      return json({ skipped: true, reason: "Run ya en proceso" });
    }

    // Marcar drawing como generating
    await supabase
      .from("drawings")
      .update({ status: "generating" })
      .eq("id", drawingId);

    // ── Fase 1: SEO Structure (Claude) ─────────────────────────────────────
    await setPhase(supabase, runId, "seo_structure");
    const r1 = await callPhase("generate-seo-structure", drawingId, TIMEOUTS.seo_structure);
    if (!r1.success) {
      await failRun(supabase, runId, drawingId, "seo_structure", r1.error!);
      return json({ success: false, phase: "seo_structure", error: r1.error }, 500);
    }
    log("seo_structure", "completada");

    // ── Fase 2: SEO Content (Gemini) ───────────────────────────────────────
    await setPhase(supabase, runId, "seo_content");
    const r2 = await callPhase("generate-seo-content", drawingId, TIMEOUTS.seo_content);
    if (!r2.success) {
      await failRun(supabase, runId, drawingId, "seo_content", r2.error!);
      return json({ success: false, phase: "seo_content", error: r2.error }, 500);
    }
    log("seo_content", "completada");

    // ── Fase 3: Imagen (Qwen) ──────────────────────────────────────────────
    await setPhase(supabase, runId, "image");
    const r3 = await callPhase("generate-image-qwen", drawingId, TIMEOUTS.image);
    if (!r3.success) {
      await failRun(supabase, runId, drawingId, "image", r3.error!);
      return json({ success: false, phase: "image", error: r3.error }, 500);
    }
    log("image", "completada");

    // ── Fase 4: Validación ─────────────────────────────────────────────────
    await setPhase(supabase, runId, "validation");
    const validationErrors = await validateOutputs(supabase, drawingId);

    if (validationErrors.length > 0) {
      const errMsg = validationErrors.join(" | ");
      await failRun(supabase, runId, drawingId, "validation", errMsg);
      return json({ success: false, phase: "validation", errors: validationErrors }, 422);
    }
    log("validation", "completada");

    // ── Todo OK: publicar ──────────────────────────────────────────────────
    await Promise.all([
      supabase
        .from("drawings")
        .update({ status: "needs_review" })
        .eq("id", drawingId),
      supabase
        .from("pipeline_runs")
        .update({ status: "completed", phase: "done", finished_at: new Date().toISOString() })
        .eq("id", runId),
    ]);

    log("done", "pipeline completado", { drawingId, runId });

    return json({ success: true, drawing_id: drawingId, run_id: runId });

  } catch (err: any) {
    console.error("Error no controlado:", err);
    return json({ error: err.message }, 500);
  }
});

// ─── Utilidad ─────────────────────────────────────────────────────────────────

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
