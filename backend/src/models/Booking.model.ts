// models/Booking.model.ts
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: true,
    },
    seats: {
      type: [String],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["UPI", "CARD"],
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

export default mongoose.model("Booking", bookingSchema);