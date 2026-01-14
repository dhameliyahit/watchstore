import cors from "cors";
import "dotenv/config";
import express from "express";
import connectDB from "./db/connectDB.js";
import cartRoutes from "./routes/cart.routes.js";
import cashfreeRoutes from "./routes/cashfree.routes.js";
import checkoutRoutes from "./routes/checkout.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import featuredDropRoutes from "./routes/featureddrop.routes.js";
import giftCardRoutes from "./routes/giftcard.routes.js";
import orderRoutes from "./routes/order.routes.js";
import policyRoutes from "./routes/policy.routes.js";
import productRoutes from "./routes/product.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import userRoutes from "./routes/user.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
connectDB();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

import mongoose from "mongoose";
app.get("/health", async (req, res) => {
  
  const dbState = mongoose.connection.readyState;
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting

  if (dbState === 1) {
    return res.status(200).json({
      status: "OK",
      database: "connected",
      message: "API and database are healthy",
    });
  }

  return res.status(500).json({
    status: "ERROR",
    database: "disconnected",
    message: "Database connection failed",
  });
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
