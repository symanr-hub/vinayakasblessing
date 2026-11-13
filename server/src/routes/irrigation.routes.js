import { Router } from "express";
import {
  recommendIrrigation,
  getIrrigationAdvisories,
  getIrrigationAdvisoryById,
  deleteIrrigationAdvisory,
} from "../controllers/irrigation.controller.js";
import { validate } from "../middleware/validate.js";
import { irrigationAdvisorySchema } from "../schemas/index.js";

const router = Router();

router.post("/recommend", validate(irrigationAdvisorySchema), recommendIrrigation);
router.get("/advisories", getIrrigationAdvisories);
router.get("/advisories/:id", getIrrigationAdvisoryById);
router.delete("/advisories/:id", deleteIrrigationAdvisory);

export default router;

