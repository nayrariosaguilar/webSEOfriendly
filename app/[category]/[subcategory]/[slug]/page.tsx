import Image from "next/image";
import { ShareButtons } from "@/frontend/components/share-buttons";
import { getDrawing } from "@/frontend/lib/api";
import { BreadcrumbJsonLd } from "next-seo";

const BASE = "https://dpvulchbiygiidolzrjl.supabase.co";
export function publicUrl(path: string) {
  return `${BASE}/storage/v1/object/public/${path}`;
}

export async function generateMetadata({ params }: any) {
  const { slug } = await params;
  const dibujo = await getDrawing(slug);

  if (!dibujo) {
    return { title: "Dibujo no encontrado | Colorear" };
  }

  return {
    title: `${dibujo.titulo} | Dibujos para Colorear`,
    description: dibujo.descripcion,
    alternates: {
      canonical: `https://tusitio.com/${dibujo.category_slug}/${dibujo.subcategory_slug}/${dibujo.slug}`,
    },
  };
}

export default async function DibujoPage({ params }: any) {
  const { slug } = await params;
  const dibujo = await getDrawing(slug);

  if (!dibujo) {
    return (
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-center text-3xl font-bold">Dibujo no encontrado</h1>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10">

      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "https://tusitio.com" },
          { name: dibujo.category_slug, item: `https://tusitio.com/${dibujo.category_slug}` },
          { name: dibujo.subcategory_slug, item: `https://tusitio.com/${dibujo.category_slug}/${dibujo.subcategory_slug}` },
          { name: dibujo.titulo }
        ]}
      />

      {/* JSON-LD Imagen */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageObject",
            name: dibujo.titulo,
            description: dibujo.descripcion,
            contentUrl: publicUrl(dibujo.imagen),
            url: `https://tusitio.com/${dibujo.category_slug}/${dibujo.subcategory_slug}/${dibujo.slug}`,
            encodingFormat: "image/jpeg",
            keywords: `${dibujo.category_slug}, ${dibujo.subcategory_slug}, colorear, dibujos para colorear`,
            interactionStatistic: [
              {
                "@type": "InteractionCounter",
                interactionType: { "@type": "LikeAction" },
                userInteractionCount: dibujo.likes || 0,
              },
              {
                "@type": "InteractionCounter",
                interactionType: { "@type": "DownloadAction" },
                userInteractionCount: dibujo.downloads || 0,
              },
            ],
            author: {
              "@type": "Organization",
              name: "Colorear Web",
              url: "https://tusitio.com",
            },
            license: "https://creativecommons.org/licenses/by/4.0/",
          }),
        }}
      />

      <h1 className="text-4xl font-bold mb-6 text-center">{dibujo.titulo}</h1>

      <div className="relative aspect-square w-full max-w-xl mx-auto">
        <Image
          src={publicUrl(dibujo.imagen)}
          alt={dibujo.titulo}
          fill
          className="object-contain"
        />
      </div>

      <p className="text-gray-700 text-lg mt-4 text-center max-w-2xl mx-auto">
        {dibujo.descripcion}
      </p>

      <ShareButtons titulo={dibujo.titulo} imagen={dibujo.imagen} />
    </main>
  );
}
