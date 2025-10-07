import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  serviceName: {
    type: String,
    default: "",
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  specialInstructions: {
    type: String,
    default: "",
  },
  emergencyContact: {
    name: {
      type: String,
      default: "",
    },
    mobile: {
      type: String,
      default: "",
    },
    relationship: {
      type: String,
      default: "",
    },
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },
  paymentIntentId: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "in_progress", "completed", "cancelled"],
    default: "pending",
  },
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  acceptedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },
  review: {
    type: String,
    default: "",
  },
  ratedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

export default mongoose.model("Booking", bookingSchema);
