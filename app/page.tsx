import { Suspense } from "react";
import { getDrawingsPaginated, getCategories, type SortOption } from "@/lib/api";
import { DrawingList } from "@/components/drawings/drawing-list";

interface HomePageProps {
  searchParams: Promise<{
    filter?: SortOption;
    page?: string;
  }>;
}

const ITEMS_PER_PAGE = 30;

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;

  const filter: SortOption = params.filter || "popular";
  const page = parseInt(params.page || "1", 10);

  // Intentamos obtener datos, si falla manejamos el error elegantemente
  const data = await getDrawingsPaginated(filter, page, ITEMS_PER_PAGE).catch(() => null);
  const categories = await getCategories().catch(() => []);

  const drawings = data?.drawings || [];
  const pagination = data?.pagination || { total: 0, page: 1, totalPages: 1 };

  return (
    <main className="container mx-auto px-4 py-6 sm:py-12">
      <header className="mb-8 sm:mb-16 text-center">
        <h1 className="text-3xl sm:text-6xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
          Dibujos para <span className="text-blue-600 italic">Colorear</span> <br className="hidden sm:block" /> Gratis
        </h1>
        <p className="text-gray-500 text-base sm:text-xl max-w-2xl mx-auto px-4">
          Descubre nuestra colección exclusiva de line art generada por IA. 
          Perfectos para imprimir y colorear en casa con los más pequeños.
        </p>
      </header>

      {/* Categorías Rápidas - Ahora con Scroll Horizontal en móvil */}
      <div className="flex overflow-x-auto sm:flex-wrap sm:justify-center gap-3 mb-10 pb-4 sm:pb-0 scrollbar-hide">
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`/${cat.slug}`}
            className="whitespace-nowrap px-6 py-2 bg-white border border-gray-100 rounded-full shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-sm font-bold text-gray-700"
          >
            {cat.nombre}
          </a>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6 sm:mb-10">
        <h2 className="text-xl sm:text-3xl font-black text-gray-800">Tendencias</h2>
        <div className="text-[10px] sm:text-sm font-medium text-gray-400 uppercase tracking-widest">
          {drawings.length} Dibujos
        </div>
      </div>

      <Suspense fallback={<div className="grid grid-cols-5 gap-6">Cargando galería...</div>}>
        <DrawingList dibujos={drawings} />
      </Suspense>

      {/* Paginación Simple */}
      {pagination.totalPages > 1 && (
        <div className="mt-16 flex justify-center gap-2">
          {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => (
            <a
              key={i}
              href={`/?page=${i + 1}&filter=${filter}`}
              className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all ${
                pagination.page === i + 1 
                ? 'bg-blue-600 text-white' 
                : 'bg-white border text-gray-400 hover:border-blue-400'
              }`}
            >
              {i + 1}
            </a>
          ))}
        </div>
      )}
    </main>
  );
}

export async function generateMetadata({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const page = params.page || "1";

  return {
    title: `Dibujos para Colorear e Imprimir - Página ${page}`,
    description: `La mayor galería de dibujos para colorear gratis. Página ${page}.`,
  };
}
