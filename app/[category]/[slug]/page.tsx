import Image from "next/image";
import { ShareButtons } from "@/components/drawings/share-buttons";
import { getDrawing, getPublicUrl, type Drawing } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageParams {
  params: Promise<{
    category: string;
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
    title: dibujo.seo_title || `${dibujo.title} | Dibujos para Colorear`,
    description: dibujo.seo_description || dibujo.description,
    openGraph: {
      title: dibujo.og_title || dibujo.title,
      description: dibujo.og_description || dibujo.description || undefined,
    },
  };
}

export default async function DibujoPage({ params }: PageParams) {
  const { category, slug } = await params;
  const dibujo = await getDrawing(slug);

  if (!dibujo) {
    notFound();
  }

  const imageUrl = getPublicUrl(dibujo.original_path);

  return (
    <main className="container mx-auto px-4 py-6 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6 sm:mb-10 text-center">
          <div className="flex justify-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-widest mb-4">
            <Link href="/" className="hover:underline">Inicio</Link>
            <span className="text-gray-300">/</span>
            <Link href={`/${category}`} className="hover:underline capitalize">
              {dibujo.category_name || category}
            </Link>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black mb-4 text-gray-900 leading-tight">
            {dibujo.title}
          </h1>
        </header>

        <div className="relative aspect-square w-full max-w-2xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden mb-8 sm:mb-12">
          <Image
            src={imageUrl}
            alt={dibujo.title}
            fill
            className="object-contain p-4 sm:p-8"
            priority
          />
        </div>

        <div className="max-w-2xl mx-auto space-y-8">
          <p className="text-gray-600 text-base sm:text-xl text-center leading-relaxed px-4">
            {dibujo.description || "Descarga e imprime este dibujo para colorear totalmente gratis. Ideal para pasar una tarde creativa."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 border-t border-gray-100">
            <ShareButtons titulo={dibujo.title} imagen={imageUrl} />
          </div>
        </div>
      </div>
    </main>
  );
}
