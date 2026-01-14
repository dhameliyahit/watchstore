import express from "express";
import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../controller/cart.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getCart);
router.delete("/", protect, clearCart);

router.post("/items", protect, addCartItem);
router.put("/items/:productId", protect, updateCartItem);
router.delete("/items/:productId", protect, removeCartItem);

export default router;
