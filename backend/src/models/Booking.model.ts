// backend/src/models/Booking.model.ts
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    /* ================= USER LINK ================= */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* ================= BASIC INFO ================= */
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    movieTitle: {
      type: String,
      required: true,
    },

    /* ================= SHOW REF ================= */
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: true,
    },

    /* ================= SHOW DETAILS ================= */
    selectedDate: {
      type: String,
      required: true,
    },

    selectedTime: {
      type: String,
      required: true,
    },

    selectedLanguage: {
      type: String,
      required: true,
    },

    /* ================= SEATS ================= */
    seats: {
      type: [String],
      required: true,
    },

    /* ================= PAYMENT ================= */
    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["UPI", "CARD"],
      required: true,
    },

    /* ================= STATUS ================= */
    status: {
      type: String,
      enum: ["CONFIRMED", "CANCELLED"],
      default: "CONFIRMED",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);