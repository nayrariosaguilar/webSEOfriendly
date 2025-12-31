import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/frontend/lib/api";
import { BreadcrumbJsonLd} from "next-seo";

const BASE = "https://dpvulchbiygiidolzrjl.supabase.co";
export function publicUrl(path: string) {
  return `${BASE}/storage/v1/object/public/${path}`;
}

export default async function CategoryPage({ params }: any) {
  const { category } = await params;
  // 🔥 Llamas a tu backend
  const subcategorias = await getCategories();
  // 🔥 JSON-LD — Breadcrumb SEO
  const breadcrumbLd = (
    <BreadcrumbJsonLd
      items={[
        {
          name: "Inicio",
          item: "https://tusitio.com",
        },
        {
          name: category,
          item: `https://tusitio.com/${category}`,
        },
      ]}
    />
  );

  if (!subcategorias || subcategorias.length === 0) {
    return (
      <main className="container mx-auto py-10 px-4">
        {breadcrumbLd}

          <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `Subcategorías de ${category}`,
          itemListElement: subcategorias.map((sub: any, index: number) => ({
            "@type": "ListItem",
            position: index + 1,
            name: sub.nombre,
            url: `https://tusitio.com/${category}/${sub.slug}`,
            image: publicUrl(sub.imagen),
          })),
        }),
      }}
    />
        <h1 className="text-4xl font-bold mb-8 capitalize">
          {category.replace("-", " ")}
        </h1>

        <p className="text-lg text-gray-600">
          No hay subcategorías en esta categoría todavía.
        </p>
      </main>
    );
  }

  return (
    <main className="container mx-auto py-10 px-4">
      {breadcrumbLd}

      <h1 className="text-4xl font-bold mb-8 capitalize">
        {category.replace("-", " ")}
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10">
        {subcategorias.map((sub: any) => (
          <Link
            key={sub.slug}
            href={`/${category}/${sub.slug}`}
            className="flex flex-col items-center text-center"
          >
            <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg">
              <Image
                src={publicUrl(sub.imagen)}
                alt={sub.nombre}
                width={128}
                height={128}
                className="object-cover"
              />
            </div>

            <span className="mt-3 font-semibold capitalize">
              {sub.nombre}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
