import express from "express";
import {
  createShipment,
  getAllShipments,
  updateShipmentStatus,
} from "../controllers/shipment.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN"),
  getAllShipments
);

router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN"),
  createShipment
);

router.patch(
  "/:shipid",
  authenticateToken,
  authorizeRoles("ADMIN"),
  updateShipmentStatus
);

export default router;