import express from "express";
import {
  createBooking,
  getAllBookings,
   updateBookingStatus,
  cancelBooking
} from "../../controllers/booking/booking.controller";

const router = express.Router();

router.post("/", createBooking);
router.get("/", getAllBookings);
router.put("/:id/cancel", cancelBooking);
router.put("/:id/status", updateBookingStatus);

export default router;