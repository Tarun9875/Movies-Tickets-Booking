import { Request, Response } from "express";
import Movie from "../../models/Movie.model";

/**
 * Admin Dashboard
 */
export const adminDashboard = async (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Welcome Admin Dashboard"
  });
};

/**
 * Create Movie
 */
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

/**
 * Get All Movies (Admin)
 */
export const getAdminMovies = async (_req: Request, res: Response) => {
  const movies = await Movie.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    movies
  });
};

/**
 * Delete Movie
 */
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
