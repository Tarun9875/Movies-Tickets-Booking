// booking.route.ts
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

router.post("/", protect, createBooking);
router.get("/", protect, getUserBookings);
router.put("/:id/cancel", protect, cancelBooking);

/* ================= ADMIN ROUTES ================= */

router.get("/admin", protect, isAdmin, getAllBookings);
router.put("/:id/status", protect, isAdmin, updateBookingStatus);

export default router;