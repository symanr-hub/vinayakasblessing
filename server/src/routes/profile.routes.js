import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profile.controller.js";
import { validate } from "../middleware/validate.js";
import { profileSchema } from "../schemas/index.js";

const router = Router();

router.get("/", getProfile);
router.put("/", validate(profileSchema), updateProfile);

export default router;

