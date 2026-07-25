import mongoose, { Schema, Document } from "mongoose";

export interface IFreebie extends Document {
  name: string;
  image: string;
  originalPrice: number;
  claimedCount: number;
  active: boolean;
}

const FreebieSchema = new Schema<IFreebie>(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    originalPrice: { type: Number, required: true },
    claimedCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IFreebie>("Freebie", FreebieSchema);