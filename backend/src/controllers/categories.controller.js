import {
  getAllCategories,
  getCategoryBySlug,
  getSubcategoriesByCategorySlug,
} from "../services/categories.service.js";

export async function fetchCategories(req, res) {
  const { data, error } = await getAllCategories();
  if (error) return res.status(500).json({ error });
  return res.json(data);
}

export async function fetchCategory(req, res) {
  const slug = req.params.slug;
  const { data, error } = await getCategoryBySlug(slug);
  if (error) return res.status(404).json({ error });
  return res.json(data);
}

export async function fetchSubcategories(req, res) {
  const slug = req.params.slug;
  const { data, error } = await getSubcategoriesByCategorySlug(slug);
  if (error) return res.status(404).json({ error });
  return res.json(data);
}
