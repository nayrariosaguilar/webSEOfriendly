"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

type FilterOption = "popular" | "downloads" | "recent";

interface FiltersBarProps {
  currentFilter?: FilterOption;
}

const filters: { key: FilterOption; label: string }[] = [
  { key: "popular", label: "Mas populares" },
  { key: "downloads", label: "Mas descargados" },
  { key: "recent", label: "Recientes" },
];

export default function FiltersBar({ currentFilter = "popular" }: FiltersBarProps) {
  const searchParams = useSearchParams();

  const buildFilterUrl = (filter: FilterOption) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("filter", filter);
    params.set("page", "1");
    return `/?${params.toString()}`;
  };

  return (
    <div className="flex gap-3 my-4">
      {filters.map(({ key, label }) => (
        <Link
          key={key}
          href={buildFilterUrl(key)}
          className={`px-4 py-2 rounded-full transition ${
            currentFilter === key
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
