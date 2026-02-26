// src/routes/admin/admin.routes.ts
import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth/auth.middleware";
import { roleMiddleware } from "../../middlewares/role/role.middleware";
import {
  adminDashboard,
  createMovie,
  getAdminMovies,
  deleteMovie
} from "../../controllers/admin/admin.controller";

const router = Router();

/**
 * 🔒 All routes below require:
 * 1. Valid JWT
 * 2. Redis session
 * 3. ADMIN role
 */
router.use(authMiddleware);
router.use(roleMiddleware(["ADMIN"]));

/**
 * 📊 Admin Dashboard
 */
router.get("/dashboard", adminDashboard);

/**
 * 🎬 Create Movie
 */
router.post("/movies", createMovie);

/**
 * 📃 Get All Movies (Admin View)
 */
router.get("/movies", getAdminMovies);

/**
 * ❌ Delete Movie
 */
router.delete("/movies/:id", deleteMovie);

export default router;
