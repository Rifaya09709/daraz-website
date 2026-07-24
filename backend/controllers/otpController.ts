import { Request, Response } from "express";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID as string;
const DEV_MODE = process.env.NODE_ENV !== "production";
const DEV_OTP = "123456";

export const sendOtp = async (req: Request, res: Response) => {
  console.log("Phone received:", req.body.phone);
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: "Phone number required" });
    }

    // DEV MODE: skip real Twilio SMS, always "succeed"
    if (DEV_MODE) {
      console.log(`[DEV MODE] OTP for ${phone} is: ${DEV_OTP}`);
      return res.status(200).json({ success: true, status: "pending" });
    }

    const verification = await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({ to: phone, channel: "sms" });

    return res.status(200).json({ success: true, status: verification.status });
  } catch (error: any) {
    console.error("Twilio sendOtp error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error?.message || error,
    });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) {
      return res.status(400).json({ success: false, message: "Phone and code required" });
    }

    // DEV MODE: accept fixed OTP for any number
    if (DEV_MODE) {
      if (code === DEV_OTP) {
        return res.status(200).json({ success: true, message: "Phone verified (dev mode)" });
      } else {
        return res.status(400).json({ success: false, message: "Invalid or expired code" });
      }
    }

    const check = await client.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({ to: phone, code });

    if (check.status === "approved") {
      return res.status(200).json({ success: true, message: "Phone verified" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid or expired code" });
    }
  } catch (error: any) {
    console.error("Twilio verifyOtp error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
      error: error?.message || error,
    });
  }
};