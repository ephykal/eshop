import express, { Router } from "express";
import {
  getAllProduct,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  featuredProduct,
  productCount,
} from "../controllers/product.controller";

const router: Router = express.Router();

router.get("/", getAllProduct);
router.get("/:id", getProductById);
router.get("/get/featured/:count", featuredProduct);
router.get("/get/count", productCount);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
