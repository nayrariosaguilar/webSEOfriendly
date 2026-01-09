const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Types
export interface Drawing {
  id: number;
  slug: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  likes: number;
  downloads: number;
  category_slug: string;
  subcategory_slug: string;
}

export interface PaginatedResponse {
  drawings: Drawing[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type SortOption = 'popular' | 'downloads' | 'recent';

export function getPublicUrl(path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/drawings/${path}`;
}


async function fetchAPI<T = unknown>(endpoint: string, throwOnError = true): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    if (throwOnError) {
      throw new Error(`Error fetching ${endpoint}: ${res.status}`);
    }
    return null as T;
  }

  return res.json();
}

async function fetchAPISafe<T = unknown>(endpoint: string): Promise<T | null> {
  return fetchAPI<T | null>(endpoint, false);
}

// GET /api/categories
export async function getCategories(): Promise<Category[]> {
  return fetchAPI<Category[]>("/categories");
}

// GET /api/categories/:slug
export async function getCategory(slug: string) {
  return fetchAPI(`/categories/${slug}`);
}

// GET /api/categories/:slug/subcategories
export async function getSubcategoriesByCategory(slug: string) {
  return fetchAPISafe<Subcategory[]>(`/categories/${slug}/subcategories`);
}

export interface Category {
  id: number;
  slug: string;
  nombre: string;
  imagen: string;
}

export interface Subcategory {
  id: number;
  slug: string;
  nombre: string;
  imagen: string;
  category_id: number;
}

// GET /api/subcategories/:slug
export async function getSubcategory(slug: string) {
  return fetchAPI(`/subcategories/${slug}`);
}

// GET /api/subcategories/:slug/drawings
export async function getDrawingsBySubcategory(slug: string): Promise<Drawing[] | null> {
  return fetchAPISafe<Drawing[]>(`/subcategories/${slug}/drawings`);
}

// GET /api/drawings/:slug
export async function getDrawing(slug: string): Promise<Drawing | null> {
  return fetchAPISafe<Drawing>(`/drawings/${slug}`);
}

export async function getTrending() {
  return fetchAPI("/trending");
}

// GET /api/drawings/all?sortBy=popular&page=1&limit=30
export async function getDrawingsPaginated(
  sortBy: SortOption = 'popular',
  page: number = 1,
  limit: number = 30
): Promise<PaginatedResponse> {
  const params = new URLSearchParams({
    sortBy,
    page: String(page),
    limit: String(limit)
  });

  return fetchAPI(`/drawings/all?${params.toString()}`);
}