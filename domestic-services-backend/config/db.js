import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/domestic-services";
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  }
};

export default connectDB;