import Link from "next/link";

export function Header() {
  return (
    <header className="w-full border-b bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-pink-600">
          Colorear<span className="text-blue-600">Web</span>
        </Link>

        {/* Menu */}
        <div className="flex gap-6 text-sm font-medium">
          <Link href="/dibujos" className="hover:text-pink-600">Dibujos</Link>
          <Link href="/categorias" className="hover:text-pink-600">Categorías</Link>
          <Link href="/populares" className="hover:text-pink-600">Populares</Link>
          <Link href="/contacto" className="hover:text-pink-600">Contacto</Link>
        </div>
      </nav>
    </header>
  );
}
