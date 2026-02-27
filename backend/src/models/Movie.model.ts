// ================= MOVIE MODEL =================
import mongoose, { Schema, Document } from "mongoose";

/* ================= CAST INTERFACE ================= */
interface ICast {
  name: string;
  role: string;
  image?: string;
}

/* ================= MOVIE INTERFACE ================= */
export interface IMovie extends Document {
  title: string;
  description?: string;
  duration: number;
  language: string;
  rating?: number;
  genre?: string;
  director?: string;
  trailer?: string;
  releaseDate?: Date;
  status: "NOW_SHOWING" | "UPCOMING";
  posterUrl: string;
  cast: ICast[];
}

/* ================= CAST SUB-SCHEMA ================= */
const castSchema = new Schema<ICast>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
    },
  },
  { _id: false }
);

/* ================= MOVIE SCHEMA ================= */
const movieSchema = new Schema<IMovie>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    language: {
      type: String,
      required: true,
      trim: true,
    },

    rating: {
      type: Number,
      min: 0,
      max: 10,
    },

    genre: {
      type: String,
      trim: true,
    },

    director: {
      type: String,
      trim: true,
    },

    trailer: {
      type: String,
      trim: true,
    },

    releaseDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["NOW_SHOWING", "UPCOMING"],
      default: "NOW_SHOWING",
    },

    // ✅ FIXED FIELD NAME
    posterUrl: {
      type: String,
      required: true,
      trim: true,
    },

    cast: {
      type: [castSchema],
      default: [],
    },
  },
  { timestamps: true }
);

/* ================= EXPORT MODEL ================= */
const Movie = mongoose.model<IMovie>("Movie", movieSchema);

export default Movie;