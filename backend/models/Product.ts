

import mongoose, { Document, Schema } from "mongoose";

export interface IProductImage {
  url: string;
  public_id?: string;
  alt?: string;
  isPrimary: boolean;
}

export interface IReview {
  user: mongoose.Types.ObjectId;
  name: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface IVariant {
  color?: string;
  size?: string;
  stock: number;
  sku: string;
  images?: string[];
}

export interface IProduct extends Document {
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

  images: IProductImage[];
  video?: string;   // 👈 NEW — YouTube URL or direct mp4 URL
  variants: IVariant[];

  seller: mongoose.Types.ObjectId;
  warranty?: string;

  rating: number;
  totalReviews: number;
  reviews: IReview[];

  isFeatured: boolean;
  isFlashSale: boolean;
  isTrending: boolean;

  tags: string[];
  highlights: string[];
  features: string[];

  seoTitle?: string;
  seoDescription?: string;
}

const ImageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true },
    public_id: { type: String, default: "" },
    alt: { type: String, default: "" },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false }
);

const VariantSchema = new Schema<IVariant>(
  {
    color: String,
    size: String,
    stock: { type: Number, default: 0 },
    sku: { type: String, required: true },
    images: { type: [String], default: [] },
  },
  { _id: false }
);

const ReviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: String,

    sku: { type: String, unique: true, required: true },
    barcode: String,

    price: { type: Number, required: true },
    discountPrice: Number,
    discountPercentage: { type: Number, default: 0 },

    stock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },

    images: [ImageSchema],
    video: { type: String, default: "" },   // 👈 NEW
    variants: [VariantSchema],

    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    warranty: { type: String, default: "Warranty not available" },

    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    reviews: [ReviewSchema],

    isFeatured: { type: Boolean, default: false },
    isFlashSale: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    

    tags: [String],
    highlights: { type: [String], default: [] },
    features: { type: [String], default: [] },

    seoTitle: String,
    seoDescription: String,
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text" });
export default mongoose.model<IProduct>("Product", ProductSchema);