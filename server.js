import express from "express";
import next from "next";
import cors from "cors";
import "dotenv/config";

import categoryRoutes from "./backend/src/routes/categories.routes.js";
import subcategoryRoutes from "./backend/src/routes/subcategories.routes.js";
import drawingsRoutes from "./backend/src/routes/drawings.routes.js";
import interactionsRoutes from "./backend/src/routes/interactions.routes.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(cors());
  server.use(express.json());

  // API Routes del backend
  server.use("/api/categories", categoryRoutes);
  server.use("/api/subcategories", subcategoryRoutes);
  server.use("/api/drawings", drawingsRoutes);
  server.use("/api/trending", interactionsRoutes);

  // Todas las demás rutas las maneja Next.js
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`🚀 Server ready on http://${hostname}:${port}`);
    console.log(`📱 Frontend: http://${hostname}:${port}`);
    console.log(`🔌 Backend API: http://${hostname}:${port}/api`);
  });
});
