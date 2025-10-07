import express from "express";
import User from "../models/User.js";
import Worker from "../models/Worker.js";
import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Middleware to check admin
const adminOnly = async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Get all users
router.get("/users", auth, adminOnly, async (_req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Get all workers
router.get("/workers", auth, adminOnly, async (_req, res) => {
  try {
    const workers = await Worker.find().select('-password');
    res.json(workers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching workers" });
  }
});

// Get all bookings (with user, service, and worker info) - with pagination
router.get("/bookings", auth, adminOnly, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const totalBookings = await Booking.countDocuments();

    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('serviceId', 'name')
      .populate('workerId', 'name')
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalBookings / limit);

    res.json({
      bookings,
      pagination: {
        currentPage: page,
        totalPages,
        totalBookings,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// Edit a booking (admin can update any field)
router.put("/bookings/:id", auth, adminOnly, async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Booking not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating booking" });
  }
});

// Get all services (for completeness)
router.get("/services", auth, adminOnly, async (_req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Error fetching services" });
  }
});

export default router;
