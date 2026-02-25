import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos de Uso",
  description: "Términos y condiciones de uso de ColorearWeb.",
};

export default function TerminosPage() {
  return (
    <main className="container mx-auto px-4 py-12 sm:py-24 min-h-screen">
      <div className="max-w-3xl mx-auto prose prose-blue">
        <h1 className="text-4xl sm:text-6xl font-black text-gray-900 mb-12 tracking-tighter">
          Términos de <span className="text-blue-600">Uso</span>
        </h1>
        
        <p className="text-gray-500 text-lg">
          Al acceder a este sitio web, asumimos que aceptas estos términos y condiciones en su totalidad. No sigas usando ColorearWeb si no aceptas todos los términos y condiciones establecidos en esta página.
        </p>

        <h2 className="text-2xl font-black text-gray-800 mt-10">Licencia de Uso</h2>
        <p className="text-gray-600">
          A menos que se indique lo contrario, ColorearWeb y/o sus licenciantes poseen los derechos de propiedad intelectual de todo el material en ColorearWeb. Todos los derechos de propiedad intelectual están reservados. Puedes ver y/o imprimir páginas de colorearweb.com para tu uso personal sujeto a las restricciones establecidas en estos términos y condiciones.
        </p>

        <h2 className="text-2xl font-black text-gray-800 mt-10">No debes:</h2>
        <ul className="list-disc ml-5 text-gray-600 space-y-2">
          <li>Republicar material de ColorearWeb en otros sitios web sin permiso.</li>
          <li>Vender, alquilar o sublicenciar material de ColorearWeb.</li>
          <li>Reproducir, duplicar o copiar material de ColorearWeb con fines comerciales.</li>
        </ul>

        <h2 className="text-2xl font-black text-gray-800 mt-10">Uso de los dibujos</h2>
        <p className="text-gray-600">
          Nuestros dibujos están destinados al uso educativo y personal. Se permite su uso en escuelas, bibliotecas y hogares sin cargo alguno.
        </p>
      </div>
    </main>
  );
}
