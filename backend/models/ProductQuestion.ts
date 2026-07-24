import mongoose, { Document, Schema } from "mongoose";

export interface IProductQuestion extends Document {
  product: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  question: string;
  answer?: string;
  answeredBy?: string;
  answeredAt?: Date;
  createdAt: Date;
}

const ProductQuestionSchema = new Schema<IProductQuestion>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },

    question: { type: String, required: true, trim: true },

    // Left empty until a seller/admin answers — mirrors Daraz's
    // "answered by <seller>" pattern
    answer: { type: String, trim: true },
    answeredBy: { type: String },
    answeredAt: { type: Date },
  },
  { timestamps: true }
);

// Fastest path for the page's main query: all questions for one product
ProductQuestionSchema.index({ product: 1, createdAt: -1 });

export default mongoose.model<IProductQuestion>(
  "ProductQuestion",
  ProductQuestionSchema
);