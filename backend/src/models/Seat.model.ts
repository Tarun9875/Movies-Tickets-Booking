// backend/src/models/Seat.model.ts

import mongoose, { Document, Schema } from "mongoose";

/* ======================================
   SEAT INTERFACE
====================================== */

export interface ISeat extends Document {
  show: mongoose.Types.ObjectId;
  blockedSeats: string[];
  bookedSeats: string[];
  lockedSeats: string[];
  status: "ACTIVE" | "CANCELLED";
}

/* ======================================
   SEAT SCHEMA
====================================== */

const seatSchema = new Schema<ISeat>(
  {
    show: {
      type: Schema.Types.ObjectId,
      ref: "Show",
      required: true,
    },

    // Admin blocked seats (maintenance / VIP hold)
    blockedSeats: {
      type: [String],
      default: [],
    },

    // Confirmed booked seats
    bookedSeats: {
      type: [String],
      default: [],
    },

    // Temporary locked seats (during payment process)
    lockedSeats: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["ACTIVE", "CANCELLED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

/* ======================================
   INDEX (1 seat doc per show)
====================================== */

seatSchema.index({ show: 1 }, { unique: true });

/* ======================================
   EXPORT
====================================== */

export default mongoose.model<ISeat>("Seat", seatSchema);