export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;

  variant?: {
    color?: string;
    size?: string;
  };
}

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Packed"
  | "Shipped"
  | "Out For Delivery"
  | "Delivered"
  | "Cancelled";

export interface Order {
  _id: string;
  orderNumber: string;
  invoiceNumber: string;
  trackingId: string;

  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  } | string;

  items: OrderItem[];

  shippingAddress: ShippingAddress;

  paymentMethod: "COD" | "CARD" | "UPI";
  paymentStatus: "Pending" | "Paid" | "Failed";
  orderStatus: OrderStatus;

  subtotal: number;
  discount: number;
  tax: number;
  shippingCharge: number;
  totalAmount: number;

  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}