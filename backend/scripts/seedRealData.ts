import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import axios from "axios";

import Product from "../models/Product";
import User from "../models/User";

// ===================================================================
// Source 1: DummyJSON — free, public, no key needed.
// ===================================================================
const DUMMYJSON_BASE_URL = "https://dummyjson.com/products";

const categoryMap: Record<string, string> = {
  smartphones: "Mobiles",
  laptops: "Laptops",
  fragrances: "Beauty",
  skincare: "Beauty",
  groceries: "Groceries",
  "home-decoration": "Furniture",
  furniture: "Furniture",
  tops: "Fashion",
  "womens-dresses": "Fashion",
  "womens-shoes": "Fashion",
  "mens-shirts": "Fashion",
  "mens-shoes": "Fashion",
  "mens-watches": "Electronics",
  "womens-watches": "Electronics",
  "womens-bags": "Fashion",
  "womens-jewellery": "Jewellery",
  sunglasses: "Fashion",
  automotive: "Bike",
  motorcycle: "Motorcycle",
  lighting: "Home Essentials",
  "kitchen-accessories": "Home & Kitchen",
  "mobile-accessories": "Electronics",
  tablets: "Electronics",
  vehicle: "Bike",
  "sports-accessories": "Health",
};

interface DummyProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  tags: string[];
  images: string[];
  thumbnail: string;
}

const toInrPrice = (usdPrice: number) => Math.round((usdPrice * 83) / 10) * 10;

const fetchDummyJsonProducts = async () => {
  console.log("\nFetching product data from DummyJSON...");
  const response = await axios.get(DUMMYJSON_BASE_URL, { params: { limit: 0 } });
  const items: DummyProduct[] = response.data.products;
  console.log(`  Fetched ${items.length} products from DummyJSON`);

  return items.map((item, index) => {
    const price = toInrPrice(item.price);
    const hasDiscount = item.discountPercentage > 0;
    const discountPrice = hasDiscount
      ? Math.round(price * (1 - item.discountPercentage / 100))
      : undefined;

    const mappedCategory = categoryMap[item.category] || "Electronics";

    return {
      name: item.title,
      slug: slugify(item.title, Date.now() + index),
      description: item.description,
      brand: item.brand || "Generic",
      category: mappedCategory,
      sku: `SKU-DJ-${item.id}-${Date.now()}`,
      price,
      discountPrice,
      discountPercentage: discountPrice
        ? Math.round(((price - discountPrice) / price) * 100)
        : 0,
      stock: item.stock,
      images: (item.images.length > 0 ? item.images : [item.thumbnail])
        .slice(0, 5)
        .map((url, i) => ({
          url,
          public_id: "",
          alt: item.title,
          isPrimary: i === 0,
        })),
      rating: Math.round(item.rating * 10) / 10,
      totalReviews: Math.floor(Math.random() * 400) + 10,
      isFeatured: Math.random() > 0.85,
      isFlashSale: Math.random() > 0.85,
      isTrending: Math.random() > 0.8,
      sold: Math.floor(Math.random() * 800),
      tags: item.tags && item.tags.length > 0 ? item.tags : [mappedCategory.toLowerCase()],
    };
  });
};

// ===================================================================
// Source 2: Open Food Facts — free, public, open database (ODbL).
// ===================================================================
const OPENFOODFACTS_URL = "https://world.openfoodfacts.org/cgi/search.pl";

interface OFFProduct {
  product_name?: string;
  brands?: string;
  image_url?: string;
  categories?: string;
  quantity?: string;
  code: string;
}

