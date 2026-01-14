import express from "express";
import { createOrderFromCart } from "../controller/order.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrderFromCart);

export default router;
