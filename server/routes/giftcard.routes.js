import express from "express";
import {
  createGiftCard,
  getGiftCardByCode,
  getGiftCards,
  redeemGiftCard,
} from "../controller/giftcard.controller.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:code", getGiftCardByCode);

router.get("/", protect, adminOnly, getGiftCards);
router.post("/", protect, adminOnly, createGiftCard);
router.post("/:code/redeem", protect, adminOnly, redeemGiftCard);

export default router;
