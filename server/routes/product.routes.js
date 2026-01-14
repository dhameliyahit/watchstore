import express from "express";
import multer from "multer";
import {
  createProduct,
  deleteProduct,
  getAllBrands,
  getProductById,
  getProductFilters,
  getProducts,
  updateProduct,
  uploadProductImage,
  adjustProductStock,
} from "../controller/product.controller.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

router.get("/", getProducts);
router.get("/filters", getProductFilters);
router.get("/brands", getAllBrands);
router.get("/:id", getProductById);

/* Admin routes */
router.post("/", protect, adminOnly, upload.array("images", 10), createProduct);
router.post(
  "/:id/images",
  protect,
  adminOnly,
  upload.array("images", 10),
  uploadProductImage
);
router.put("/:id", protect, adminOnly, updateProduct);
router.patch("/:id/stock", protect, adminOnly, adjustProductStock);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
