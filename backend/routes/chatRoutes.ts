import { Router } from "express";
import {
  startConversation,
  getMessages,
  getMyConversations,
  sendMessageRest,
  markConversationRead,
} from "../controllers/chatController";
import { protect } from "../middleware/auth";

const router = Router();

router.post("/start", protect, startConversation);
router.get("/conversations", protect, getMyConversations);
router.get("/messages/:conversationId", protect, getMessages);
router.post("/messages/:conversationId", protect, sendMessageRest);
router.put("/read/:conversationId", protect, markConversationRead);

export default router;