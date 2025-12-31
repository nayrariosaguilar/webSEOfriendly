"use client";

export default function FiltersBar() {
  return (
    <div className="flex gap-3 my-4">
      <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">
        Más populares
      </button>
      <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">
        Más descargados
      </button>
      <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">
        Recientes
      </button>
    </div>
  );
}
