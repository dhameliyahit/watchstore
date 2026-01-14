import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true, index: true },
    collection: { type: String, trim: true },
    sku: { type: String, trim: true, unique: true, sparse: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR", trim: true },
    images: [{ type: String, trim: true }],
    stock: { type: Number, default: 0, min: 0 },
    caseSize: { type: Number, min: 0 },
    caseMaterial: { type: String, trim: true },
    strapMaterial: { type: String, trim: true },
    movement: { type: String, trim: true },
    waterResistance: { type: String, trim: true },
    gender: { type: String, trim: true },
    categories: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

productSchema.index({
  name: "text",
  brand: "text",
  collection: "text",
  description: "text",
});

const Product = mongoose.model("Product", productSchema);

export default Product;
