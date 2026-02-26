// backend/src/models/Booking.model.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  show: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  seats: string[];
  status: string;
}

const bookingSchema = new Schema<IBooking>(
  {
    show: {
      type: Schema.Types.ObjectId,
      ref: "Show",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seats: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      enum: ["CONFIRMED", "CANCELLED"],
      default: "CONFIRMED",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;