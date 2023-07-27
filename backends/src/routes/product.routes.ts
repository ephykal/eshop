import express, { Router } from "express";
import {
  getAllProduct,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  featuredProduct,
  productCount,
  productImagesUpdate,
} from "../controllers/product.controller";

import authUser from "../middleware/auth";
import {
  uploadMiddleware,
  multipleUploadMiddleware,
} from "../middleware/upload";

const router: Router = express.Router();

router.get("/", getAllProduct);
router.get("/:id", getProductById);
router.get("/get/featured/:count", featuredProduct);
router.get("/get/count", productCount);
router.post("/", authUser, uploadMiddleware, createProduct);
router.put("/:id", authUser, updateProduct);
router.put(
  "/images/:id",
  authUser,
  multipleUploadMiddleware,
  productImagesUpdate
);
router.delete("/:id", authUser, deleteProduct);

export default router;
