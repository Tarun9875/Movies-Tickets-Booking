import { Router } from "express";
import { protect } from "../../middlewares/auth/auth.middleware";
import { roleMiddleware } from "../../middlewares/role/role.middleware";

import {
  adminDashboard,
  createMovie,
  getAdminMovies,
  deleteMovie,
  getAllUsers
} from "../../controllers/admin/admin.controller";

const router = Router();

/* =====================================================
   🔒 PROTECTED ADMIN ROUTES
===================================================== */
router.use(protect);
router.use(roleMiddleware(["ADMIN"]));

/* =====================================================
   📊 DASHBOARD (Full Business Analytics)
   GET /api/admin/dashboard
===================================================== */
router.get("/dashboard", adminDashboard);

/* =====================================================
   🎬 MOVIE MANAGEMENT
===================================================== */
router.post("/movies", createMovie);
router.get("/movies", getAdminMovies);
router.delete("/movies/:id", deleteMovie);

/* =====================================================
   👥 USER MANAGEMENT
===================================================== */
router.get("/users", getAllUsers);

export default router;