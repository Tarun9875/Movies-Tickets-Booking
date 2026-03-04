//backend/src/controllers/admin/reports.controller.ts
import { Request, Response } from "express";
import Booking from "../../models/Booking.model";

/* ================= ADMIN REPORT ================= */

export const getAdminReports = async (req: Request, res: Response) => {
  try {

    const { startDate, endDate } = req.query;

    const filter: any = {};

    /* ================= DATE FILTER ================= */

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    /* ================= BOOKINGS ================= */

    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 });

    /* ================= TOTAL REVENUE ================= */

    const totalRevenue = bookings.reduce(
      (sum: number, b: any) => sum + (b.totalAmount || 0),
      0
    );

    /* ================= MOVIE REVENUE ================= */

    const movieRevenue = await Booking.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$movieTitle",
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    /* ================= REVENUE TREND ================= */

    const trend = await Booking.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    /* ================= RESPONSE ================= */

    res.json({
      bookings,
      movieRevenue,
      trend,
      totalRevenue
    });

  } catch (error) {
    console.error("Reports Error:", error);

    res.status(500).json({
      message: "Failed to generate reports"
    });
  }
};