import { DrawingList } from "@/frontend/components/drawing-list";
import { getDrawingsBySubcategory, Drawing } from "@/frontend/lib/api";
import { notFound } from "next/navigation";

interface PageParams {
  params: Promise<{ category: string; subcategory: string }>;
}

export default async function SubcategoryPage({ params }: PageParams) {
  const { category, subcategory } = await params;

  const dibujos = await getDrawingsBySubcategory(subcategory);

  if (!dibujos) {
    notFound();
  }

  // Map API response to DrawingList expected format
  const formattedDrawings = dibujos.map((d: Drawing) => ({
    slug: d.slug,
    titulo: d.titulo,
    descripcion: d.descripcion,
    imagen: d.imagen,
    category: d.category_slug || category,
    subcategory: d.subcategory_slug || subcategory,
    likes: d.likes,
    downloads: d.downloads,
  }));

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 capitalize">
        {subcategory.replace("-", " ")}
      </h1>

      {formattedDrawings.length === 0 ? (
        <p className="text-lg text-gray-600">No hay dibujos todavía.</p>
      ) : (
        <DrawingList dibujos={formattedDrawings} />
      )}
    </main>
  );
}