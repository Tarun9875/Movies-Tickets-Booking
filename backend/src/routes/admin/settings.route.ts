import express from "express";
import {
  getSettings,
  updateSettings
} from "../../controllers/admin/settings.controller";

import { protect } from "../../middlewares/auth/auth.middleware";
import { isAdmin } from "../../middlewares/auth/role.middleware";

const router = express.Router();

/* ================= PUBLIC SETTINGS ================= */
/* Used by customer side (Home page maintenance check) */
router.get("/public-settings", getSettings);

/* ================= ADMIN SETTINGS ================= */
router.get("/settings", protect, isAdmin, getSettings);
router.put("/settings", protect, isAdmin, updateSettings);

export default router;