// backend/src/routes/showSeats.routes.ts

import express from "express";
import {
  getShowSeats,
  updateBlockedSeats,
} from "../../controllers/seats/showSeats.controller";

const router = express.Router();

// GET seats
router.get("/shows/:id/seats", getShowSeats);

// UPDATE blocked seats
router.put("/shows/:id/seats", updateBlockedSeats);

export default router;