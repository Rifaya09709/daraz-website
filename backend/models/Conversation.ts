import mongoose, { Document, Schema } from "mongoose";

export interface IConversation extends Document {
  customer: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  product?: mongoose.Types.ObjectId;
  lastMessage: string;
  lastMessageAt: Date;
  unreadByCustomer: number;
  unreadBySeller: number;
}

const ConversationSchema = new Schema<IConversation>(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product" },

    lastMessage: { type: String, default: "" },
    lastMessageAt: { type: Date, default: Date.now },

    unreadByCustomer: { type: Number, default: 0 },
    unreadBySeller: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// One conversation per customer+seller+product combo — reopening chat
// on the same product continues the existing thread instead of duplicating
ConversationSchema.index({ customer: 1, seller: 1, product: 1 }, { unique: true });

export default mongoose.model<IConversation>("Conversation", ConversationSchema);