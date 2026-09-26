import express from "express";
import {
  createOrder,
  getMyOrders,
} from "../controllers/order.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateToken, createOrder);
router.get("/my", authenticateToken, getMyOrders);

export default router;