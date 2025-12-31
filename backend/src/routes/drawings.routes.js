import { Router } from "express";
import { fetchDrawing } from "../controllers/drawings.controller.js";

const router = Router();

router.get("/:slug", fetchDrawing);

export default router;

