export default function Navbar() {
  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dibujos</h1>

        <div className="flex gap-6 text-gray-700">
          <a href="/" className="hover:text-black">Home</a>
          <a href="/categorias" className="hover:text-black">Categorias</a>
        </div>
      </nav>
    </header>
  );
}
