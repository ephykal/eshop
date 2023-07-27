import express, { Router } from "express";
import {
  getAllCategory,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";
const router: Router = express.Router();

import authUser from "../middleware/auth";

router.get("/", getAllCategory);
router.get("/:id", getCategoryById);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", authUser, deleteCategory);

export default router;
