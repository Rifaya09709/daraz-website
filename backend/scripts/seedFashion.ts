import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import axios from "axios";

import Product from "../models/Product";
import User from "../models/User";

const UNSPLASH_BASE_URL = "https://api.unsplash.com";

interface SubCategoryConfig {
  subCategory: string;
  searchQuery: string;
  brands: string[];
  nameTemplates: string[];
  priceRange: [number, number];
}

const subCategoryConfigs: SubCategoryConfig[] = [
  {
    subCategory: "Men",
    searchQuery: "men fashion clothing",
    brands: ["Levis", "Nike", "Adidas", "Puma", "Roadster", "H&M", "Zara"],
    nameTemplates: [
      "{brand} Men's Casual Shirt",
      "{brand} Men's Slim Fit Jeans",
      "{brand} Men's Polo T-Shirt",
      "{brand} Men's Bomber Jacket",
      "{brand} Men's Formal Trousers",
      "{brand} Men's Hoodie",
      "{brand} Men's Sneakers",
    ],
    priceRange: [499, 4999],
  },
  {
    subCategory: "Women",
    searchQuery: "women fashion clothing",
    brands: ["Zara", "H&M", "Vero Moda", "Forever 21", "Only", "Biba", "W"],
    nameTemplates: [
      "{brand} Women's Floral Dress",
      "{brand} Women's Denim Jacket",
      "{brand} Women's Kurti Set",
      "{brand} Women's Crop Top",
      "{brand} Women's Palazzo Pants",
      "{brand} Women's Maxi Dress",
      "{brand} Women's Handbag",
    ],
    priceRange: [599, 5999],
  },
  {
    subCategory: "Kids Boys",
    searchQuery: "kids boys clothing",
    brands: ["Gini & Jony", "Allen Solly Junior", "H&M Kids", "Nike Kids", "US Polo Kids"],
    nameTemplates: [
      "{brand} Boys Printed T-Shirt",
      "{brand} Boys Denim Shorts",
      "{brand} Boys Casual Shirt",
      "{brand} Boys Track Pants",
      "{brand} Boys Hoodie",
      "{brand} Boys Ethnic Kurta Set",
    ],
    priceRange: [299, 1999],
  },
  {
    subCategory: "Kids Girls",
    searchQuery: "kids girls clothing",
    brands: ["Gini & Jony", "H&M Kids", "Nike Kids", "US Polo Kids", "Biba Girls"],
    nameTemplates: [
      "{brand} Girls Frock Dress",
      "{brand} Girls Printed T-Shirt",
      "{brand} Girls Leggings Set",
      "{brand} Girls Party Dress",
      "{brand} Girls Denim Skirt",
      "{brand} Girls Ethnic Set",
    ],
    priceRange: [299, 2499],
  },
];

const fetchSubCategoryPhotos = async (query: string) => {
  const response = await axios.get(`${UNSPLASH_BASE_URL}/search/photos`, {
    params: { query, per_page: 20 },
    headers: {
      Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
    },
  });

  return response.data.results.map((photo: any) => ({
    url: photo.urls.regular,
    alt: photo.alt_description || query,
  }));
};

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const slugify = (text: string, suffix: number) =>
  `${text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-")}-${suffix}`;

const seed = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not set in .env");
    }
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      throw new Error("UNSPLASH_ACCESS_KEY not set in .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    const seller = await User.findOne({
      role: { $in: ["admin", "seller"] },
    });

    if (!seller) {
      throw new Error(
        "No admin/seller user found. Register a user and set role to 'admin' or 'seller' first."
      );
    }

    console.log(`Using seller: ${seller.name} (${seller._id})`);

    let totalCreated = 0;

    for (const config of subCategoryConfigs) {
      console.log(`\nFetching images for "${config.subCategory}"...`);

      let photos: { url: string; alt: string }[] = [];
      try {
        photos = await fetchSubCategoryPhotos(config.searchQuery);
      } catch (err: any) {
        console.error(
          `  ⚠️ Failed to fetch photos for ${config.subCategory}:`,
          err.response?.data || err.message
        );
      }

      if (photos.length === 0) {
        console.log(`  No photos found, using a placeholder for ${config.subCategory}`);
        photos = [
          {
            url: `https://dummyimage.com/500x500/e5e7eb/9ca3af.png&text=${encodeURIComponent(
              config.subCategory
            )}`,
            alt: config.subCategory,
          },
        ];
      }

      const productsForSubCategory = [];

      for (let i = 0; i < 20; i++) {
        const brand = pickRandom(config.brands);
        const template = pickRandom(config.nameTemplates);
        const name = `${template.replace("{brand}", brand)} ${i + 1}`;

        const price = randomBetween(config.priceRange[0], config.priceRange[1]);
        const hasDiscount = Math.random() > 0.4;
        const discountPrice = hasDiscount
          ? Math.round(price * (0.7 + Math.random() * 0.2))
          : undefined;

        const photo = photos[i % photos.length];

        productsForSubCategory.push({
          name,
          slug: slugify(name, Date.now() + i),
          description: `${name} — quality ${config.subCategory.toLowerCase()} apparel. Comfortable fit, durable fabric, great value.`,
          brand,
          category: "Fashion",
          subCategory: config.subCategory,
          sku: `SKU-FSH-${config.subCategory.replace(/\s+/g, "").slice(0, 4).toUpperCase()}-${Date.now()}-${i}`,
          price,
          discountPrice,
          discountPercentage: discountPrice
            ? Math.round(((price - discountPrice) / price) * 100)
            : 0,
          stock: randomBetween(0, 100),
          images: [
            {
              url: photo.url,
              public_id: "",
              alt: photo.alt || name,
              isPrimary: true,
            },
          ],
          seller: seller._id,
          rating: Math.round((3 + Math.random() * 2) * 10) / 10,
          totalReviews: randomBetween(0, 500),
          isFeatured: Math.random() > 0.85,
          isFlashSale: Math.random() > 0.85,
          isTrending: Math.random() > 0.8,
          sold: randomBetween(0, 1000),
          tags: ["fashion", config.subCategory.toLowerCase().replace(/\s+/g, "-"), brand.toLowerCase()],
        });
      }

      await Product.insertMany(productsForSubCategory);
      totalCreated += productsForSubCategory.length;
      console.log(`  ✅ Created ${productsForSubCategory.length} products for ${config.subCategory}`);
    }

    console.log(`\n🎉 Done! ${totalCreated} fashion products created.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seed();