import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth/auth.middleware";
import { roleMiddleware } from "../../middlewares/role/role.middleware";
import {
  lockSeatController,
  unlockSeatController,
  lockedSeatsController
} from "../../controllers";

const router = Router();

/* =========================
   USER BOOKINGS
========================= */
router.get(
  "/my-bookings",
  authMiddleware,
  (req, res) => {
    res.json({
      success: true,
      message: "User bookings fetched",
      user: (req as any).user
    });
  }
);

/* =========================
   ADMIN BOOKINGS
========================= */
router.get(
  "/all-bookings",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  (_req, res) => {
    res.json({
      success: true,
      message: "All bookings (admin)"
    });
  }
);

/* =========================
   SEAT LOCKING (REDIS)
========================= */
router.get("/locked/:showId", lockedSeatsController);

router.post(
  "/lock",
  authMiddleware,
  lockSeatController
);

router.post(
  "/unlock",
  authMiddleware,
  unlockSeatController
);

export default router;
