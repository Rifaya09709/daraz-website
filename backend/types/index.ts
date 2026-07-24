export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role: 'user' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProduct {
  _id?: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  image: string;
  images?: string[];
  stock: number;
  rating: number;
  reviews: IReview[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IReview {
  _id?: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt?: Date;
}

export interface ICartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface ICart {
  _id?: string;
  userId: string;
  items: ICartItem[];
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOrder {
  _id?: string;
  userId: string;
  items: ICartItem[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAuthResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
}