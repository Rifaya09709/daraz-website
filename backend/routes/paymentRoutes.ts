import { Router } from "express";
import { payWithCard } from "../controllers/paymentController";
import { protect } from "../middleware/auth";

const router = Router();

router.post("/card", protect, payWithCard);

export default router;