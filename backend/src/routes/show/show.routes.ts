//backend/src/routes/show/show.routes.ts
import { Router } from "express";
import {
  createShow,
  getShows,
  getShowById,
  updateShow,
  deleteShow,
} from "../../controllers/show/show.controller";

const router = Router();

router.get("/", getShows);
router.get("/:id", getShowById);
router.post("/", createShow);
router.put("/:id", updateShow);
router.delete("/:id", deleteShow);

export default router;