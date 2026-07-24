
import mongoose, { Document, Schema } from "mongoose";

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  name: string;
  image: string;
  price: number;
  quantity: number;

  variant?: {
    color?: string;
    size?: string;
  };
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  couponCode?: string;
  discount: number;
  totalAmount: number;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },

    quantity: { type: Number, default: 1, min: 1 },

    variant: {
      color: String,
      size: String,
    },
  },
  { _id: false }
);

const CartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: [CartItemSchema],

    couponCode: { type: String, default: "" },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-calculate cart total before save
CartSchema.pre("save", function (next) {
  const subtotal = this.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  this.totalAmount = subtotal - this.discount;

  next();
});

export default mongoose.model<ICart>("Cart", CartSchema);
