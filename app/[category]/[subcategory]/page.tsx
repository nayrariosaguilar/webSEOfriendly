import { DrawingList } from "@/frontend/components/drawing-list";
import { getDrawingsBySubcategory } from "@/frontend/lib/api";

const BASE = "https://dpvulchbiygiidolzrjl.supabase.co";
export function publicUrl(path: string) {
  return `${BASE}/storage/v1/object/public/${path}`;
}

export default async function SubcategoryPage({ params }: any) {
  const { subcategory } = await params;

  const dibujos = await getDrawingsBySubcategory(subcategory);

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 capitalize">
        {subcategory.replace("-", " ")}
      </h1>

      {dibujos.length === 0 ? (
        <p className="text-lg text-gray-600">No hay dibujos todavía.</p>
      ) : (
        <DrawingList dibujos={dibujos.map((d: any) => publicUrl(d.imagen))} />
      )}
    </main>
  );
}
