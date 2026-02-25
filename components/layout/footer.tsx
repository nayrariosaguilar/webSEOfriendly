import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-black text-blue-600 mb-4">ColorearWeb</h3>
            <p className="text-gray-500 text-sm max-w-xs">
              La mejor colección de dibujos para colorear e imprimir gratis. 
              Actualizamos nuestra galería diariamente con contenido generado por IA.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">Explorar</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/animales" className="hover:text-blue-600">Animales para colorear</Link></li>
              <li><Link href="/flores" className="hover:text-blue-600">Flores para imprimir</Link></li>
              <li><Link href="/Disney" className="hover:text-blue-600">Dibujos Disney</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/privacidad" className="hover:text-blue-600">Privacidad</Link></li>
              <li><Link href="/terminos" className="hover:text-blue-600">Términos de uso</Link></li>
              <li><Link href="/contacto" className="hover:text-blue-600">Contacto</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} ColorearWeb. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
