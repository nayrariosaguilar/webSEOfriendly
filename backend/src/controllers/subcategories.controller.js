import {
  getSubcategoryBySlug,
  getDrawingsBySubcategorySlug,
} from "../services/subcategories.service.js";

export async function fetchSubcategory(req, res) {
  const slug = req.params.slug;
  const { data, error } = await getSubcategoryBySlug(slug);
  if (error) return res.status(404).json({ error });
  return res.json(data);
}

export async function fetchDrawings(req, res) {
  const slug = req.params.slug;
  const { data, error } = await getDrawingsBySubcategorySlug(slug);
  if (error) return res.status(404).json({ error });
  return res.json(data);
}
