import { getCategories, getSubcategory, getDrawing,getDrawingsBySubcategory  } from "@/frontend/lib/api";

export default async function sitemap() {
  const categories = await getCategories();

  const subcats = await Promise.all(
    categories.map((cat: any) => getSubcategory(cat.slug))
  );

  const drawings = await Promise.all(
    subcats.flat().map((sub: any) => getDrawingsBySubcategory(sub.slug))
  );

  const categoryUrls = categories.map((cat: any) => ({
    url: `https://tusitio.com/${cat.slug}`,
    lastModified: new Date(),
  }));

  const subcatUrls = subcats.flat().map((sub: any) => ({
    url: `https://tusitio.com/${sub.category_slug}/${sub.slug}`,
    lastModified: new Date(),
  }));

  const drawingUrls = drawings
    .flat()
    .map((d: any) => ({
      url: `https://tusitio.com/${d.category_slug}/${d.subcategory_slug}/${d.slug}`,
      lastModified: new Date(d.created_at),
    }));

  return [...categoryUrls, ...subcatUrls, ...drawingUrls];
}
