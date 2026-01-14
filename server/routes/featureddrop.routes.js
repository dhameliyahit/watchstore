import express from "express";
import {
  createFeaturedDrop,
  deleteFeaturedDrop,
  getFeaturedDrops,
  updateFeaturedDrop,
} from "../controller/featureddrop.controller.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getFeaturedDrops);
router.post("/", protect, adminOnly, createFeaturedDrop);
router.put("/:id", protect, adminOnly, updateFeaturedDrop);
router.delete("/:id", protect, adminOnly, deleteFeaturedDrop);

export default router;
