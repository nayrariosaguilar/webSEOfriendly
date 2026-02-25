"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DrawingList } from "@/components/drawings/drawing-list";
import { Drawing } from "@/lib/api";
import { Search } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Drawing[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    if (query) {
      setLoading(true);
      fetch(`/api/drawings/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data || []);
          setLoading(false);
        })
        .catch(() => {
          setResults([]);
          setLoading(false);
        });
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      window.location.href = `/buscar?q=${encodeURIComponent(searchInput.trim())}`;
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 sm:py-16 min-h-screen">
      <header className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6 tracking-tight">
          Encuentra tu próximo <span className="text-blue-600">dibujo</span>
        </h1>

        <form onSubmit={handleSearch} className="relative group">
          <div className="relative flex items-center">
            <Search className="absolute left-5 w-6 h-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Escribe 'gatos', 'princesas', 'coches'..."
              className="w-full pl-14 pr-32 py-5 bg-white border-2 border-gray-100 rounded-2xl shadow-xl shadow-blue-50 focus:border-blue-500 focus:outline-none transition-all text-lg"
            />
            <button
              type="submit"
              className="absolute right-3 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              Buscar
            </button>
          </div>
        </form>
      </header>

      {query && (
        <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {loading ? "Buscando..." : `Resultados para "${query}"`}
          </h2>
          <span className="text-sm font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-full">
            {results.length} encontrados
          </span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-50 aspect-square rounded-2xl border border-gray-100" />
          ))}
        </div>
      ) : results.length > 0 ? (
        <DrawingList dibujos={results} />
      ) : query ? (
        <div className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 max-w-xl mx-auto">
          <p className="text-gray-400 text-lg font-medium">
            No encontramos nada para &quot;{query}&quot;. 
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Prueba con términos más generales como &quot;animales&quot; o &quot;flores&quot;.
          </p>
        </div>
      ) : null}
    </main>
  );
}

export default function BuscarPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SearchContent />
    </Suspense>
  );
}
