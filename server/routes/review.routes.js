import express from "express";
import {
  createReview,
  deleteReview,
  getProductReviews,
} from "../controller/review.controller.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/product/:productId", getProductReviews);
router.post("/", protect, createReview);
router.delete("/:id", protect, adminOnly, deleteReview);

export default router;
