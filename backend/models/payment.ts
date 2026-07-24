import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  order: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  amount: number;
  method: "debit_card" | "credit_card" | "cod" | "upi";
  status: "pending" | "success" | "failed" | "refunded";
  cardLast4?: string;
  cardBrand?: "visa" | "mastercard" | null;
  transactionId?: string;
  failureReason?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    method: {
      type: String,
      enum: ["debit_card", "credit_card", "cod", "upi"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "refunded"],
      default: "pending",
    },
    cardLast4: String,
    cardBrand: { type: String, enum: ["visa", "mastercard", null], default: null },
    transactionId: String,
    failureReason: String,
    paidAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>("Payment", paymentSchema);