// backend/src/routes/index.ts

import { Router } from "express";
import authRoutes from "./auth/auth.route";
import bookingRoutes from "./booking/booking.route";
import movieRoutes from "./movie/movie.routes";
import adminRoutes from "./admin/admin.routes";
import showRoutes from "./show/show.routes";
import showSeatsRoutes from "./seats/showSeats.routes";
import userRoute from "./user/user.route";
const router = Router();

router.use("/auth", authRoutes);
router.use("/bookings", bookingRoutes);   // ✅ FIXED HERE
router.use("/movies", movieRoutes);
router.use("/admin", adminRoutes);

/* 🔥 IMPORTANT ORDER */
router.use("/shows", showRoutes);
router.use("/shows", showSeatsRoutes);

router.use("/users", userRoute);
export default router;