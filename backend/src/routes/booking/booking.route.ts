// src/routes/booking/booking.route.ts

import express from "express";
import { createBooking } from "../../controllers/booking/booking.controller";
import { authMiddleware } from "../../middlewares/auth/auth.middleware";

const router = express.Router();

// 🔐 Protected route
router.post("/", authMiddleware, createBooking);

export default router;