const fetchOpenFoodFactsProducts = async () => {
  console.log("\nFetching grocery data from Open Food Facts...");

  const response = await axios.get(OPENFOODFACTS_URL, {
    params: {
      search_simple: 1,
      action: "process",
      json: 1,
      page_size: 100,
      sort_by: "unique_scans_n",
      tagtype_0: "countries",
      tag_contains_0: "contains",
      tag_0: "india",
    },
    headers: {
      "User-Agent": "DarazCloneApp/1.0 (educational project)",
    },
  });

  const items: OFFProduct[] = response.data.products || [];
  const usable = items.filter((p) => p.product_name && p.image_url);
  console.log(`  Fetched ${usable.length} usable grocery products from Open Food Facts`);

  return usable.map((item, index) => {
    const price = Math.floor(Math.random() * (499 - 39 + 1)) + 39;
    const hasDiscount = Math.random() > 0.5;
    const discountPrice = hasDiscount ? Math.round(price * 0.85) : undefined;

    const name = item.quantity
      ? `${item.product_name} (${item.quantity})`
      : item.product_name!;

    return {
      name,
      slug: slugify(name, Date.now() + index + 100000),
      description: `${item.product_name}${item.brands ? ` by ${item.brands}` : ""}. Real product sourced from Open Food Facts open database.`,
      brand: item.brands?.split(",")[0]?.trim() || "Generic",
      category: "Groceries",
      sku: `SKU-OFF-${item.code}`,
      price,
      discountPrice,
      discountPercentage: discountPrice
        ? Math.round(((price - discountPrice) / price) * 100)
        : 0,
      stock: Math.floor(Math.random() * 100),
      images: [
        {
          url: item.image_url!,
          public_id: "",
          alt: item.product_name!,
          isPrimary: true,
        },
      ],
      rating: Math.round((3 + Math.random() * 2) * 10) / 10,
      totalReviews: Math.floor(Math.random() * 300),
      isFeatured: Math.random() > 0.9,
      isFlashSale: Math.random() > 0.9,
      isTrending: Math.random() > 0.85,
      sold: Math.floor(Math.random() * 500),
      tags: ["groceries", "food"],
    };
  });
};

// ===================================================================
// Source 3: Unsplash — for Baby/Kids categories (no free real-product
// API covers these). Stock photography, realistic naming — not
// scraped from any storefront.
// ===================================================================
const UNSPLASH_BASE_URL = "https://api.unsplash.com";

interface BabyKidsConfig {
  category: string;
  subCategory: string;
  searchQuery: string;
  brands: string[];
  nameTemplates: string[];
  priceRange: [number, number];
}

const babyKidsConfigs: BabyKidsConfig[] = [
  {
    category: "Baby",
    subCategory: "Baby Products",
    searchQuery: "baby care products",
    brands: ["Pampers", "Johnson's", "Himalaya", "Chicco", "Mee Mee", "LuvLap"],
    nameTemplates: [
      "{brand} Diapers Pack",
      "{brand} Baby Lotion",
      "{brand} Baby Wipes",
      "{brand} Feeding Bottle",
      "{brand} Baby Powder",
    ],
    priceRange: [99, 1499],
  },
  {
    category: "Baby",
    subCategory: "Baby Toys",
    searchQuery: "baby toys infant",
    brands: ["Fisher-Price", "Chicco", "LuvLap", "Mee Mee", "Winfun"],
    nameTemplates: [
      "{brand} Rattle Toy Set",
      "{brand} Soft Plush Toy",
      "{brand} Activity Gym",
      "{brand} Teether Toy",
    ],
    priceRange: [149, 2499],
  },
  {
    category: "Kids",
    subCategory: "Kids Toys",
    searchQuery: "kids toys children playing",
    brands: ["Fisher-Price", "Hot Wheels", "LEGO", "Barbie", "Funskool", "Nerf"],
    nameTemplates: [
      "{brand} Building Blocks Set",
      "{brand} Remote Control Car",
      "{brand} Doll House Playset",
      "{brand} Action Figure",
      "{brand} Board Game",
    ],
    priceRange: [199, 4999],
  },
  {
    category: "Kids",
    subCategory: "Kids Dress",
    searchQuery: "kids clothing children fashion",
    brands: ["H&M Kids", "Gini & Jony", "Allen Solly Junior", "Mothercare", "FirstCry"],
    nameTemplates: [
      "{brand} Cotton T-Shirt",
      "{brand} Party Frock",
      "{brand} Casual Shorts Set",
      "{brand} Winter Jacket",
      "{brand} School Uniform Set",
    ],
    priceRange: [249, 2999],
  },
];

