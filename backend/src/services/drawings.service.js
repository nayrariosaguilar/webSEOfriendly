import { supabase } from "../config/supabaseClient.js";
import { hashIp } from "../utils/hash.js";

export async function getDrawingBySlug(slug) {
  return await supabase
    .from("drawings")
    .select("*")
    .eq("slug", slug)
    .single();
}

export async function getTrendingDrawings() {
  return await supabase
    .from("drawings")
    .select("*")
    .order("likes", { ascending: false })
    .limit(20);
}

export async function addLike(slug, ip) {
  const ipHash = hashIp(ip);

  // 1. Obtener el dibujo
  const { data: drawing } = await supabase
    .from("drawings")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!drawing) return { error: "Drawing not found" };

  // 2. Comprobar si ya dio like
  const { data: already } = await supabase
    .from("drawing_interactions")
    .select("*")
    .eq("drawing_id", drawing.id)
    .eq("interaction_type", "like")
    .eq("ip_hash", ipHash)
    .maybeSingle();

  if (already) {
    return { error: "Already liked" };
  }

  // 3. Registrar interacción
  await supabase.from("drawing_interactions").insert({
    drawing_id: drawing.id,
    interaction_type: "like",
    ip_hash: ipHash,
  });

  // 4. Incrementar contador
  await supabase
    .from("drawings")
    .update({ likes: supabase.rpc("increment", { x: 1 }) })
    .eq("id", drawing.id);

  return { success: true };
}

export async function addDownload(slug, ip) {
  const ipHash = hashIp(ip);

  const { data: drawing } = await supabase
    .from("drawings")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!drawing) return { error: "Drawing not found" };

  const { data: already } = await supabase
    .from("drawing_interactions")
    .select("*")
    .eq("drawing_id", drawing.id)
    .eq("interaction_type", "download")
    .eq("ip_hash", ipHash)
    .maybeSingle();

  if (!already) {
    await supabase.from("drawing_interactions").insert({
      drawing_id: drawing.id,
      interaction_type: "download",
      ip_hash: ipHash,
    });

    await supabase
      .from("drawings")
      .update({ downloads: supabase.rpc("increment", { x: 1 }) })
      .eq("id", drawing.id);
  }

  return { success: true };
}
