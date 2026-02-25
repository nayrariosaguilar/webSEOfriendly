import Link from 'next/link';
import { Search, Palette, Menu } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-black text-xl sm:text-2xl text-blue-600">
          <Palette className="w-6 h-6 sm:w-8 sm:h-8" />
          <span>Colorear<span className="text-gray-800">Web</span></span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-gray-500">
          <Link href="/animales" className="hover:text-blue-600 transition-colors">Animales</Link>
          <Link href="/princesas" className="hover:text-blue-600 transition-colors">Princesas</Link>
          <Link href="/vehiculos" className="hover:text-blue-600 transition-colors">Vehículos</Link>
          <Link href="/educativos" className="hover:text-blue-600 transition-colors">Educativos</Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/buscar" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Search className="w-5 h-5 text-gray-600" />
          </Link>
          <button className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </nav>
  );
}
