import { Request, Response } from "express";
import Booking from "../../models/Booking.model";
import Show from "../../models/Show.model";

/* =====================================================
   CUSTOM AUTH REQUEST TYPE
===================================================== */

interface AuthRequest extends Request {
  user?: {
    id: string;
    role?: string;
    email?: string;
  };
}

/* =====================================================
   CREATE BOOKING
===================================================== */

export const createBooking = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      showId,
      seats,
      paymentMethod,
      name,
      email,
      movieTitle,
      selectedDate,
      selectedTime,
      selectedLanguage,
    } = req.body;

    /* ========== VALIDATION ========== */

    if (!showId)
      return res.status(400).json({ message: "Show ID required" });

    if (!Array.isArray(seats) || seats.length === 0)
      return res.status(400).json({ message: "Please select seats" });

    if (!name || !email)
      return res.status(400).json({ message: "Name & Email required" });

    if (!selectedDate || !selectedTime || !selectedLanguage)
      return res.status(400).json({ message: "Show details missing" });

    if (!["UPI", "CARD"].includes(paymentMethod))
      return res.status(400).json({ message: "Invalid payment method" });

    /* ========== FETCH SHOW ========== */

    const show = await Show.findById(showId);

    if (!show)
      return res.status(404).json({ message: "Show not found" });

    if (show.status && show.status !== "ACTIVE")
      return res.status(400).json({ message: "Show is not active" });

    /* ========== DUPLICATE SEAT CHECK ========== */

    const alreadyBooked = seats.some((seat: string) =>
      show.bookedSeats.includes(seat)
    );

    if (alreadyBooked)
      return res.status(400).json({
        message: "One or more seats already booked",
      });

    /* ========== PRICE CALCULATION ========== */

    let totalAmount = 0;

    show.seatCategories.forEach((category: any) => {
      category.rows.forEach((row: string) => {
        seats.forEach((seat: string) => {
          if (seat.startsWith(row)) {
            totalAmount += category.price;
          }
        });
      });
    });

    if (totalAmount <= 0)
      return res.status(400).json({
        message: "Invalid seat pricing",
      });

    /* ========== SAVE BOOKED SEATS ========== */

    show.bookedSeats.push(...seats);
    await show.save();

    /* ========== CREATE BOOKING ========== */

    const booking = await Booking.create({
      user: userId,
      name,
      email,
      movieTitle,
      show: showId,
      selectedDate,
      selectedTime,
      selectedLanguage,
      seats,
      totalAmount,
      paymentMethod,
      status: "CONFIRMED",
    });

    return res.status(201).json({
      success: true,
      message: "Booking confirmed",
      booking,
    });

  } catch (error) {
    console.error("Create Booking Error:", error);
    return res.status(500).json({
      success: false,
      message: "Booking failed",
    });
  }
};

/* =====================================================
   UPDATE BOOKING STATUS (ADMIN ONLY)
===================================================== */

export const updateBookingStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (req.user?.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!["CONFIRMED", "CANCELLED"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking)
      return res.status(404).json({
        message: "Booking not found",
      });

    /* Release seats if cancelled */
    if (status === "CANCELLED") {
      const show = await Show.findById(booking.show);
      if (show) {
        show.bookedSeats = show.bookedSeats.filter(
          (seat: string) => !booking.seats.includes(seat)
        );
        await show.save();
      }
    }

    booking.status = status;
    await booking.save();

    return res.json({
      success: true,
      message: "Booking status updated",
      booking,
    });

  } catch (error) {
    console.error("Status Update Error:", error);
    return res.status(500).json({
      success: false,
      message: "Status update failed",
    });
  }
};

/* =====================================================
   GET USER BOOKINGS
===================================================== */

export const getUserBookings = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId)
      return res.status(401).json({
        message: "Unauthorized",
      });

    const bookings = await Booking.find({ user: userId })
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      bookings,
    });

  } catch (error) {
    console.error("Fetch User Bookings Error:", error);
    return res.status(500).json({
      message: "Failed to fetch bookings",
    });
  }
};

/* =====================================================
   GET ALL BOOKINGS (ADMIN ONLY)
===================================================== */

export const getAllBookings = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (req.user?.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const bookings = await Booking.find()
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      bookings,
    });

  } catch (error) {
    console.error("Fetch Bookings Error:", error);
    return res.status(500).json({
      message: "Failed to fetch bookings",
    });
  }
};

/* =====================================================
   CANCEL BOOKING (USER SAFE)
===================================================== */

export const cancelBooking = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId)
      return res.status(401).json({
        message: "Unauthorized",
      });

    const booking = await Booking.findOne({
      _id: id,
      user: userId,
    });

    if (!booking)
      return res.status(404).json({
        message: "Booking not found",
      });

    if (booking.status === "CANCELLED")
      return res.status(400).json({
        message: "Booking already cancelled",
      });

    const show = await Show.findById(booking.show);

    if (show) {
      show.bookedSeats = show.bookedSeats.filter(
        (seat: string) => !booking.seats.includes(seat)
      );
      await show.save();
    }

    booking.status = "CANCELLED";
    await booking.save();

    return res.json({
      success: true,
      message: "Booking cancelled successfully",
    });

  } catch (error) {
    console.error("Cancel Booking Error:", error);
    return res.status(500).json({
      message: "Cancel failed",
    });
  }
};