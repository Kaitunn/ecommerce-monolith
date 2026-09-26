import express from "express";
import cors from "cors";
import prisma from "./config/prisma.js";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import shipmentRoutes from "./routes/shipment.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/shipments", shipmentRoutes);

// Health check
app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return res.status(200).json({
      status: "OK",
      message: "Ecommerce API is healthy",
      database: "connected",
    });
  } catch (error) {
    console.error("Health check error:", error);

    return res.status(503).json({
      status: "ERROR",
      message: "Ecommerce API is unhealthy",
      database: "disconnected",
    });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Ecommerce Monolithic REST API",
  });
});

export default app;