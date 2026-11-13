import { Router } from "express";
import {
  generateCalendar,
  getCalendars,
  getCalendarById,
  updateCalendarActivities,
  deleteCalendar,
} from "../controllers/calendar.controller.js";
import { validate } from "../middleware/validate.js";
import {
  cultivationCalendarSchema,
  updateCalendarActivitiesSchema,
} from "../schemas/index.js";

const router = Router();

router.post("/generate", validate(cultivationCalendarSchema), generateCalendar);
router.get("/", getCalendars);
router.get("/:id", getCalendarById);
router.put("/:id", validate(updateCalendarActivitiesSchema), updateCalendarActivities);
router.delete("/:id", deleteCalendar);

export default router;

