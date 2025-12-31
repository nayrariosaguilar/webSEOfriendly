import { Router } from "express";
import {
  fetchSubcategory,
  fetchDrawings,
} from "../controllers/subcategories.controller.js";

const router = Router();

router.get("/:slug", fetchSubcategory);
router.get("/:slug/drawings", fetchDrawings);

export default router;
