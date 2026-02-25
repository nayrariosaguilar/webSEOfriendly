const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

// ─── Tipos ───────────────────────────────────────────────

export type SortOption = 'popular' | 'downloads' | 'recent';

export interface Drawing {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category_id: string | null;
  category_slug?: string;
  category_name?: string;
  age_level: 'easy' | 'medium' | 'hard';
  status: string;
  published_at: string | null;
  created_at: string;
  // SEO
  seo_title: string | null;
  seo_description: string | null;
  og_title: string | null;
  og_description: string | null;
  // Assets (resueltos tras query)
  thumbnail_path?: string;
  original_path?: string;
  // Métricas agregadas
  total_views?: number;
  total_downloads?: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  is_active: boolean;
}

export interface Tag {
  id: string;
  slug: string;
  name: string;
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

// ─── Helpers ─────────────────────────────────────────────

export function getPublicUrl(path: string | undefined | null) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/drawings/${path}`;
}

function resolveAssets(raw: any): { thumbnail_path?: string; original_path?: string } {
  const assets: any[] = raw.drawing_assets || [];
  const thumb = assets.find((a: any) => a.kind === 'thumbnail');
  const original = assets.find((a: any) => a.kind === 'original_png');
  return {
    thumbnail_path: thumb?.path || original?.path,
    original_path: original?.path || thumb?.path,
  };
}

function resolveMetrics(raw: any): { total_views: number; total_downloads: number } {
  const rows: any[] = raw.drawing_daily_metrics || [];
  return {
    total_views: rows.reduce((sum: number, r: any) => sum + (r.views ?? 0), 0),
    total_downloads: rows.reduce((sum: number, r: any) => sum + (r.downloads ?? 0), 0),
  };
}

function mapDrawing(d: any): Drawing {
  const { thumbnail_path, original_path } = resolveAssets(d);
  const { total_views, total_downloads } = resolveMetrics(d);
  return {
    id: d.id,
    slug: d.slug,
    title: d.title,
    description: d.description,
    category_id: d.category_id,
    category_slug: d.categories?.slug,
    category_name: d.categories?.name,
    age_level: d.age_level,
    status: d.status,
    published_at: d.published_at,
    created_at: d.created_at,
    seo_title: d.seo_title,
    seo_description: d.seo_description,
    og_title: d.og_title,
    og_description: d.og_description,
    thumbnail_path,
    original_path,
    total_views,
    total_downloads,
  };
}

// ─── Fetch genérico con cache de Next.js ─────────────────

async function fetchSupabase<T>(
  table: string,
  query: string = '*',
  options: { count?: 'exact' | 'planned' | 'estimated' } = {}
): Promise<{ data: T | null; count: number | null }> {
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=${query}`;

  const headers: Record<string, string> = {
    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
  };

  if (options.count) {
    headers['Prefer'] = `count=${options.count}`;
  }

  try {
    const res = await fetch(url, {
      headers,
      next: { revalidate: 3600 },
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

// ─── API pública ─────────────────────────────────────────

const DRAWING_SELECT = [
  '*',
  'categories(slug,name)',
  'drawing_assets(kind,path)',
  'drawing_daily_metrics(views,downloads)',
].join(',');

export async function getDrawing(slug: string): Promise<Drawing | null> {
  const { data } = await fetchSupabase<any[]>(
    'drawings',
    `${DRAWING_SELECT}&slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`
  );
  if (!data || data.length === 0) return null;
  return mapDrawing(data[0]);
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await fetchSupabase<Category[]>(
    'categories',
    '*&is_active=eq.true&order=name.asc'
  );
  return data || [];
}

export async function getDrawingsByCategory(categorySlug: string): Promise<Drawing[] | null> {
  // Primero obtenemos el id de la categoría
  const { data: cats } = await fetchSupabase<any[]>(
    'categories',
    `id&slug=eq.${encodeURIComponent(categorySlug)}&limit=1`
  );
  if (!cats || cats.length === 0) return null;

  const categoryId = cats[0].id;
  const { data } = await fetchSupabase<any[]>(
    'drawings',
    `${DRAWING_SELECT}&category_id=eq.${categoryId}&status=eq.published&order=published_at.desc`
  );

  if (!data) return null;
  return data.map(mapDrawing);
}

export async function getDrawingsPaginated(
  sortBy: SortOption = 'popular',
  page: number = 1,
  limit: number = 30
): Promise<PaginatedResponse> {
  const offset = (page - 1) * limit;

  // Para ordenar por métricas, usamos la vista drawing_metrics_summary
  // Supabase REST no permite ORDER BY en tablas relacionadas directamente,
  // así que ordenamos por published_at como fallback y hacemos sort en JS para popular/downloads
  const orderColumn = sortBy === 'recent' ? 'published_at' : 'published_at';

  const { data, count } = await fetchSupabase<any[]>(
    'drawings',
    `${DRAWING_SELECT}&status=eq.published&order=${orderColumn}.desc.nullslast&limit=${limit}&offset=${offset}`,
    { count: 'exact' }
  );

  let drawings: Drawing[] = (data || []).map(mapDrawing);

  // Sort por métricas en JS (Supabase REST no permite ORDER BY en relaciones)
  if (sortBy === 'popular') {
    drawings.sort((a, b) => (b.total_views ?? 0) - (a.total_views ?? 0));
  } else if (sortBy === 'downloads') {
    drawings.sort((a, b) => (b.total_downloads ?? 0) - (a.total_downloads ?? 0));
  }

  const total = count || 0;

  return {
    drawings,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getAllDrawings(): Promise<Drawing[]> {
  const { data } = await fetchSupabase<any[]>(
    'drawings',
    `slug,published_at,categories(slug)&status=eq.published&order=published_at.desc`
  );
  if (!data) return [];
  return data.map((d: any) => ({
    ...d,
    category_slug: d.categories?.slug,
  }));
}
