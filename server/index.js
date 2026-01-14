import cors from "cors";
import "dotenv/config";
import express from "express";
import connectDB from "./db/connectDB.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import checkoutRoutes from "./routes/checkout.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import giftCardRoutes from "./routes/giftcard.routes.js";
import featuredDropRoutes from "./routes/featureddrop.routes.js";
import policyRoutes from "./routes/policy.routes.js";
import cashfreeRoutes from "./routes/cashfree.routes.js";
connectDB();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/giftcards", giftCardRoutes);
app.use("/api/featured-drops", featuredDropRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/payments/cashfree", cashfreeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
