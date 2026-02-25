import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container mx-auto px-4 py-16 min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-9xl font-bold text-gray-200 tracking-tighter">404</h1>
      <h2 className="text-3xl font-black text-gray-800 mt-4">
        Página no encontrada
      </h2>
      <p className="text-gray-500 mt-4 max-w-md leading-relaxed">
        Lo sentimos, el dibujo que buscas se ha escapado o nunca existió. 
        ¡Prueba a buscar otro o vuelve al inicio!
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mt-10">
        <Link
          href="/"
          className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          Volver al inicio
        </Link>
        <Link
          href="/buscar"
          className="px-8 py-4 bg-white border-2 border-gray-100 text-gray-600 font-bold rounded-2xl hover:border-blue-400 hover:text-blue-600 transition-all"
        >
          Buscar dibujos
        </Link>
      </div>
    </main>
  );
}
