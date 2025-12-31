const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export function getPublicUrl(path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/imagenes/${path}`;
}


async function fetchAPI(endpoint: string) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    next: { revalidate: 60 }, 
  });

  if (!res.ok) {
    throw new Error(`Error fetching ${endpoint}: ${res.status}`);
  }

  return res.json();
}

// GET /api/categories
export async function getCategories() {
  return fetchAPI("/categories");
}

// GET /api/categories/:slug
export async function getCategory(slug: string) {
  return fetchAPI(`/categories/${slug}`);
}

// GET /api/categories/:slug/subcategories
export async function getSubcategoriesByCategory(slug: string) {
  return fetchAPI(`/categories/${slug}/subcategories`);
}

// GET /api/subcategories/:slug
export async function getSubcategory(slug: string) {
  return fetchAPI(`/subcategories/${slug}`);
}

// GET /api/subcategories/:slug/drawings
export async function getDrawingsBySubcategory(slug: string) {
  return fetchAPI(`/subcategories/${slug}/drawings`);
}

// GET /api/drawings/:slug
export async function getDrawing(slug: string) {
  return fetchAPI(`/drawings/${slug}`);
}

export async function getTrending() {
  return fetchAPI("/trending");
}