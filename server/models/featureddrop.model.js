import mongoose from "mongoose";

const featuredDropSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    startsAt: { type: Date },
    endsAt: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const FeaturedDrop = mongoose.model("FeaturedDrop", featuredDropSchema);

export default FeaturedDrop;
