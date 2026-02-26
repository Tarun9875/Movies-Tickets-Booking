import mongoose, { Document, Schema } from "mongoose";

/* ================================
   SEAT CATEGORY INTERFACE
================================ */
interface ISeatCategory {
  type: string; // VIP / PREMIUM / EXECUTIVE / NORMAL
  price: number;
  rows: string[];
  seatsPerRow: number;
}

/* ================================
   SHOW INTERFACE
================================ */
export interface IShow extends Document {
  movie: mongoose.Types.ObjectId;
  date: Date;
  time: string;
  screen: number;
  language: string;
  format: "2D" | "3D" | "IMAX" | "Dolby";
  seatCategories: ISeatCategory[];
  totalSeats: number;
  maxSeatsPerBooking: number;
  weekendMultiplier: number;
  status: "ACTIVE" | "CANCELLED";
}

/* ================================
   SEAT CATEGORY SCHEMA
================================ */
const seatCategorySchema = new Schema<ISeatCategory>({
  type: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  rows: [
    {
      type: String,
      uppercase: true,
    },
  ],
  seatsPerRow: {
    type: Number,
    required: true,
    min: 1,
  },
});

/* ================================
   SHOW SCHEMA
================================ */
const showSchema = new Schema<IShow>(
  {
    movie: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    screen: {
      type: Number,
      required: true,
      min: 1,
    },

    language: {
      type: String,
      required: true,
    },

    format: {
      type: String,
      enum: ["2D", "3D", "IMAX", "Dolby"],
      default: "2D",
    },

    seatCategories: {
      type: [seatCategorySchema],
      required: true,
    },

    totalSeats: {
      type: Number,
      default: 0,
    },

    maxSeatsPerBooking: {
      type: Number,
      default: 6,
      min: 1,
    },

    weekendMultiplier: {
      type: Number,
      default: 1,
      min: 1,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "CANCELLED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

/* ================================
   UNIQUE INDEX
   Prevent same screen + date + time
================================ */
showSchema.index(
  { screen: 1, date: 1, time: 1 },
  { unique: true }
);

/* ================================
   AUTO CALCULATE TOTAL SEATS
   + WEEKEND MULTIPLIER
================================ */
showSchema.pre("save", function () {
  const show = this as IShow;

  let total = 0;

  show.seatCategories.forEach((cat) => {
    total += cat.rows.length * cat.seatsPerRow;
  });

  show.totalSeats = total;

  // Weekend pricing
  const day = show.date.getDay(); // 0=Sunday, 6=Saturday
  show.weekendMultiplier = day === 0 || day === 6 ? 1.2 : 1;
});

/* ================================
   EXPORT MODEL
================================ */
export default mongoose.model<IShow>("Show", showSchema);