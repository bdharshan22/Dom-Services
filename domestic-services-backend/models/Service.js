import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
  name: { type: String, required: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, default: "general" },
  image: { type: String, default: "" },
  available: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);