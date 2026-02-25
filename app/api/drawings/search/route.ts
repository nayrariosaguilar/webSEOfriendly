import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  
  if (!q) return NextResponse.json([]);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('drawings')
    .select('*, subcategories(slug,categories(slug))')
    .ilike('titulo', `%${q}%`)
    .eq('status', 'published')
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const formatted = data.map(d => ({
    ...d,
    category_slug: d.subcategories?.categories?.slug,
    subcategory_slug: d.subcategories?.slug
  }));

  return NextResponse.json(formatted);
}
