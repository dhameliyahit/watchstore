import express from "express";
import {
  getAllOrders,
  getMyOrders,
  getOrderById,
  markOrderDelivered,
  markOrderPaid,
  markOrderShipped,
  cancelOrder,
  refundOrder,
} from "../controller/order.controller.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/pay", protect, adminOnly, markOrderPaid);
router.put("/:id/ship", protect, adminOnly, markOrderShipped);
router.put("/:id/deliver", protect, adminOnly, markOrderDelivered);
router.put("/:id/cancel", protect, adminOnly, cancelOrder);
router.put("/:id/refund", protect, adminOnly, refundOrder);

export default router;
