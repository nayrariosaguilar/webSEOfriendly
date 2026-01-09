import { supabase } from "../config/supabaseClient.js";

export async function getSubcategoryBySlug(slug) {
  return await supabase
    .from("subcategories")
    .select(`
      *,
      categories (
        slug
      )
    `)
    .eq("slug", slug)
    .single();
}

export async function getDrawingsBySubcategorySlug(slug) {
  // Primero obtener la subcategoria con su categoria
  const { data: subcategory, error: subError } = await supabase
    .from("subcategories")
    .select(`
      id,
      slug,
      categories (
        slug
      )
    `)
    .eq("slug", slug)
    .single();

  if (subError || !subcategory) {
    return { data: null, error: "Subcategoria no encontrada" };
  }

  // Obtener los drawings
  const { data: drawings, error } = await supabase
    .from("drawings")
    .select("*")
    .eq("subcategory_id", subcategory.id)
    .order("titulo", { ascending: true });

  if (error) return { data: null, error };

  // Formatear con los slugs
  const formattedDrawings = drawings.map(d => ({
    ...d,
    subcategory_slug: subcategory.slug,
    category_slug: subcategory.categories?.slug || null,
  }));

  return { data: formattedDrawings, error: null };
}
