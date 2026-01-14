import Product from "../models/product.model.js";
import Review from "../models/review.model.js";

const updateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });
  const numReviews = reviews.length;
  const averageRating = numReviews
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews
    : 0;

  await Product.findByIdAndUpdate(productId, {
    numReviews,
    averageRating: Number(averageRating.toFixed(2)),
  });
};

/**
 * @desc Get reviews for a product
 * @route GET /api/reviews/product/:productId
 * @access Public
 */
export const getProductReviews = async (req, res) => {
  const { productId } = req.params;
  const reviews = await Review.find({ product: productId })
    .populate("user", "firstName lastName")
    .sort({ createdAt: -1 });
  res.json(reviews);
};

/**
 * @desc Create review for product
 * @route POST /api/reviews
 * @access Private (JWT)
 */
export const createReview = async (req, res) => {
  const { productId, rating, comment } = req.body;

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    return res.status(404).json({ message: "Product not found" });
  }

  const numericRating = Number(rating);
  if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ message: "Rating must be 1-5" });
  }

  const existing = await Review.findOne({
    product: productId,
    user: req.user._id,
  });
  if (existing) {
    return res.status(400).json({ message: "You already reviewed this product" });
  }

  const review = await Review.create({
    product: productId,
    user: req.user._id,
    rating: numericRating,
    comment,
  });

  await updateProductRating(productId);

  res.status(201).json(review);
};

/**
 * @desc Delete review (admin)
 * @route DELETE /api/reviews/:id
 * @access Private (JWT + Admin)
 */
export const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  await review.deleteOne();
  await updateProductRating(review.product);

  res.json({ message: "Review deleted successfully" });
};
