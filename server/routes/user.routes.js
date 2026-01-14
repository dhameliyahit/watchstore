import express from "express";
import {
  changeUserRole,
  deleteUserAccount,
  getAllUsers,
  getUserProfile,
  loginUser,
  registerUser,
  updateUserProfile,
} from "../controller/user.controller.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

/* JWT protected routes */
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.delete("/profile", protect, deleteUserAccount);

/* Admin routes */
router.get("/", protect, adminOnly, getAllUsers);
router.put("/:id/role", protect, adminOnly, changeUserRole);


export default router;
