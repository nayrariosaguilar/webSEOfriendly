import { Router } from "express";
import { addLike, addDownload, getTrendingDrawings } from "../services/drawings.service.js";

const router = Router();

// GET /api/trending
router.get("/", async (req, res) => {
  const { data, error } = await getTrendingDrawings();
  if (error) return res.status(500).json({ error });
  return res.json(data);
});

// POST /api/trending/:slug/like
router.post("/:slug/like", async (req, res) => {
  const slug = req.params.slug;
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;
  const result = await addLike(slug, ip);
  if (result.error) return res.status(400).json(result);
  return res.json(result);
});

// POST /api/trending/:slug/download
router.post("/:slug/download", async (req, res) => {
  const slug = req.params.slug;
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;
  const result = await addDownload(slug, ip);
  if (result.error) return res.status(400).json(result);
  return res.json(result);
});

export default router;

