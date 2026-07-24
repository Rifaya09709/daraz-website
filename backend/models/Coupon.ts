import mongoose, { Document, Schema } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  minPurchase: number;
  maxDiscount?: number;
  expiresAt: Date;
  isActive: boolean;
  usageLimit: number;
  usedCount: number;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    discountType: {
      type: String,
      enum: ["percentage", "flat"],
      default: "percentage",
    },

    discountValue: { type: Number, required: true },

    minPurchase: { type: Number, default: 0 },
    maxDiscount: Number,

    expiresAt: { type: Date, required: true },

    isActive: { type: Boolean, default: true },

    usageLimit: { type: Number, default: 1000 },
    usedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<ICoupon>("Coupon", CouponSchema);
