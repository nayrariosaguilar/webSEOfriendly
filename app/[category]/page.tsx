import { DrawingList } from "@/components/drawings/drawing-list";
import { getDrawingsByCategory } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const drawings = await getDrawingsByCategory(category);

  if (!drawings) {
    notFound();
  }

  return (
    <main className="container mx-auto py-12 px-4">
      <header className="mb-12">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-widest mb-4">
          <Link href="/" className="hover:underline">Inicio</Link>
          <span className="text-gray-300">/</span>
          <span>{category}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black capitalize text-gray-900">
          {category.replace(/-/g, " ")}
        </h1>
      </header>

      <DrawingList dibujos={drawings} />
    </main>
  );
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  return {
    title: `Dibujos de ${category.replace(/-/g, " ")} para colorear`,
    description: `Descubre todos los dibujos de ${category.replace(/-/g, " ")} listos para imprimir y pintar.`,
  };
}
