import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
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

    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: true,
    },

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
      default: "CONFIRMED",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);