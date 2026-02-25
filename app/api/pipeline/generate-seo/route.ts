import { NextResponse } from 'next/server';
import { generateSeoStructure } from '@/lib/pipeline';

export async function POST(request: Request) {
  try {
    const { drawing_id } = await request.json();

    if (!drawing_id) {
      return NextResponse.json({ error: 'drawing_id is required' }, { status: 400 });
    }

    const result = await generateSeoStructure(drawing_id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
