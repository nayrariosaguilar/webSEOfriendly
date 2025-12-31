import { getDrawingBySlug } from "../services/drawings.service.js";

export async function fetchDrawing(req, res) {
  const slug = req.params.slug;
  const { data, error } = await getDrawingBySlug(slug);
  if (error) return res.status(404).json({ error });
  return res.json(data);
}
