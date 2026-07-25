import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFreebieProgress extends Document {
  user: Types.ObjectId;
  freebie: Types.ObjectId;
  totalCutAmount: number;
  expiresAt: Date;
  claimed: boolean;
}

const FreebieProgressSchema = new Schema<IFreebieProgress>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    freebie: { type: Schema.Types.ObjectId, ref: "Freebie", required: true },
    totalCutAmount: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
    claimed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// One progress doc per user per freebie
FreebieProgressSchema.index({ user: 1, freebie: 1 }, { unique: true });

export default mongoose.model<IFreebieProgress>("FreebieProgress", FreebieProgressSchema);