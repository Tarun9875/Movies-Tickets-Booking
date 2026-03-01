import { Request, Response } from "express";
import Movie from "../../models/Movie.model";
import User from "../../models/User.model";
import Booking from "../../models/Booking.model";
import Show from "../../models/Show.model";

/* =====================================================
   📊 FULL ADMIN DASHBOARD (MATCHED WITH YOUR MODEL)
===================================================== */
export const adminDashboard = async (_req: Request, res: Response) => {
  try {
    /* ================= BASIC COUNTS ================= */
    const totalMovies = await Movie.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalShows = await Show.countDocuments();

    /* ================= TOTAL REVENUE ================= */
    const revenueData = await Booking.aggregate([
      { $match: { status: "CONFIRMED" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" }, // ✅ fixed
          totalBookings: { $sum: 1 }
        }
      }
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;
    const totalBookings = revenueData[0]?.totalBookings || 0;

    /* ================= MONTHLY REVENUE ================= */
    const monthlyRevenue = await Booking.aggregate([
      { $match: { status: "CONFIRMED" } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          revenue: { $sum: "$totalAmount" } // ✅ fixed
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    /* ================= BOOKING STATUS ================= */
    const bookingStatus = await Booking.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    /* ================= TOP MOVIES (using movieTitle) ================= */
    const topMovies = await Booking.aggregate([
      { $match: { status: "CONFIRMED" } },
      {
        $group: {
          _id: "$movieTitle", // ✅ fixed
          revenue: { $sum: "$totalAmount" },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 }
    ]);

    /* ================= RECENT BOOKINGS ================= */
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email")
      .populate("show");

    /* ================= FINAL RESPONSE ================= */
    res.json({
      success: true,
      overview: {
        totalMovies,
        totalUsers,
        totalShows,
        totalRevenue,
        totalBookings
      },
      monthlyRevenue,
      bookingStatus,
      topMovies,
      recentBookings
    });

  } catch (error: any) {
    console.error("Dashboard Error:", error); // 🔥 important for debugging
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* =====================================================
   👥 GET ALL USERS
===================================================== */
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");

    res.json({
      success: true,
      users
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* =====================================================
   🎬 CREATE MOVIE
===================================================== */
export const createMovie = async (req: Request, res: Response) => {
  try {
    const movie = await Movie.create(req.body);

    res.status(201).json({
      success: true,
      message: "Movie created successfully",
      movie
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/* =====================================================
   📃 GET ADMIN MOVIES
===================================================== */
export const getAdminMovies = async (_req: Request, res: Response) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      movies
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* =====================================================
   ❌ DELETE MOVIE
===================================================== */
export const deleteMovie = async (req: Request, res: Response) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Movie deleted successfully"
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};