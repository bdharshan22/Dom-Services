import express from "express";
import { getMyBookings, getAllBookings, getWorkerBookings, getWorkerAnalytics, createBooking, updateBookingStatus, updateBookingRating, generateInvoice } from "../controllers/bookingController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getMyBookings);
router.get("/all", auth, getAllBookings);
router.get("/worker", auth, getWorkerBookings);
router.get("/worker/analytics", auth, getWorkerAnalytics);
router.post("/", auth, createBooking);
router.patch("/:id", auth, updateBookingStatus);
router.patch("/:id/rating", auth, updateBookingRating);
router.get("/:id/invoice", auth, generateInvoice);

export default router;
