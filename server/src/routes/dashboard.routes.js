import { Router } from "express";
import {
  getDashboardSummary,
  getRecentActivities,
  getUpcomingTasks,
} from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/summary", getDashboardSummary);
router.get("/recent-activities", getRecentActivities);
router.get("/upcoming-tasks", getUpcomingTasks);

export default router;

