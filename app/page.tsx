import { Suspense } from "react";
import { getDrawingsPaginated, getCategories, type SortOption } from "@/frontend/lib/api";
import Navbar from "@/frontend/components/home/navbar";
import Footer from "@/frontend/components/home/footer";
import SearchBar from "@/frontend/components/ui/searchBar";
import FiltersBar from "@/frontend/components/home/filtersBar";
import { CategoriesBar } from "@/frontend/components/home/categoriesBar";
import { DrawingList } from "@/frontend/components/drawing-list";
import { Pagination } from "@/frontend/components/ui/pagination";

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

  const [{ drawings, pagination }, categories] = await Promise.all([
    getDrawingsPaginated(filter, page, ITEMS_PER_PAGE),
    getCategories(),
  ]);

  const formattedDrawings = drawings.map((d) => ({
    ...d,
    category: d.category_slug,
    subcategory: d.subcategory_slug,
  }));

  return (
    <>
      <Navbar />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <SearchBar />
        </div>

        <CategoriesBar categories={categories} />

        <Suspense fallback={<div className="flex gap-3 my-4">Cargando filtros...</div>}>
          <FiltersBar currentFilter={filter} />
        </Suspense>

        <p className="text-gray-600 mb-4">
          Mostrando {formattedDrawings.length} de {pagination.total} dibujos
        </p>

        <section className="mt-6">
          <DrawingList dibujos={formattedDrawings} />
        </section>

        <Suspense fallback={<div className="flex justify-center my-8">Cargando paginacion...</div>}>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
          />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}

export async function generateMetadata({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const filter = params.filter || "popular";
  const page = params.page || "1";

  const filterLabels: Record<SortOption, string> = {
    popular: "Mas Populares",
    downloads: "Mas Descargados",
    recent: "Recientes",
  };

  return {
    title: `Dibujos ${filterLabels[filter]} - Pagina ${page}`,
    description: `Explora dibujos para colorear ${filterLabels[filter].toLowerCase()}. Pagina ${page}.`,
    alternates: {
      canonical: `/?filter=${filter}&page=${page}`,
    },
  };
}
