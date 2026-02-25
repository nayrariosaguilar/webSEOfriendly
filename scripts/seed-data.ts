import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

async function seed() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  console.log('--- Starting Seeding ---');
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

  // 1. Create a Category
  console.log('Creating category: Animales...');
  const { data: cat, error: catErr } = await supabase
    .from('categories')
    .upsert({
      slug: 'animales',
      name: 'Animales para colorear',
      description: 'Dibujos de animales para todos los niveles.',
      is_active: true
    }, { onConflict: 'slug' })
    .select()
    .single();

  if (catErr) {
    console.error('Error creating category:', catErr);
    return;
  }
  console.log('Category created:', cat.id);

  // 2. Create another Category
  console.log('Creating category: Personajes...');
  const { data: cat2, error: catErr2 } = await supabase
    .from('categories')
    .upsert({
      slug: 'personajes',
      name: 'Personajes famosos',
      description: 'Dibujos de tus personajes favoritos.',
      is_active: true
    }, { onConflict: 'slug' })
    .select()
    .single();

  if (catErr2) {
    console.error('Error creating category 2:', catErr2);
  } else {
    console.log('Category created:', cat2.id);
  }

  // 3. Create a Drawing
  console.log('Creating drawing: Gato tierno...');
  const { data: drawing, error: drawingErr } = await supabase
    .from('drawings')
    .upsert({
      slug: 'gato-tierno',
      title: 'Gato Tierno',
      description: 'Un gatito muy lindo para colorear.',
      category_id: cat.id,
      age_level: 'easy',
      status: 'published',
      published_at: new Date().toISOString(),
      seo_title: 'Dibujo de gato tierno para colorear',
      seo_description: 'Imprime y colorea este dibujo de un gato tierno gratis.'
    }, { onConflict: 'slug' })
    .select()
    .single();

  if (drawingErr) {
    console.error('Error creating drawing:', drawingErr);
    return;
  }
  console.log('Drawing created:', drawing.id);

  // 4. Create another Drawing
  console.log('Creating drawing: Perro juguetón...');
  const { data: drawing2, error: drawingErr2 } = await supabase
    .from('drawings')
    .upsert({
      slug: 'perro-jugueton',
      title: 'Perro Juguetón',
      description: 'Un perrito corriendo por el parque.',
      category_id: cat.id,
      age_level: 'medium',
      status: 'published',
      published_at: new Date().toISOString(),
      seo_title: 'Dibujo de perro juguetón para colorear',
      seo_description: 'Colorea este perro juguetón gratis.'
    }, { onConflict: 'slug' })
    .select()
    .single();

  if (drawingErr2) {
    console.error('Error creating drawing 2:', drawingErr2);
  } else {
    console.log('Drawing created:', drawing2.id);
  }

  // 5. Add Assets
  console.log('Adding assets...');
  const assets = [
    { drawing_id: drawing.id, kind: 'thumbnail', path: 'cat.jpg' },
    { drawing_id: drawing.id, kind: 'original_png', path: 'cat.jpg' },
    { drawing_id: drawing2.id, kind: 'thumbnail', path: 'perrito.jpg' },
    { drawing_id: drawing2.id, kind: 'original_png', path: 'perrito.jpg' },
  ];

  for (const asset of assets) {
    const { error: assetErr } = await supabase
      .from('drawing_assets')
      .upsert(asset, { onConflict: 'drawing_id,kind' });
    
    if (assetErr) {
      console.error(`Error adding asset (${asset.kind}):`, assetErr);
    }
  }
  console.log('Assets added.');

  // 6. Add some metrics
  console.log('Adding metrics...');
  const metrics = [
    { drawing_id: drawing.id, views: 150, downloads: 45 },
    { drawing_id: drawing2.id, views: 230, downloads: 88 },
  ];

  for (const metric of metrics) {
    const { error: metricErr } = await supabase
      .from('drawing_daily_metrics')
      .upsert(metric, { onConflict: 'drawing_id' });
    
    if (metricErr) {
      console.error('Error adding metrics:', metricErr);
    }
  }
  console.log('Metrics added.');

  console.log('--- Seeding Complete ---');
}

seed().catch(console.error);
