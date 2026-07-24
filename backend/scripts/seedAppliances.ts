import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import axios from "axios";

import Product from "../models/Product";
import User from "../models/User";

const UNSPLASH_BASE_URL = "https://api.unsplash.com";

interface ItemConfig {
  category: string;
  subCategory: string;
  searchQuery: string;
  brands: string[];
  nameTemplates: string[];
  priceRange: [number, number];
}

const itemConfigs: ItemConfig[] = [
  {
    category: "Electronics",
    subCategory: "Washing Machine",
    searchQuery: "washing machine appliance",
    brands: ["LG", "Samsung", "Whirlpool", "IFB", "Bosch", "Haier"],
    nameTemplates: [
      "{brand} Front Load Washing Machine",
      "{brand} Top Load Washing Machine",
      "{brand} Fully Automatic Washer",
      "{brand} Semi Automatic Washer",
    ],
    priceRange: [12999, 45999],
  },
  {
    category: "Electronics",
    subCategory: "Refrigerator",
    searchQuery: "refrigerator fridge kitchen",
    brands: ["LG", "Samsung", "Whirlpool", "Godrej", "Haier", "Bosch"],
    nameTemplates: [
      "{brand} Double Door Refrigerator",
      "{brand} Single Door Refrigerator",
      "{brand} Side By Side Refrigerator",
      "{brand} Triple Door Refrigerator",
    ],
    priceRange: [15999, 69999],
  },
  {
    category: "Furniture",
    subCategory: "Dining Table",
    searchQuery: "dining table furniture",
    brands: ["Urban Ladder", "Nilkamal", "Godrej Interio", "Pepperfry", "Durian"],
    nameTemplates: [
      "{brand} 4 Seater Dining Table",
      "{brand} 6 Seater Dining Set",
      "{brand} Wooden Dining Table",
      "{brand} Glass Top Dining Table",
    ],
    priceRange: [7999, 39999],
  },
  {
    category: "Electronics",
    subCategory: "Clock",
    searchQuery: "wall clock home decor",
    brands: ["Ajanta", "Titan", "Seiko", "Casio", "Philips"],
    nameTemplates: [
      "{brand} Wall Clock",
      "{brand} Analog Wall Clock",
      "{brand} Digital Table Clock",
      "{brand} Wooden Wall Clock",
    ],
    priceRange: [299, 2999],
  },
  {
    category: "Electronics",
    subCategory: "Bluetooth Headphones",
    searchQuery: "bluetooth headphones wireless",
    brands: ["Sony", "JBL", "Boat", "Bose", "Zebronics", "Skullcandy"],
    nameTemplates: [
      "{brand} Wireless Bluetooth Headphones",
      "{brand} Over Ear Headphones",
      "{brand} Noise Cancelling Headphones",
      "{brand} Sports Bluetooth Headphones",
    ],
    priceRange: [799, 12999],
  },
];

const fetchItemPhotos = async (query: string) => {
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

    for (const config of itemConfigs) {
      console.log(`\nFetching images for "${config.subCategory}"...`);

      let photos: { url: string; alt: string }[] = [];
      try {
        photos = await fetchItemPhotos(config.searchQuery);
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

      const productsForItem = [];

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

        productsForItem.push({
          name,
          slug: slugify(name, Date.now() + i),
          description: `${name} — reliable ${config.subCategory.toLowerCase()} built for everyday use. Trusted brand, solid performance, great value.`,
          brand,
          category: config.category,
          subCategory: config.subCategory,
          sku: `SKU-${config.subCategory.replace(/\s+/g, "").slice(0, 4).toUpperCase()}-${Date.now()}-${i}`,
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
          tags: [
            config.category.toLowerCase(),
            config.subCategory.toLowerCase().replace(/\s+/g, "-"),
            brand.toLowerCase(),
          ],
        });
      }

      await Product.insertMany(productsForItem);
      totalCreated += productsForItem.length;
      console.log(`  ✅ Created ${productsForItem.length} products for ${config.subCategory}`);
    }

    console.log(`\n🎉 Done! ${totalCreated} appliance/furniture products created.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seed();