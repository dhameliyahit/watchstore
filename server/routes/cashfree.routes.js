import express from "express";
import {
  cashfreeCallback,
  initiateCashfreePayment,
} from "../controller/cashfree.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/initiate", protect, initiateCashfreePayment);
router.post("/callback", cashfreeCallback);

export default router;
