import { Request, Response } from "express";
import Movie from "../../models/Movie.model";
import User from "../../models/User.model";
import Booking from "../../models/Booking.model";
import Show from "../../models/Show.model";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // ===== COUNTS =====
    const totalMovies = await Movie.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalShows = await Show.countDocuments();

    // ===== REVENUE =====
    const revenueData = await Booking.aggregate([
      { $match: { status: "CONFIRMED" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
          totalBookings: { $sum: 1 }
        }
      }
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;
    const totalBookings = revenueData[0]?.totalBookings || 0;

    // ===== RECENT BOOKINGS =====
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email")
      .populate("movie", "title");

    res.json({
      totalMovies,
      totalUsers,
      totalShows,
      totalRevenue,
      totalBookings,
      recentBookings
    });
  } catch (error) {
    res.status(500).json({ message: "Dashboard error", error });
  }
};