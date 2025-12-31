import { supabase } from "../config/supabaseClient.js";

export async function getSubcategoryBySlug(slug) {
  return await supabase
    .from("subcategories")
    .select("*")
    .eq("slug", slug)
    .single();
}

export async function getDrawingsBySubcategorySlug(slug) {
  const { data: subcategory } = await supabase
    .from("subcategories")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!subcategory) return { data: null, error: "Subcategoría no encontrada" };

  return await supabase
    .from("drawings")
    .select("*")
    .eq("subcategory_id", subcategory.id)
    .order("titulo", { ascending: true });
}
