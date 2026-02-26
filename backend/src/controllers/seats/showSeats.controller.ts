// backend/src/controllers/showSeats.controller.ts

import { Request, Response } from "express";
import Seat from "../../models/Seat.model";
import Booking from "../../models/Booking.model";

// ================= GET SEATS =================
export const getShowSeats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find blocked seats
    const seatDoc = await Seat.findOne({ show: id });

    // Find booked seats from bookings
    const bookings = await Booking.find({
      show: id,
      status: "CONFIRMED",
    });

    const bookedSeats = bookings.flatMap((b: any) => b.seats);

    res.json({
      booked: bookedSeats,
      blocked: seatDoc?.blockedSeats || [],
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch seats" });
  }
};

// ================= UPDATE BLOCKED =================
export const updateBlockedSeats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { blocked } = req.body;

    let seatDoc = await Seat.findOne({ show: id });

    if (!seatDoc) {
      seatDoc = await Seat.create({
        show: id,
        blockedSeats: blocked,
      });
    } else {
      seatDoc.blockedSeats = blocked;
      await seatDoc.save();
    }

    res.json({ message: "Blocked seats updated successfully" });

  } catch (error) {
    res.status(500).json({ message: "Failed to update seats" });
  }
};