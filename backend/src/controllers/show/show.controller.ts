// backend/src/controllers/show/show.controller.ts

import { Request, Response } from "express";
import Show from "../../models/Show.model";

// ================= CREATE SHOW =================
export const createShow = async (req: Request, res: Response) => {
  try {
    const { screen, date, time } = req.body;

    // 🔥 Conflict Check (same screen + date + time)
    const existing = await Show.findOne({
      screen,
      date,
      time,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message:
          "A show already exists on this screen at the same date and time.",
      });
    }

    const show = await Show.create(req.body);

    res.status(201).json({
      success: true,
      message: "Show created successfully",
      show,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create show",
      error,
    });
  }
};

// ================= GET ALL SHOWS =================
export const getShows = async (req: Request, res: Response) => {
  try {
    const { movie, status, date } = req.query;

    const filter: any = {};

    // 🎬 Filter by movie
    if (movie) {
      filter.movie = movie;
    }

    // 📌 Filter by status (optional)
    if (status) {
      filter.status = status;
    }

    // 📅 Filter by date (optional)
    if (date) {
      filter.date = date;
    }

    const shows = await Show.find(filter)
      .populate("movie")
      .sort({ date: 1, time: 1 });

    res.json({
      success: true,
      shows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch shows",
      error,
    });
  }
};
// ================= GET SHOW BY ID =================
export const getShowById = async (req: Request, res: Response) => {
  try {
    const show = await Show.findById(req.params.id).populate("movie");

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    res.json({
      success: true,
      show,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch show",
      error,
    });
  }
};

// ================= UPDATE SHOW =================
export const updateShow = async (req: Request, res: Response) => {
  try {
    const show = await Show.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    res.json({
      success: true,
      message: "Show updated successfully",
      show,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update show",
      error,
    });
  }
};

// ================= DELETE SHOW =================
export const deleteShow = async (req: Request, res: Response) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    res.json({
      success: true,
      message: "Show deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete show",
      error,
    });
  }
};