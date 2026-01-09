import { supabase } from "../config/supabaseClient.js";
import { hashIp } from "../utils/hash.js";

// Helper para formatear drawing con slugs
function formatDrawing(drawing) {
  if (!drawing) return null;
  return {
    id: drawing.id,
    slug: drawing.slug,
    titulo: drawing.titulo,
    descripcion: drawing.descripcion,
    imagen: drawing.imagen,
    likes: drawing.likes,
    downloads: drawing.downloads,
    created_at: drawing.created_at,
    subcategory_id: drawing.subcategory_id,
    subcategory_slug: drawing.subcategories?.slug || null,
    category_slug: drawing.subcategories?.categories?.slug || null,
  };
}

export async function getDrawingBySlug(slug) {
  const { data, error } = await supabase
    .from("drawings")
    .select(`
      *,
      subcategories (
        slug,
        categories (
          slug
        )
      )
    `)
    .eq("slug", slug)
    .single();

  if (error) return { data: null, error };
  return { data: formatDrawing(data), error: null };
}

export async function getTrendingDrawings() {
  const { data, error } = await supabase
    .from("drawings")
    .select(`
      *,
      subcategories (
        slug,
        categories (
          slug
        )
      )
    `)
    .order("likes", { ascending: false })
    .limit(20);

  if (error) return { data: null, error };
  return { data: data.map(formatDrawing), error: null };
}

export async function getAllDrawingsPaginated({ sortBy = 'popular', page = 1, limit = 30 }) {
  const offset = (page - 1) * limit;
  const sortColumn = { popular: 'likes', downloads: 'downloads', recent: 'created_at' }[sortBy] || 'likes';

  const { data, error } = await supabase
    .from("drawings")
    .select(`
      *,
      subcategories (
        slug,
        categories (
          slug
        )
      )
    `)
    .order(sortColumn, { ascending: false })
    .range(offset, offset + limit - 1);

  const { count } = await supabase
    .from("drawings")
    .select("*", { count: 'exact', head: true });

  if (error) return { data: null, count: 0, error };
  return { data: data.map(formatDrawing), count, error: null };
}

export async function addLike(slug, ip) {
  const ipHash = hashIp(ip);

  const { data: drawing } = await supabase
    .from("drawings")
    .select("id, likes")
    .eq("slug", slug)
    .single();

  if (!drawing) return { error: "Drawing not found" };

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

  await supabase.from("drawing_interactions").insert({
    drawing_id: drawing.id,
    interaction_type: "like",
    ip_hash: ipHash,
  });

  await supabase
    .from("drawings")
    .update({ likes: (drawing.likes || 0) + 1 })
    .eq("id", drawing.id);

  return { success: true };
}

export async function addDownload(slug, ip) {
  const ipHash = hashIp(ip);

  const { data: drawing } = await supabase
    .from("drawings")
    .select("id, downloads")
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
      .update({ downloads: (drawing.downloads || 0) + 1 })
      .eq("id", drawing.id);
  }

  return { success: true };
}
