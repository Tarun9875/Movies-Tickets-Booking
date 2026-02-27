// ================= MOVIE CONTROLLER =================
import { Request, Response } from "express";
import Movie from "../../models/Movie.model";

/* =======================================================
   BASIC MOVIE CRUD (POSTER URL SYSTEM)
======================================================= */

/**
 * ================= CREATE MOVIE
 */
export const createMovie = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      duration,
      language,
      rating,
      releaseDate,
      status,
      posterUrl,
    } = req.body;

    if (!title || !language || !duration || !posterUrl) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const movie = await Movie.create({
      title,
      description,
      duration,
      language,
      rating,
      releaseDate,
      status,
      posterUrl,
    });

    res.status(201).json({
      success: true,
      movie,
    });
  } catch (error) {
    console.error("Create Movie Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create movie",
    });
  }
};

/**
 * ================= GET ALL MOVIES
 */
export const getMovies = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const movies = await Movie.find(filter).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      movies,
    });
  } catch (error) {
    console.error("Get Movies Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch movies",
    });
  }
};

/**
 * ================= GET SINGLE MOVIE
 */
export const getMovieById = async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.json({
      success: true,
      movie,
    });
  } catch (error) {
    console.error("Get Movie By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch movie",
    });
  }
};

/**
 * ================= UPDATE MOVIE
 */
export const updateMovie = async (req: Request, res: Response) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.json({
      success: true,
      movie: updatedMovie,
    });
  } catch (error) {
    console.error("Update Movie Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update movie",
    });
  }
};

/* =======================================================
   MOVIE DETAILS (FULL JSON SYSTEM)
======================================================= */

/**
 * ================= ADD MOVIE DETAILS
 */
export const addMovieDetails = async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    const { trailer, genre, director, cast } = req.body;

    movie.trailer = trailer;
    movie.genre = genre;
    movie.director = director;
    movie.cast = cast || [];

    await movie.save();

    res.json({
      success: true,
      movie,
      message: "Movie details added successfully",
    });
  } catch (error) {
    console.error("Add Movie Details Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add movie details",
    });
  }
};

/**
 * ================= UPDATE MOVIE DETAILS
 */
export const updateMovieDetails = async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    const { trailer, genre, director, cast } = req.body;

    movie.trailer = trailer;
    movie.genre = genre;
    movie.director = director;
    movie.cast = cast || [];

    await movie.save();

    res.json({
      success: true,
      movie,
      message: "Movie details updated successfully",
    });
  } catch (error) {
    console.error("Update Movie Details Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update movie details",
    });
  }
};

/**
 * ================= DELETE MOVIE
 */
export const deleteMovie = async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.json({
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    console.error("Delete Movie Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete movie",
    });
  }
};