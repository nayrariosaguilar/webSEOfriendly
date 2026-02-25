import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acerca de Nosotros",
  description:
    "Conoce más sobre ColorearWeb, tu sitio web favorito para encontrar dibujos imprimibles gratis generados por IA.",
};

export default function AcercaDePage() {
  return (
    <main className="container mx-auto px-4 py-12 sm:py-24 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 text-center sm:text-left">
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 mb-6 tracking-tighter">Acerca de <span className="text-blue-600">Nosotros</span></h1>
          <p className="text-xl text-gray-500 leading-relaxed">
            Bienvenidos a ColorearWeb, el rincón donde la inteligencia artificial se encuentra con la creatividad tradicional.
          </p>
        </header>

        <section className="space-y-12 text-gray-600">
          <div>
            <h2 className="text-2xl font-black text-gray-800 mb-4">Nuestra Misión</h2>
            <p className="leading-relaxed">
              Nuestra misión es democratizar el acceso al arte creativo. Utilizamos tecnología de vanguardia para generar dibujos únicos, limpios y divertidos que cualquier niño (o adulto) pueda disfrutar con sus lápices de colores.
            </p>
          </div>

          <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
            <h2 className="text-2xl font-black text-blue-800 mb-4">¿Qué nos hace diferentes?</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Dibujos únicos generados por IA",
                "Alta resolución para impresión",
                "Categorías modernas y actualizadas",
                "Descargas instantáneas sin registro",
                "Optimizado para cualquier dispositivo",
                "Contenido 100% gratuito siempre"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm font-bold text-blue-700">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-black text-gray-800 mb-4">El equipo</h2>
            <p className="leading-relaxed">
              Somos un pequeño equipo de entusiastas de la tecnología y el diseño que cree en el poder del "desconectarse" para colorear. Queremos que los más pequeños pasen menos tiempo frente a pantallas y más tiempo creando con sus manos.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
