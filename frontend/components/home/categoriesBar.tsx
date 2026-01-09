"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BASE = "https://dpvulchbiygiidolzrjl.supabase.co";

function getImageUrl(path: string) {
  return `${BASE}/storage/v1/object/public/${path}`;
}

interface Category {
  id: number;
  slug: string;
  nombre: string;
  imagen: string;
}

interface CategoriesBarProps {
  categories: Category[];
}

export function CategoriesBar({ categories }: CategoriesBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="relative mb-6">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Categorias</h2>

      <div className="relative group">
        {/* Left scroll button */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -ml-3"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        {/* Scrollable container */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${cat.slug}`}
              className="flex-shrink-0 group/item"
            >
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-200 hover:scale-105">
                <Image
                  src={getImageUrl(cat.imagen)}
                  alt={cat.nombre}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium text-center truncate">
                  {cat.nombre}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Right scroll button */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -mr-3"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
}
