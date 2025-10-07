import express from "express";
import { createOrder, verifyPayment, getPaymentStatus } from "../controllers/paymentController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Create order
router.post("/create-order", auth, createOrder);

// Verify payment and create booking
router.post("/verify-payment", auth, verifyPayment);

// Get payment status
router.get("/status/:paymentId", auth, getPaymentStatus);

export default router;