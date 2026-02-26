import mongoose from "mongoose";

/* ================= CAST SUB-SCHEMA ================= */
const castSchema = new mongoose.Schema(
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
      type: String, // stored image path
      required: false,
    },
  },
  { _id: false }
);

/* ================= MOVIE SCHEMA ================= */
const movieSchema = new mongoose.Schema(
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
      min: 1,
    },

    language: {
      type: String,
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

    poster: {
      type: String,
      required: true,
    },

    cast: [castSchema], // 👥 Cast Array
  },
  { timestamps: true }
);

/* ================= EXPORT MODEL ================= */
const Movie = mongoose.model("Movie", movieSchema);

export default Movie;