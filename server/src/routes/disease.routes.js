import { Router } from "express";
import {
  analyzeDisease,
  getDiseaseReports,
  getDiseaseReportById,
  deleteDiseaseReport,
} from "../controllers/disease.controller.js";
import { upload } from "../middleware/upload.js";

const router = Router();

// Accept optional single image upload with field name "image"
router.post("/analyze", upload.single("image"), analyzeDisease);
router.get("/reports", getDiseaseReports);
router.get("/reports/:id", getDiseaseReportById);
router.delete("/reports/:id", deleteDiseaseReport);

export default router;

