import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description: "¿Tienes alguna duda o sugerencia? Ponte en contacto con el equipo de ColorearWeb.",
};

export default function ContactoPage() {
  return (
    <main className="container mx-auto px-4 py-12 sm:py-24 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 mb-6 tracking-tighter">
            Di <span className="text-blue-600">Hola</span>
          </h1>
          <p className="text-xl text-gray-500">
            ¿Quieres sugerir una nueva categoría? ¿Has encontrado un error? ¡Escríbenos!
          </p>
        </header>

        <form className="space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl shadow-blue-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Nombre</label>
              <input 
                type="text" 
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Tu nombre"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
              <input 
                type="email" 
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="tu@email.com"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Mensaje</label>
            <textarea 
              rows={5}
              className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="¿En qué podemos ayudarte?"
            ></textarea>
          </div>

          <button className="w-full py-5 bg-blue-600 text-white font-black text-lg rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
            Enviar Mensaje
          </button>
        </form>
      </div>
    </main>
  );
}
