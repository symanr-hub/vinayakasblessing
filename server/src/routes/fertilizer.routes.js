import { Router } from "express";
import {
  recommendFertilizer,
  getFertilizerAdvisories,
  getFertilizerAdvisoryById,
  deleteFertilizerAdvisory,
} from "../controllers/fertilizer.controller.js";
import { validate } from "../middleware/validate.js";
import { fertilizerAdvisorySchema } from "../schemas/index.js";

const router = Router();

router.post("/recommend", validate(fertilizerAdvisorySchema), recommendFertilizer);
router.get("/advisories", getFertilizerAdvisories);
router.get("/advisories/:id", getFertilizerAdvisoryById);
router.delete("/advisories/:id", deleteFertilizerAdvisory);

export default router;

