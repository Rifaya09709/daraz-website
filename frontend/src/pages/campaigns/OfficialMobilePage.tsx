// src/controllers/productController.ts
import { Request, Response } from "express";
import Product from "../models/Product";
import User from "../models/User";
import cloudinary from "../config/cloudinary";

const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ===============================
// Create Product
// ===============================
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      brand,
      category,
      subCategory,
      sku,
      barcode,
      price,
      discountPrice,
      stock,
      tags,
      highlights,
      features,
      warranty,
      seoTitle,
      seoDescription,
      unsplashImages,
    } = req.body;

    const seller = await User.findById((req as any).user.id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    const uploadedImages =
      (req.files as any[])?.map((file) => ({
        url: file.path,
        public_id: file.filename,
        alt: name,
      })) || [];

    let unsplashImageList: { url: string; alt?: string }[] = [];
    if (unsplashImages) {
      try {
        unsplashImageList = JSON.parse(unsplashImages);
      } catch {
        return res.status(400).json({
          success: false,
          message: "unsplashImages must be a valid JSON array",
        });
      }
    }

    const combinedImages = [
      ...uploadedImages,
      ...unsplashImageList.map((img) => ({
        url: img.url,
        public_id: "",
        alt: img.alt || name,
      })),
    ].map((img, index) => ({
      ...img,
      isPrimary: index === 0,
    }));

    const parseListField = (value: any): string[] => {
      if (!value) return [];
      if (Array.isArray(value)) return value;
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    };

    const product = await Product.create({
      name,
      slug: name.toLowerCase().trim().replace(/\s+/g, "-"),
      description,
      brand,
      category,
      subCategory,
      sku,
      barcode,
      price,
      discountPrice,
      discountPercentage:
        discountPrice && price
          ? Math.round(((price - discountPrice) / price) * 100)
          : 0,
      stock,
      images: combinedImages,
      seller: seller._id,
      tags,
      highlights: parseListField(highlights),
      features: parseListField(features),
      warranty,
      seoTitle,
      seoDescription,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Get All Products
// ===============================
export const getProducts = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const query: any = {};

    if (req.query.category) {
      const safeCategory = escapeRegex(req.query.category as string);
      query.category = new RegExp(`^${safeCategory}$`, "i");
    }

    // subCategory filter — without this, selecting "Smartwatches" (which
    // maps to the broad "Electronics" category) pulled in every Electronics
    // subCategory (Camera Tripods, LED Bulbs, USB Cables, etc.), which is why
    // unrelated product photos (like a camera tripod) showed up.
    if (req.query.subCategory) {
      const safeSubCategory = escapeRegex(req.query.subCategory as string);
      query.subCategory = new RegExp(`^${safeSubCategory}$`, "i");
    }

    // tag filter — used for campaign pages like "low-price", "new-arrivals", etc.
    if (req.query.tag) {
      query.tags = { $in: [req.query.tag as string] };
    }

    if (req.query.brand) query.brand = req.query.brand;
    if (req.query.search) query.$text = { $search: req.query.search as string };

    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    const products = await Product.find(query)
      .populate("seller", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    return res.status(200).json({
      success: true,
      products,
      page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Get Single Product
// ===============================
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "name email"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({ success: true, product });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Update Product
// ===============================
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { unsplashImages, highlights, features, warranty } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const uploadedImages =
      (req.files as any[])?.map((file) => ({
        url: file.path,
        public_id: file.filename,
        alt: req.body.name || product.name,
      })) || [];

    let unsplashImageList: { url: string; alt?: string }[] = [];
    if (unsplashImages) {
      try {
        unsplashImageList = JSON.parse(unsplashImages);
      } catch {
        return res.status(400).json({
          success: false,
          message: "unsplashImages must be a valid JSON array",
        });
      }
    }

    const newImages = [
      ...uploadedImages,
      ...unsplashImageList.map((img) => ({
        url: img.url,
        public_id: "",
        alt: img.alt || product.name,
      })),
    ];

    if (newImages.length > 0) {
      for (const img of product.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id).catch(() => {});
        }
      }

      product.images = newImages.map((img, index) => ({
        ...img,
        isPrimary: index === 0,
      }));
    }

    const parseListField = (value: any): string[] | undefined => {
      if (value === undefined) return undefined;
      if (Array.isArray(value)) return value;
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : undefined;
      } catch {
        return undefined;
      }
    };

    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.brand = req.body.brand || product.brand;
    product.category = req.body.category || product.category;
    product.subCategory = req.body.subCategory || product.subCategory;

    product.price = req.body.price ? Number(req.body.price) : product.price;
    product.discountPrice = req.body.discountPrice
      ? Number(req.body.discountPrice)
      : product.discountPrice;

    product.stock = req.body.stock ? Number(req.body.stock) : product.stock;

    product.tags = req.body.tags || product.tags;

    const parsedHighlights = parseListField(highlights);
    if (parsedHighlights !== undefined) product.highlights = parsedHighlights;

    const parsedFeatures = parseListField(features);
    if (parsedFeatures !== undefined) product.features = parsedFeatures;

    product.warranty = warranty || product.warranty;

    product.seoTitle = req.body.seoTitle || product.seoTitle;
    product.seoDescription = req.body.seoDescription || product.seoDescription;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Delete Product
// ===============================
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    for (const img of product.images) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id).catch(() => {});
      }
    }

    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Remove Single Product Image
// ===============================
export const removeProductImage = async (req: Request, res: Response) => {
  try {
    const { id, imageIndex } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const index = Number(imageIndex);
    const image = product.images[index];

    if (image?.public_id) {
      await cloudinary.uploader.destroy(image.public_id).catch(() => {});
    }

    product.images.splice(index, 1);

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Image removed successfully",
      images: product.images,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to remove image",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Add Product Review
// ===============================
export const addReview = async (req: Request, res: Response) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const existingReview = product.reviews.find(
      (review) => review.user.toString() === (req as any).user.id
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    product.reviews.push({
      user: (req as any).user.id,
      name: (req as any).user.name,
      rating: Number(rating),
      comment,
      createdAt: new Date(),
    });

    product.totalReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((sum, review) => sum + review.rating, 0) /
      product.totalReviews;

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add review",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Featured Products
// ===============================
export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(12);
    return res.status(200).json({ success: true, products });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch featured products",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Flash Sale Products
// ===============================
export const getFlashSaleProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ isFlashSale: true }).limit(20);
    return res.status(200).json({ success: true, products });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch flash sale products",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Trending Products
// ===============================
export const getTrendingProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ isTrending: true })
      .sort({ sold: -1 })
      .limit(20);

    return res.status(200).json({ success: true, products });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch trending products",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Latest Products
// ===============================
export const getLatestProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(20);
    return res.status(200).json({ success: true, products });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch latest products",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Related Products
// ===============================
export const getRelatedProducts = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const products = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(8);

    return res.status(200).json({ success: true, products });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch related products",
      error: error instanceof Error ? error.message : error,
    });
  }
};