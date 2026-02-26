import { Request, Response } from "express";
import Movie from "../../models/Movie.model";
import fs from "fs";
import path from "path";

/* ================= HELPER ================= */
const deleteFileIfExists = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

/* =======================================================
   BASIC MOVIE CRUD
======================================================= */

/**
 * ================= CREATE MOVIE (Basic Info)
 */
export const createMovie = async (req: Request, res: Response) => {
  try {
    const posterFile = req.file;

    const movie = await Movie.create({
      ...req.body,
      poster: posterFile
        ? `/uploads/posters/${posterFile.filename}`
        : "",
    });

    res.status(201).json({
      success: true,
      movie,
    });
  } catch {
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
  } catch {
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
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch movie",
    });
  }
};

/**
 * ================= UPDATE BASIC MOVIE
 */
export const updateMovie = async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    const posterFile = req.file;

    if (posterFile && movie.poster) {
      const oldPath = path.join(
        __dirname,
        "../../..",
        movie.poster
      );
      deleteFileIfExists(oldPath);
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        poster: posterFile
          ? `/uploads/posters/${posterFile.filename}`
          : movie.poster,
      },
      { new: true }
    );

    res.json({
      success: true,
      movie: updatedMovie,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to update movie",
    });
  }
};

/* =======================================================
   MOVIE DETAIL CONTROLLERS
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

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const castFiles = files?.castImages || [];

    let parsedCast: any[] = [];

    if (cast) {
      parsedCast = JSON.parse(cast);
    }

    parsedCast = parsedCast.map((member, index) => ({
      name: member.name,
      role: member.role,
      image: castFiles[index]
        ? `/uploads/cast/${castFiles[index].filename}`
        : "",
    }));

    movie.trailer = trailer;
    movie.genre = genre;
    movie.director = director;

    // ✅ FIXED TYPE ISSUE HERE
    movie.set("cast", parsedCast);

    await movie.save();

    res.json({
      success: true,
      movie,
      message: "Movie details added successfully",
    });
  } catch {
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

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const castFiles = files?.castImages || [];

    let parsedCast: any[] = [];

    if (cast) {
      parsedCast = JSON.parse(cast);

      // Delete old cast images
      movie.cast.forEach((member: any) => {
        if (member.image) {
          const oldPath = path.join(
            __dirname,
            "../../..",
            member.image
          );
          deleteFileIfExists(oldPath);
        }
      });

      parsedCast = parsedCast.map((member, index) => ({
        name: member.name,
        role: member.role,
        image: castFiles[index]
          ? `/uploads/cast/${castFiles[index].filename}`
          : "",
      }));
    }

    movie.trailer = trailer;
    movie.genre = genre;
    movie.director = director;

    // ✅ FIXED TYPE ISSUE HERE
    movie.set("cast", parsedCast);

    await movie.save();

    res.json({
      success: true,
      movie,
      message: "Movie details updated successfully",
    });
  } catch {
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
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    if (movie.poster) {
      const posterPath = path.join(
        __dirname,
        "../../..",
        movie.poster
      );
      deleteFileIfExists(posterPath);
    }

    movie.cast.forEach((member: any) => {
      if (member.image) {
        const castPath = path.join(
          __dirname,
          "../../..",
          member.image
        );
        deleteFileIfExists(castPath);
      }
    });

    await movie.deleteOne();

    res.json({
      success: true,
      message: "Movie deleted successfully",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to delete movie",
    });
  }
};