const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export type SortOption = 'popular' | 'downloads' | 'recent';

export interface Drawing {
  id: string;
  slug: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  likes: number;
  downloads: number;
  category_slug?: string;
  subcategory_slug?: string;
}

export interface Category {
  id: string;
  slug: string;
  nombre: string;
  imagen: string;
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

export function getPublicUrl(path: string) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/drawings/${path}`;
}

// Para usar en Server Components con fetch nativo (mejor para Cache de Next.js)
async function fetchSupabase<T>(table: string, query: string = '*', options: { count?: 'exact' | 'planned' | 'estimated' } = {}): Promise<{ data: T | null, count: number | null }> {
  let url = `${SUPABASE_URL}/rest/v1/${table}?select=${query}`;
  
  const headers: Record<string, string> = {
    'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`
  };

  if (options.count) {
    headers['Prefer'] = `count=${options.count}`;
  }
  
  try {
    const res = await fetch(url, {
      headers,
      next: { revalidate: 3600 } // Cache de 1 hora
    });

    if (!res.ok) return { data: null, count: null };
    
    const countHeader = res.headers.get('content-range');
    const totalCount = countHeader ? parseInt(countHeader.split('/')[1], 10) : null;
    const data = await res.json();
    
    return { data, count: totalCount };
  } catch (e) {
    console.error(`Error fetching ${table}:`, e);
    return { data: null, count: null };
  }
}

export async function getDrawing(slug: string): Promise<Drawing | null> {
  const { data } = await fetchSupabase<Drawing[]>('drawings', `*,subcategories(slug,categories(slug))&slug=eq.${slug}&limit=1`);
  if (!data || data.length === 0) return null;
  
  const d = data[0] as any;
  return {
    ...d,
    category_slug: d.subcategories?.categories?.slug,
    subcategory_slug: d.subcategories?.slug
  };
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await fetchSupabase<Category[]>('categories', '*');
  return data || [];
}

export async function getSubcategoriesByCategory(categorySlug: string): Promise<any[] | null> {
  const { data: categories } = await fetchSupabase<any[]>('categories', `id&slug=eq.${categorySlug}&limit=1`);
  if (!categories || categories.length === 0) return null;

  const categoryId = categories[0].id;
  const { data: subcategories } = await fetchSupabase<any[]>('subcategories', `*,categories(slug)&category_id=eq.${categoryId}`);
  
  return subcategories;
}

export async function getDrawingsPaginated(
  sortBy: SortOption = 'popular',
  page: number = 1,
  limit: number = 30
): Promise<PaginatedResponse> {
  const offset = (page - 1) * limit;
  const sortColumn = { popular: 'likes', downloads: 'downloads', recent: 'created_at' }[sortBy] || 'likes';
  
  const { data, count } = await fetchSupabase<any[]>('drawings', `*,subcategories(slug,categories(slug))&order=${sortColumn}.desc&limit=${limit}&offset=${offset}`, { count: 'exact' });
  
  const drawings: Drawing[] = (data || []).map(d => ({
    ...d,
    category_slug: d.subcategories?.categories?.slug,
    subcategory_slug: d.subcategories?.slug
  }));

  const total = count || 0;

  return {
    drawings,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export async function getDrawingsBySubcategory(subcategorySlug: string): Promise<Drawing[] | null> {
  const { data } = await fetchSupabase<any[]>('drawings', `*,subcategories(slug,categories(slug))&subcategories.slug=eq.${subcategorySlug}`);
  
  if (!data) return null;

  return data.map(d => ({
    ...d,
    category_slug: d.subcategories?.categories?.slug,
    subcategory_slug: d.subcategories?.slug
  }));
}
