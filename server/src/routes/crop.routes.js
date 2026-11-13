import { Router } from "express";
import {
  recommendCrop,
  getRecommendations,
  getRecommendationById,
  deleteRecommendation,
} from "../controllers/crop.controller.js";
import { validate } from "../middleware/validate.js";
import { cropRecommendationSchema } from "../schemas/index.js";

const router = Router();

router.post("/recommend", validate(cropRecommendationSchema), recommendCrop);
router.get("/recommendations", getRecommendations);
router.get("/recommendations/:id", getRecommendationById);
router.delete("/recommendations/:id", deleteRecommendation);

export default router;

