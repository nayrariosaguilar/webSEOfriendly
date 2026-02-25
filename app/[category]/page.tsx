import Image from "next/image";
import Link from "next/link";
import { getSubcategoriesByCategory, getPublicUrl } from "@/lib/api";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const subcategorias = await getSubcategoriesByCategory(category);

  if (!subcategorias) {
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
          {category.replace("-", " ")}
        </h1>
      </header>

      {subcategorias.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed">
          <p className="text-gray-500">No hay subcategorías todavía.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-10">
          {subcategorias.map((sub: any) => (
            <Link
              key={sub.slug}
              href={`/${category}/${sub.slug}`}
              className="group flex flex-col items-center text-center"
            >
              <div className="relative w-32 h-32 sm:w-48 sm:h-48 rounded-full overflow-hidden shadow-lg group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300 border-4 border-white">
                <Image
                  src={getPublicUrl(sub.imagen)}
                  alt={sub.nombre}
                  fill
                  className="object-cover"
                />
              </div>

              <span className="mt-4 font-black text-gray-800 capitalize text-lg group-hover:text-blue-600 transition-colors">
                {sub.nombre}
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  return {
    title: `Dibujos de ${category.replace("-", " ")} para colorear`,
    description: `Descubre todos los dibujos de ${category.replace("-", " ")} listos para imprimir y pintar.`,
  };
}
