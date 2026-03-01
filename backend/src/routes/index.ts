// backend/src/routes/index.ts

import { Router } from "express";

import authRoutes from "./auth/auth.route";
import bookingRoutes from "./booking/booking.route";
import movieRoutes from "./movie/movie.routes";
import adminRoutes from "./admin/admin.routes";
import showRoutes from "./show/show.routes";
import showSeatsRoutes from "./seats/showSeats.routes";
import userRoutes from "./user/user.route";

const router = Router();

/* =====================================================
   AUTH ROUTES
   /api/auth
===================================================== */
router.use("/auth", authRoutes);

/* =====================================================
   BOOKING ROUTES
   /api/bookings
===================================================== */
router.use("/bookings", bookingRoutes);

/* =====================================================
   MOVIE ROUTES
   /api/movies
===================================================== */
router.use("/movies", movieRoutes);

/* =====================================================
   ADMIN ROUTES
   /api/admin
===================================================== */
router.use("/admin", adminRoutes);

/* =====================================================
   SHOW ROUTES
   IMPORTANT ORDER (keep together)
   /api/shows
===================================================== */
router.use("/shows", showRoutes);
router.use("/shows", showSeatsRoutes);

/* =====================================================
   USER ROUTES
   /api/users
===================================================== */
router.use("/users", userRoutes);
export default router;