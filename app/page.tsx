import { getTrending } from "@/frontend/lib/api";
import Navbar from "@/frontend/components/home/navbar";
import Footer from "@/frontend/components/home/footer";
import SearchBar from "@/frontend/components/ui/searchBar";
import FiltersBar from "@/frontend/components/home/filtersBar";
import {DrawingList} from "@/frontend/components/drawing-list";

export default async function HomePage() {
  const trending = await getTrending(); 
  return (
    <>

      {/* NAV */}
      <Navbar />

      <main className="container mx-auto px-4 py-6">
        
        {/* BUSCADOR */}
        <div className="mb-6">
          <SearchBar />
        </div>

        {/* FILTROS (likes, descargas, recientes) frfr */}
        <FiltersBar />

        {/* GRID DE DIBUJOS (Pinterest-style) */}
        <section className="mt-6">
          <DrawingList dibujos={trending} />
        </section>

      </main>

      <Footer />
    </>
  );
}

