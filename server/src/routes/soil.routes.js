import { Router } from "express";
import {
  analyzeSoil,
  getSoilReports,
  getSoilReportById,
  deleteSoilReport,
} from "../controllers/soil.controller.js";
import { validate } from "../middleware/validate.js";
import { soilAnalysisSchema } from "../schemas/index.js";

const router = Router();

router.post("/analyze", validate(soilAnalysisSchema), analyzeSoil);
router.get("/reports", getSoilReports);
router.get("/reports/:id", getSoilReportById);
router.delete("/reports/:id", deleteSoilReport);

export default router;

