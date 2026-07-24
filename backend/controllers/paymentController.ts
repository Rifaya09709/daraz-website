import { Request, Response } from "express";
import Order from "../models/Order";
import Payment from "../models/Payment";

// Luhn check — catches typos/fake numbers before hitting a real gateway
const isValidCardNumber = (digits: string) => {
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10);
    if (shouldDouble) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

const getCardBrand = (digits: string): "visa" | "mastercard" | null => {
  if (/^4/.test(digits)) return "visa";
  if (/^5[1-5]/.test(digits) || /^(222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/.test(digits)) {
    return "mastercard";
  }
  return null;
};

export const payWithCard = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { orderId, amount, cardNumber, cardName, expMonth, expYear, cvv } = req.body;

    if (!cardNumber || !cardName || !expMonth || !expYear || !cvv || !amount) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    if (!/^\d{16}$/.test(cardNumber) || !isValidCardNumber(cardNumber)) {
      return res.status(400).json({ success: false, message: "Invalid card number" });
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      return res.status(400).json({ success: false, message: "Invalid CVV" });
    }

    const expMM = parseInt(expMonth, 10);
    const expYY = parseInt(expYear, 10);
    const now = new Date();
    const currentYY = now.getFullYear() % 100;
    const currentMM = now.getMonth() + 1;

    if (expMM < 1 || expMM > 12 || expYY < currentYY || (expYY === currentYY && expMM < currentMM)) {
      if (orderId) {
        await Payment.create({
          order: orderId,
          user: userId,
          amount,
          method: "debit_card",
          status: "failed",
          cardLast4: cardNumber.slice(-4),
          cardBrand: getCardBrand(cardNumber),
          failureReason: "Card has expired",
        });
      }
      return res.status(400).json({ success: false, message: "Card has expired" });
    }

    // ---- Gateway call goes here ----
    // const charge = await gateway.charge({ amount, cardNumber, cvv, expMonth, expYear });
    // if (!charge.success) return res.status(402).json({ success: false, message: charge.message });
    // ---------------------------------

    let order = null;
    if (orderId) {
      order = await Order.findOneAndUpdate(
        { _id: orderId, user: userId },
        {
          paymentStatus: "Paid",
          paymentMethod: "CARD",
        },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      await Payment.create({
        order: orderId,
        user: userId,
        amount,
        method: "debit_card",
        status: "success",
        cardLast4: cardNumber.slice(-4),
        cardBrand: getCardBrand(cardNumber),
        paidAt: new Date(),
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment successful",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Payment failed",
      error: error instanceof Error ? error.message : error,
    });
  }
};