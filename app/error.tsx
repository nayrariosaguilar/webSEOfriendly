"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="container mx-auto px-4 py-16 min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-red-500">Error</h1>
      <h2 className="text-2xl font-bold text-gray-800 mt-4">
        Algo salió mal
      </h2>
      <p className="text-gray-600 mt-4 max-w-md">
        Ha ocurrido un error inesperado. Por favor, intenta de nuevo.
      </p>
      <div className="flex gap-4 mt-8">
        <button
          onClick={reset}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Intentar de nuevo
        </button>
        <Link
          href="/"
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
