import Image from "next/image";
import { ShareButtons } from "@/frontend/components/share-buttons";
import { getDrawing, getPublicUrl, type Drawing } from "@/frontend/lib/api";
import { BreadcrumbJsonLd } from "next-seo";
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
    alternates: {
      canonical: `https://tusitio.com/${dibujo.category_slug}/${dibujo.subcategory_slug}/${dibujo.slug}`,
    },
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
            contentUrl: imageUrl,
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
          src={imageUrl}
          alt={dibujo.titulo}
          fill
          className="object-contain"
        />
      </div>

      <p className="text-gray-700 text-lg mt-4 text-center max-w-2xl mx-auto">
        {dibujo.descripcion}
      </p>

      <ShareButtons titulo={dibujo.titulo} imagen={imageUrl} />
    </main>
  );
}
