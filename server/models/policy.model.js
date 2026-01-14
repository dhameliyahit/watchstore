import mongoose from "mongoose";

const policySchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    warrantyInfo: { type: String, trim: true },
    authenticityInfo: { type: String, trim: true },
    returnsPolicy: { type: String, trim: true },
  },
  { timestamps: true }
);

const Policy = mongoose.model("Policy", policySchema);

export default Policy;
