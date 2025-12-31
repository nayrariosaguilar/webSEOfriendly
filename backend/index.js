import express from "express";
import cors from "cors";
import "dotenv/config";

import categoryRoutes from "./src/routes/categories.routes.js";
import subcategoryRoutes from "./src/routes/subcategories.routes.js";
import drawingsRoutes from "./src/routes/drawings.routes.js";
import interactionsRoutes from "./src/routes/interactions.routes.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/drawings", drawingsRoutes);
app.use("/api/trending", interactionsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
);
