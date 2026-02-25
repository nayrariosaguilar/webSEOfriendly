import { getCategories, getAllDrawings } from "@/lib/api";

export default async function sitemap() {
  const categories = await getCategories();
  const drawings = await getAllDrawings();

  const categoryUrls = categories.map((cat) => ({
    url: `https://tusitio.com/${cat.slug}`,
    lastModified: new Date(),
  }));

  const drawingUrls = drawings.map((d) => ({
    url: `https://tusitio.com/${d.category_slug || 'dibujos'}/${d.slug}`,
    lastModified: d.published_at ? new Date(d.published_at) : new Date(),
  }));

  return [...categoryUrls, ...drawingUrls];
}
