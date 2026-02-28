// src/controllers/booking/booking.controller.ts

import { Request, Response } from "express";
import Booking from "../../models/Booking.model";
import Show from "../../models/Show.model";

/* =====================================================
   CREATE BOOKING
===================================================== */

export const createBooking = async (
  req: Request,
  res: Response
) => {
  try {
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

    /* ================= BASIC VALIDATION ================= */

    if (!showId)
      return res.status(400).json({ message: "Show ID required" });

    if (!Array.isArray(seats) || seats.length === 0)
      return res.status(400).json({ message: "Please select seats" });

    if (!name || !email)
      return res.status(400).json({ message: "Name and Email required" });

    if (!selectedDate || !selectedTime || !selectedLanguage)
      return res.status(400).json({ message: "Show details missing" });

    if (!["UPI", "CARD"].includes(paymentMethod))
      return res.status(400).json({ message: "Invalid payment method" });

    /* ================= FETCH SHOW ================= */

    const show = await Show.findById(showId);

    if (!show)
      return res.status(404).json({ message: "Show not found" });

    /* ================= PREVENT BOOKING IF CANCELLED SHOW ================= */

    if (show.status && show.status !== "ACTIVE")
      return res.status(400).json({ message: "Show is not active" });

    /* ================= CHECK SEAT AVAILABILITY ================= */

    const alreadyBooked = seats.some((seat: string) =>
      show.bookedSeats.includes(seat)
    );

    if (alreadyBooked)
      return res
        .status(400)
        .json({ message: "One or more seats already booked" });

    /* ================= CALCULATE PRICE ================= */

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
      return res.status(400).json({ message: "Invalid seat pricing" });

    /* ================= LOCK SEATS ================= */

    show.bookedSeats.push(...seats);
    await show.save();

    /* ================= CREATE BOOKING ================= */

    const booking = await Booking.create({
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
      message: "Booking failed",
    });
  }
};

/* =====================================================
   GET ALL BOOKINGS
===================================================== */

export const getAllBookings = async (
  req: Request,
  res: Response
) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Fetch Bookings Error:", error);
    res.status(500).json({
      message: "Failed to fetch bookings",
    });
  }
};

/* =====================================================
   UPDATE BOOKING STATUS
===================================================== */

export const updateBookingStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["CONFIRMED", "CANCELLED"].includes(status))
      return res.status(400).json({
        message: "Invalid status value",
      });

    const booking = await Booking.findById(id);

    if (!booking)
      return res.status(404).json({
        message: "Booking not found",
      });

    /* Prevent unnecessary update */
    if (booking.status === status)
      return res.status(400).json({
        message: "Booking already in this status",
      });

    booking.status = status;
    await booking.save();

    return res.json({
      success: true,
      message: "Booking status updated",
      booking,
    });

  } catch (error) {
    console.error("Status Update Error:", error);
    res.status(500).json({
      message: "Status update failed",
    });
  }
};

/* =====================================================
   CANCEL BOOKING + RELEASE SEATS
===================================================== */

export const cancelBooking = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking)
      return res.status(404).json({
        message: "Booking not found",
      });

    if (booking.status === "CANCELLED")
      return res.status(400).json({
        message: "Booking already cancelled",
      });

    /* ================= RELEASE SEATS ================= */

    const show = await Show.findById(booking.show);

    if (show) {
      show.bookedSeats = show.bookedSeats.filter(
        (seat: string) => !booking.seats.includes(seat)
      );
      await show.save();
    }

    booking.status = "CANCELLED";
    await booking.save();

    res.json({
      success: true,
      message: "Booking cancelled and seats released",
    });

  } catch (error) {
    console.error("Cancel Booking Error:", error);
    res.status(500).json({
      message: "Cancel failed",
    });
  }
};