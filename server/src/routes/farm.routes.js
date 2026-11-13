import { Router } from "express";
import {
  createFarm,
  getFarms,
  getFarmById,
  updateFarm,
  deleteFarm,
} from "../controllers/farm.controller.js";
import { validate } from "../middleware/validate.js";
import { farmSchema } from "../schemas/index.js";

const router = Router();

router.post("/", validate(farmSchema), createFarm);
router.get("/", getFarms);
router.get("/:id", getFarmById);
router.put("/:id", validate(farmSchema.partial()), updateFarm);
router.delete("/:id", deleteFarm);

export default router;

