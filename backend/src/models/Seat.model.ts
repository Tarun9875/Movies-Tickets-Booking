// backend/src/models/Seat.model.ts

import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
  {
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: true,
      unique: true,
    },
    blockedSeats: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Seat", seatSchema);