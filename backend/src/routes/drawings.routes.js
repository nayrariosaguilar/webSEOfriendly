import { Router } from "express";
import { fetchDrawing } from "../controllers/drawings.controller.js";
import { getAllDrawingsPaginated } from "../services/drawings.service.js";

const router = Router();

// GET /api/drawings/all?sortBy=popular&page=1&limit=30
router.get("/all", async (req, res) => {
  const { sortBy = 'popular', page = 1, limit = 30 } = req.query;
  const { data, count, error } = await getAllDrawingsPaginated({
    sortBy,
    page: parseInt(page),
    limit: parseInt(limit)
  });

  if (error) return res.status(500).json({ error });

  res.json({
    drawings: data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      totalPages: Math.ceil(count / parseInt(limit))
    }
  });
});

router.get("/:slug", fetchDrawing);

export default router;

