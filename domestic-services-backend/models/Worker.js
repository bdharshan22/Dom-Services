import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const workerSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    email: { type: String, required: [true, "Email is required"], unique: true },
    password: { type: String, required: [true, "Password is required"] },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    skills: [{ type: String }],
    experience: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    isAvailable: { type: Boolean, default: true },
    profileImage: { type: String, default: "" },
    documents: [{
      type: { type: String },
      url: { type: String },
      verified: { type: Boolean, default: false }
    }],
    role: { type: String, default: "worker" }
  },
  { timestamps: true }
);

workerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

workerSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model("Worker", workerSchema);
