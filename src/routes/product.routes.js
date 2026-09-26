import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:pid", getProductById);

router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN"),
  createProduct
);

router.put(
  "/:pid",
  authenticateToken,
  authorizeRoles("ADMIN"),
  updateProduct
);

router.delete(
  "/:pid",
  authenticateToken,
  authorizeRoles("ADMIN"),
  deleteProduct
);

export default router;