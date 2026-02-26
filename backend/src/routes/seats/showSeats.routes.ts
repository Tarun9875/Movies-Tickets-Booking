// backend/src/routes/showSeats.routes.ts

import express from "express";
import {
  getShowSeats,
  updateBlockedSeats,
} from "../../controllers/seats/showSeats.controller";

const router = express.Router();

/* ================= SEATS ================= */

// GET seats for a show
router.get("/:id/seats", getShowSeats);

// UPDATE blocked seats
router.put("/:id/seats", updateBlockedSeats);

export default router;