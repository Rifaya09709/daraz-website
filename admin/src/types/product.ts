export interface ProductImage {
  url: string;
  public_id?: string;
  alt?: string;
  isPrimary: boolean;
}

export interface Review {
  user: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Variant {
  color?: string;
  size?: string;
  stock: number;
  sku: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  category: string;
  subCategory?: string;
  sku: string;
  barcode?: string;

  price: number;
  discountPrice?: number;
  discountPercentage: number;

  stock: number;
  sold: number;

  images: ProductImage[];
  variants: Variant[];

  seller: {
    _id: string;
    name: string;
    email: string;
  } | string;

  rating: number;
  totalReviews: number;
  reviews: Review[];

  isFeatured: boolean;
  isFlashSale: boolean;
  isTrending: boolean;

  tags: string[];

  seoTitle?: string;
  seoDescription?: string;

  createdAt: string;
  updatedAt: string;
}