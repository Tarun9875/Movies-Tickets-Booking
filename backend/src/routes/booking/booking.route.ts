// backend/src/routes/booking/booking.route.ts

import express from "express";
import {
  createBooking,
  getAllBookings,
  getUserBookings,
  updateBookingStatus,
  cancelBooking
} from "../../controllers/booking/booking.controller";

import { protect } from "../../middlewares/auth/auth.middleware";
import { isAdmin } from "../../middlewares/auth/role.middleware";

const router = express.Router();

/* ================= USER ROUTES ================= */

// Create booking
router.post("/", protect, createBooking);

// Get logged-in user's bookings
router.get("/my", protect, getUserBookings);

// Cancel own booking
router.put("/:id/cancel", protect, cancelBooking);

/* ================= ADMIN ROUTES ================= */

// Get ALL bookings (Admin only)
router.get("/admin", protect, isAdmin, getAllBookings);

// Update booking status (Admin only)
router.put("/:id/status", protect, isAdmin, updateBookingStatus);

export default router;