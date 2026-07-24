import express from "express";
import { sendOtp, verifyOtp } from "../controllers/otpController";

const router = express.Router();

router.post("/send", sendOtp);
router.post("/verify", verifyOtp);

export default router;