const fetchUnsplashPhotos = async (query: string) => {
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

const fetchBabyKidsProducts = async () => {
  console.log("\nFetching Baby/Kids products (Unsplash images)...");
  let products: any[] = [];

  for (const config of babyKidsConfigs) {
    let photos: { url: string; alt: string }[] = [];
    try {
      photos = await fetchUnsplashPhotos(config.searchQuery);
    } catch (err: any) {
      console.error(`  ⚠️ Failed to fetch photos for ${config.subCategory}:`, err.message);
    }

    if (photos.length === 0) {
      photos = [
        {
          url: `https://dummyimage.com/500x500/e5e7eb/9ca3af.png&text=${encodeURIComponent(config.subCategory)}`,
          alt: config.subCategory,
        },
      ];
    }

    for (let i = 0; i < 20; i++) {
      const brand = pickRandom(config.brands);
      const template = pickRandom(config.nameTemplates);
      const name = `${template.replace("{brand}", brand)} ${i + 1}`;

      const price = randomBetween(config.priceRange[0], config.priceRange[1]);
      const hasDiscount = Math.random() > 0.4;
      const discountPrice = hasDiscount ? Math.round(price * 0.8) : undefined;

      const photo = photos[i % photos.length];

      products.push({
        name,
        slug: slugify(name, Date.now() + i + Math.floor(Math.random() * 100000)),
        description: `${name} — quality ${config.subCategory.toLowerCase()} product, safe and reliable for everyday use.`,
        brand,
        category: config.category,
        subCategory: config.subCategory,
        sku: `SKU-BK-${config.subCategory.replace(/\s+/g, "").slice(0, 4).toUpperCase()}-${Date.now()}-${i}`,
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
        rating: Math.round((3 + Math.random() * 2) * 10) / 10,
        totalReviews: randomBetween(0, 400),
        isFeatured: Math.random() > 0.85,
        isFlashSale: Math.random() > 0.85,
        isTrending: Math.random() > 0.8,
        sold: randomBetween(0, 800),
        tags: [
          config.category.toLowerCase(),
          config.subCategory.toLowerCase().replace(/\s+/g, "-"),
          brand.toLowerCase(),
        ],
      });
    }
    console.log(`  ✅ Prepared 20 products for ${config.subCategory}`);

    // Small delay between Unsplash category calls to stay well within rate limits
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return products;
};

const slugify = (text: string, suffix: number) =>
  `${text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-")}-${suffix}`;

const seed = async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI not set in .env");

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    const seller = await User.findOne({ role: { $in: ["admin", "seller"] } });
    if (!seller) {
      throw new Error(
        "No admin/seller user found. Register a user and set role to 'admin' or 'seller' first."
      );
    }
    console.log(`Using seller: ${seller.name} (${seller._id})`);

    let allProducts: any[] = [];

    // --- DummyJSON ---
    try {
      const dummyProducts = await fetchDummyJsonProducts();
      allProducts = allProducts.concat(dummyProducts);
    } catch (err: any) {
      console.error("  ⚠️ DummyJSON fetch failed:", err.message);
    }

    // --- Open Food Facts ---
    try {
      const groceryProducts = await fetchOpenFoodFactsProducts();
      allProducts = allProducts.concat(groceryProducts);
    } catch (err: any) {
      console.error("  ⚠️ Open Food Facts fetch failed:", err.message);
    }

    // --- Baby/Kids (Unsplash) ---
    try {
      const babyKidsProducts = await fetchBabyKidsProducts();
      allProducts = allProducts.concat(babyKidsProducts);
    } catch (err: any) {
      console.error("  ⚠️ Baby/Kids fetch failed:", err.message);
    }

    if (allProducts.length === 0) {
      throw new Error("No products fetched from any source — check network/API status");
    }

    const productsToInsert = allProducts.map((p) => ({ ...p, seller: seller._id }));

    await Product.insertMany(productsToInsert);

    console.log(`\n🎉 Done! ${productsToInsert.length} real-data products created.`);
    console.log(`   (DummyJSON + Open Food Facts + Baby/Kids combined)`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seed();