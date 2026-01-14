import Wishlist from "../models/wishlist.model.js";
import Product from "../models/product.model.js";

/**
 * @desc Get wishlist for current user
 * @route GET /api/wishlist
 * @access Private (JWT)
 */
export const getWishlist = async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
    "items"
  );
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, items: [] });
  }
  res.json(wishlist);
};

/**
 * @desc Add product to wishlist
 * @route POST /api/wishlist
 * @access Private (JWT)
 */
export const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  if (!productId) {
    return res.status(400).json({ message: "productId is required" });
  }

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    return res.status(404).json({ message: "Product not found" });
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, items: [] });
  }

  if (!wishlist.items.find((id) => id.toString() === productId)) {
    wishlist.items.push(productId);
  }

  const updated = await wishlist.save();
  await updated.populate("items");
  res.json(updated);
};

/**
 * @desc Remove product from wishlist
 * @route DELETE /api/wishlist/:productId
 * @access Private (JWT)
 */
export const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    return res.status(404).json({ message: "Wishlist not found" });
  }

  wishlist.items = wishlist.items.filter(
    (id) => id.toString() !== productId
  );

  const updated = await wishlist.save();
  await updated.populate("items");
  res.json(updated);
};
