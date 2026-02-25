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
    .select('*, categories(slug,name), drawing_assets(kind,path)')
    .ilike('title', `%${q}%`)
    .eq('status', 'published')
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const formatted = data.map((d: any) => {
    const assets: any[] = d.drawing_assets || [];
    const thumb = assets.find((a: any) => a.kind === 'thumbnail');
    const original = assets.find((a: any) => a.kind === 'original_png');
    return {
      ...d,
      category_slug: d.categories?.slug,
      category_name: d.categories?.name,
      thumbnail_path: thumb?.path || original?.path,
      original_path: original?.path || thumb?.path,
    };
  });

  return NextResponse.json(formatted);
}
