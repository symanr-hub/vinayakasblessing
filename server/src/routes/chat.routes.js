import { Router } from "express";
import {
  createConversation,
  getConversations,
  getConversationById,
  sendMessage,
  deleteConversation,
} from "../controllers/chat.controller.js";
import { validate } from "../middleware/validate.js";
import {
  createConversationSchema,
  chatMessageSchema,
} from "../schemas/index.js";

const router = Router();

router.post("/conversations", validate(createConversationSchema), createConversation);
router.get("/conversations", getConversations);
router.get("/conversations/:id", getConversationById);
router.post("/conversations/:id/messages", validate(chatMessageSchema), sendMessage);
router.delete("/conversations/:id", deleteConversation);

export default router;

