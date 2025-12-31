import { supabase } from "../config/supabaseClient.js";


export async function getAllCategories() {
  return await supabase
    .from("categories")
    .select("*")
    .order("nombre", { ascending: true });
}


export async function getCategoryBySlug(slug) {
  return await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();
}


export async function getSubcategoriesByCategorySlug(slug) {

  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!category)
    return { data: null, error: "Categoría no encontrada" };

  return await supabase
    .from("subcategories")
    .select("*")
    .eq("category_id", category.id)
    .order("nombre", { ascending: true });
}
