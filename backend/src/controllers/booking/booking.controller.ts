import { Request, Response } from "express";
import {
  lockSeats,
  unlockSeats,
  getLockedSeats
} from "../../services/booking/seatLock.service";
import { getIO } from "../../sockets/index";

// 👇 Define params type properly
interface ShowParams {
  showId: string;
}

// 🔒 LOCK SEATS
export const lockSeatController = async (req: any, res: Response) => {
  try {
    const { showId, seats } = req.body;
    const userId = req.user?.id;

    if (!showId || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid showId or seats"
      });
    }

    await lockSeats(String(showId), seats, userId);

    const io = getIO();
    io.to(String(showId)).emit("seat-locked", { seats, userId });

    return res.json({
      success: true,
      message: "Seats locked successfully"
    });

  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to lock seats"
    });
  }
};


// 🔓 UNLOCK SEATS
export const unlockSeatController = async (req: any, res: Response) => {
  try {
    const { showId, seats } = req.body;
    const userId = req.user?.id;

    if (!showId || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid showId or seats"
      });
    }

    await unlockSeats(String(showId), seats, userId);

    const io = getIO();
    io.to(String(showId)).emit("seat-unlocked", { seats, userId });

    return res.json({
      success: true,
      message: "Seats unlocked successfully"
    });

  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to unlock seats"
    });
  }
};


// 👀 GET LOCKED SEATS
export const lockedSeatsController = async (
  req: Request<ShowParams>,
  res: Response
) => {
  try {
    const { showId } = req.params;

    if (!showId) {
      return res.status(400).json({
        success: false,
        message: "Show ID is required"
      });
    }

    const lockedSeats = await getLockedSeats(showId);

    return res.json({
      success: true,
      lockedSeats
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch locked seats"
    });
  }
};
