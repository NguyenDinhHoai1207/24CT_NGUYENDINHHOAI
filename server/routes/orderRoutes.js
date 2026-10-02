import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats
} from "../controllers/orderController.js";

const router = express.Router();

router.route("/")
  .get(getOrders)
  .post(createOrder);

router.get("/stats/summary", getOrderStats);

router.route("/:id")
  .get(getOrderById);

router.patch("/:id/status", updateOrderStatus);

export default router;
