import { DrawingList } from "@/components/drawings/drawing-list";
import { getDrawingsBySubcategory } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageParams {
  params: Promise<{ category: string; subcategory: string }>;
}

export default async function SubcategoryPage({ params }: PageParams) {
  const { category, subcategory } = await params;

  const dibujos = await getDrawingsBySubcategory(subcategory);

  if (!dibujos) {
    notFound();
  }

  return (
    <main className="container mx-auto py-12 px-4">
      <header className="mb-12">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-widest mb-4">
          <Link href="/" className="hover:underline">Inicio</Link>
          <span className="text-gray-300">/</span>
          <Link href={`/${category}`} className="hover:underline capitalize">{category}</Link>
          <span className="text-gray-300">/</span>
          <span>{subcategory}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black capitalize text-gray-900">
          {subcategory.replace("-", " ")}
        </h1>
      </header>

      <DrawingList dibujos={dibujos} />
    </main>
  );
}

export async function generateMetadata({ params }: PageParams) {
  const { category, subcategory } = await params;
  return {
    title: `Dibujos de ${subcategory.replace("-", " ")} para colorear e imprimir`,
    description: `Los mejores dibujos de ${subcategory.replace("-", " ")} en la categoría ${category}. ¡Descárgalos gratis!`,
  };
}
