import {
  getCategories,
  getSubcategoriesByCategory,
  getDrawingsBySubcategory,
} from "@/lib/api";

export default async function sitemap() {
  const categories = await getCategories();

  const subcatsNested = await Promise.all(
    categories.map((cat: any) => getSubcategoriesByCategory(cat.slug))
  );
  const subcats = subcatsNested.flatMap((subcatList) => subcatList ?? []);

  const drawingsNested = await Promise.all(
    subcats.map((sub: any) => getDrawingsBySubcategory(sub.slug))
  );
  const drawings = drawingsNested.flatMap((drawingList) => drawingList ?? []);

  const categoryUrls = categories.map((cat: any) => ({
    url: `https://tusitio.com/${cat.slug}`,
    lastModified: new Date(),
  }));

  const subcatUrls = subcats.map((sub: any) => ({
    url: `https://tusitio.com/${sub.category_slug}/${sub.slug}`,
    lastModified: new Date(),
  }));

  const drawingUrls = drawings.map((d: any) => ({
    url: `https://tusitio.com/${d.category_slug}/${d.subcategory_slug}/${d.slug}`,
    lastModified: new Date(d.created_at),
  }));

  return [...categoryUrls, ...subcatUrls, ...drawingUrls];
}
