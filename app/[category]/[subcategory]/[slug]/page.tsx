import Image from "next/image";
import { ShareButtons } from "@/components/drawings/share-buttons";
import { getDrawing, getPublicUrl, type Drawing } from "@/lib/api";
import { notFound } from "next/navigation";

interface PageParams {
  params: Promise<{
    category: string;
    subcategory: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageParams) {
  const { slug } = await params;
  const dibujo: Drawing | null = await getDrawing(slug);

  if (!dibujo) {
    return { title: "Dibujo no encontrado | Colorear" };
  }

  return {
    title: `${dibujo.titulo} | Dibujos para Colorear`,
    description: dibujo.descripcion,
  };
}

export default async function DibujoPage({ params }: PageParams) {
  const { slug } = await params;
  const dibujo = await getDrawing(slug);

  if (!dibujo) {
    notFound();
  }

  const imageUrl = getPublicUrl(dibujo.imagen);

  return (
    <main className="container mx-auto px-4 py-6 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6 sm:mb-10 text-center">
          <h1 className="text-3xl sm:text-5xl font-black mb-4 text-gray-900 leading-tight">
            {dibujo.titulo}
          </h1>
          <div className="flex justify-center gap-4 text-xs sm:text-sm font-bold text-blue-500 uppercase tracking-widest">
            <span>{dibujo.category_slug}</span>
            <span className="text-gray-300">•</span>
            <span>{dibujo.subcategory_slug}</span>
          </div>
        </header>

        <div className="relative aspect-square w-full max-w-2xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden mb-8 sm:mb-12">
          <Image
            src={imageUrl}
            alt={dibujo.titulo}
            fill
            className="object-contain p-4 sm:p-8"
            priority
          />
        </div>

        <div className="max-w-2xl mx-auto space-y-8">
          <p className="text-gray-600 text-base sm:text-xl text-center leading-relaxed px-4">
            {dibujo.descripcion || "Descarga e imprime este dibujo para colorear totalmente gratis. Ideal para pasar una tarde creativa."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 border-t border-gray-100">
            <ShareButtons titulo={dibujo.titulo} imagen={imageUrl} />
          </div>
        </div>
      </div>
    </main>
  );
}
