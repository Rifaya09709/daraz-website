export interface Address {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "seller" | "admin";
  profileImage?: string;

  isVerified: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;

  addresses: Address[];

  createdAt: string;
  updatedAt: string;
}