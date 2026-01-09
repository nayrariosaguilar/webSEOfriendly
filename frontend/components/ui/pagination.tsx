"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  maxVisible?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  maxVisible = 5
}: PaginationProps) {
  const searchParams = useSearchParams();

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `/?${params.toString()}`;
  };

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const half = Math.floor(maxVisible / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-2 my-8" aria-label="Pagination">
      {currentPage > 1 ? (
        <Link
          href={buildPageUrl(currentPage - 1)}
          className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          aria-label="Pagina anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      ) : (
        <span className="p-2 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed">
          <ChevronLeft className="w-5 h-5" />
        </span>
      )}

      {getPageNumbers().map((page, idx) =>
        page === "..." ? (
          <span key={`ellipsis-${idx}`} className="px-3 py-2">...</span>
        ) : (
          <Link
            key={page}
            href={buildPageUrl(page)}
            className={`px-4 py-2 rounded-lg transition ${
              page === currentPage
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link
          href={buildPageUrl(currentPage + 1)}
          className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          aria-label="Pagina siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      ) : (
        <span className="p-2 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed">
          <ChevronRight className="w-5 h-5" />
        </span>
      )}
    </nav>
  );
}
