// src/controllers/booking/booking.controller.ts

import { Request, Response } from "express";
import Booking from "../../models/Booking.model";
import Show from "../../models/Show.model";

export const createBooking = async (
  req: Request,
  res: Response
) => {
  try {
    const { showId, seats, paymentMethod } = req.body;

    const userId = (req as any).user?.id; // 🔥 from auth middleware

    /* ================= LOGIN CHECK ================= */

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Login required",
      });
    }

    /* ================= VALIDATION ================= */

    if (!showId || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking data",
      });
    }

    if (!["UPI", "CARD"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    /* ================= FETCH SHOW ================= */

    const show = await Show.findById(showId);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    if (show.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "Show is not active",
      });
    }

    /* ================= LIMIT CHECK ================= */

    if (seats.length > show.maxSeatsPerBooking) {
      return res.status(400).json({
        success: false,
        message: `Maximum ${show.maxSeatsPerBooking} seats allowed`,
      });
    }

    /* ================= DUPLICATE CHECK ================= */

    const alreadyBooked = seats.some((seat: string) =>
      show.bookedSeats.includes(seat)
    );

    if (alreadyBooked) {
      return res.status(400).json({
        success: false,
        message: "One or more seats already booked",
      });
    }

    /* ================= PRICE CALCULATION ================= */

    let totalAmount = 0;

    show.seatCategories.forEach((category) => {
      category.rows.forEach((row) => {
        seats.forEach((seat: string) => {
          if (seat.startsWith(row)) {
            totalAmount += category.price * show.weekendMultiplier;
          }
        });
      });
    });

    if (totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid seat pricing",
      });
    }

    /* ================= SAVE SEATS ================= */

    show.bookedSeats.push(...seats);
    await show.save();

    /* ================= CREATE BOOKING ================= */

    const booking = await Booking.create({
      user: userId, // ✅ FIXED HERE
      show: showId,
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
    console.error("Booking Error:", error);

    return res.status(500).json({
      success: false,
      message: "Booking failed",
    });
  }
};