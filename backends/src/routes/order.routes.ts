import express, { Router } from "express";
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deletOrder,
  countOrder,getOrderByUserId,orderTotalSales
} from "../controllers/order.controller";
import authUser from "../middleware/auth";
const router: Router = express.Router();

router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.get("/get/count", countOrder);
router.get('/get/userorder/:userid',getOrderByUserId)
router.get('/get/totalsales',orderTotalSales)
router.post("/", createOrder);
router.put("/:id", authUser, updateOrder);
router.delete("/:id", authUser, deletOrder);

export default router;
