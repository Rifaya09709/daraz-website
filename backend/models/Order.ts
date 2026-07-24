
import mongoose, { Document, Schema } from "mongoose";

export interface IShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface IOrderItem {
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

export interface IOrder extends Document {
  orderNumber: string;
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;

  paymentMethod: "COD" | "CARD" | "UPI";
  paymentStatus: "Pending" | "Paid" | "Failed";

  orderStatus:
    | "Pending"
    | "Confirmed"
    | "Packed"
    | "Shipped"
    | "Out For Delivery"
    | "Delivered"
    | "Cancelled";

  subtotal: number;
  discount: number;
  tax: number;
  shippingCharge: number;
  totalAmount: number;

  trackingId?: string;
  invoiceNumber?: string;

  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ShippingSchema = new Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: "India" },
  },
  { _id: false }
);

const OrderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    image: String,
    price: Number,
    quantity: Number,
    variant: {
      color: String,
      size: String,
    },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    orderNumber: { type: String, unique: true, required: true },

    user: { type: Schema.Types.ObjectId, ref: "User", required: true },

    items: [OrderItemSchema],

    shippingAddress: ShippingSchema,

    paymentMethod: {
      type: String,
      enum: ["COD", "CARD", "UPI"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Packed",
        "Shipped",
        "Out For Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    shippingCharge: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    trackingId: { type: String, unique: true, sparse: true },
    invoiceNumber: { type: String, unique: true, sparse: true },

    deliveredAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
