//backend/src/routes/admin/reports.route.ts
import express from "express";
import { getAdminReports } from "../../controllers/admin/reports.controller";
import { protect } from "../../middlewares/auth/auth.middleware";
import { isAdmin } from "../../middlewares/auth/role.middleware";

const router = express.Router();

router.get("/reports", protect, isAdmin, getAdminReports);

export default router;