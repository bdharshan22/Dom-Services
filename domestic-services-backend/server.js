import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";


import authRoutes from "./routes/auth.js";
import serviceRoutes from "./routes/services.js";
import bookingRoutes from "./routes/bookings.js";
import paymentRoutes from "./routes/payments.js";
import adminRoutes from "./routes/admin.js";

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-vercel-app.vercel.app'] 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Connect DB
connectDB();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));