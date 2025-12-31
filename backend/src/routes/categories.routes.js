import { Router } from "express";
import {
  fetchCategories,
  fetchCategory,
  fetchSubcategories,
} from "../controllers/categories.controller.js";

const router = Router();

router.get("/", fetchCategories);
router.get("/:slug", fetchCategory);
router.get("/:slug/subcategories", fetchSubcategories);

export default router;

