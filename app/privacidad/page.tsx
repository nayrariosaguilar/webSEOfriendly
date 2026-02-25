import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacidad",
  description: "Política de privacidad de ColorearWeb.",
};

export default function PrivacidadPage() {
  return (
    <main className="container mx-auto px-4 py-12 sm:py-24 min-h-screen">
      <div className="max-w-3xl mx-auto prose prose-blue">
        <h1 className="text-4xl sm:text-6xl font-black text-gray-900 mb-12 tracking-tighter">
          Política de <span className="text-blue-600">Privacidad</span>
        </h1>
        
        <p className="text-gray-500 text-lg">
          En ColorearWeb, accesible desde colorearweb.com, una de nuestras principales prioridades es la privacidad de nuestros visitantes.
        </p>

        <h2 className="text-2xl font-black text-gray-800 mt-10">Información que recopilamos</h2>
        <p className="text-gray-600">
          No solicitamos registro ni información personal para descargar nuestros dibujos. Sin embargo, como muchos otros sitios web, podemos recopilar información de registro estándar y cookies para mejorar tu experiencia y analizar el tráfico del sitio.
        </p>

        <h2 className="text-2xl font-black text-gray-800 mt-10">Uso de Cookies</h2>
        <p className="text-gray-600">
          Utilizamos cookies para almacenar información sobre las preferencias de los visitantes, para registrar información específica del usuario sobre las páginas a las que el usuario accede o visita, y para personalizar el contenido de nuestra página web en función del tipo de navegador de los visitantes u otra información que el visitante envíe a través de su navegador.
        </p>

        <h2 className="text-2xl font-black text-gray-800 mt-10">Anuncios de terceros</h2>
        <p className="text-gray-600">
          Podemos utilizar empresas de publicidad de terceros para servir anuncios cuando visitas nuestro sitio web. Estas empresas pueden utilizar información sobre tus visitas a este y otros sitios web para proporcionar anuncios sobre bienes y servicios de tu interés.
        </p>
      </div>
    </main>
  );
}
