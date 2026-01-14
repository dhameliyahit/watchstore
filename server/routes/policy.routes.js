import express from "express";
import { getPolicyByKey, upsertPolicy } from "../controller/policy.controller.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:key", getPolicyByKey);
router.put("/:key", protect, adminOnly, upsertPolicy);

export default router;
