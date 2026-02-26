import { Router } from "express";
import {
  getMovies,
  getMovieById,
  updateMovie,
  createMovie,
  deleteMovie,
  addMovieDetails,
  updateMovieDetails,
} from "../../controllers/movie/movie.controller";
import { upload } from "../../config/multer";

const router = Router();

/* ================= GET ROUTES ================= */
router.get("/", getMovies);
router.get("/:id", getMovieById);

/* ================= BASIC MOVIE ================= */
router.post("/", upload.single("poster"), createMovie);

router.put("/:id", upload.single("poster"), updateMovie);

router.delete("/:id", deleteMovie);

/* ================= MOVIE DETAILS ================= */
/*
Handles:
- trailer
- genre
- director
- cast (JSON string)
- castImages (multiple images)
*/

router.post(
  "/:id/details",
  upload.fields([
    { name: "castImages", maxCount: 20 },
  ]),
  addMovieDetails
);

router.put(
  "/:id/details",
  upload.fields([
    { name: "castImages", maxCount: 20 },
  ]),
  updateMovieDetails
);

export default router;