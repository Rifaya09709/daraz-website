
import mongoose, { Document, Schema } from "mongoose";

export interface IWishlistItem {
  product: mongoose.Types.ObjectId;
  addedAt: Date;
}

export interface IWishlist extends Document {
  user: mongoose.Types.ObjectId;
  products: IWishlistItem[];
}

const WishlistItemSchema = new Schema<IWishlistItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const WishlistSchema = new Schema<IWishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    products: [WishlistItemSchema],
  },
  { timestamps: true }
);

WishlistSchema.index({ user: 1 });

export default mongoose.model<IWishlist>("Wishlist", WishlistSchema);
