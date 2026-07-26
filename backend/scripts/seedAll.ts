// src/scripts/seedMissingSubCategoriesAll.ts
//
// Combined script — rendu batch-oda missing subCategory configs-um
// (Mobiles/Laptops/Furniture/Beauty/etc. + Electronic Accessories/
// TV & Appliances/Fashion/etc.) oru array-la merge pannirukom.
// category/subCategory strings frontend categories.ts-oda exact match
// aaganum, so idha rename pannadha.

import dotenv from "dotenv";
dotenv.config();
import Product from "../models/Product"; // unga actual path-ku maathunga
import mongoose from "mongoose";
import axios from "axios";
import User from "../models/User";

const UNSPLASH_BASE_URL = "https://api.unsplash.com";

interface SubCategoryConfig {
  category: string;
  subCategory: string;
  searchQuery: string;
  brands: string[];
  nameTemplates: string[];
  priceRange: [number, number];
  highlightsPool: string[];
  featuresPool: string[];
}

const missingSubCategoryConfigs: SubCategoryConfig[] = [];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchPhotos = async (query: string, retries = 2): Promise<{ url: string; alt: string }[]> => {
  try {
    const response = await axios.get(`${UNSPLASH_BASE_URL}/search/photos`, {
      params: { query, per_page: 30, page: 1 },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    });

    const results = response.data.results;

    if (results.length === 0) {
      const fallbackQuery = query.split(" ").slice(0, 2).join(" ");
      console.log(`  ⚠️ No results for "${query}", trying fallback: "${fallbackQuery}"`);
      const fallbackRes = await axios.get(`${UNSPLASH_BASE_URL}/search/photos`, {
        params: { query: fallbackQuery, per_page: 30, page: 1 },
        headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
      });
      results.push(...fallbackRes.data.results);
    }

    const seen = new Set<string>();
    const uniquePhotos = results.filter((photo: any) => {
      if (seen.has(photo.id)) return false;
      seen.add(photo.id);
      return true;
    });

    return uniquePhotos.map((photo: any) => ({
      url: photo.urls.regular,
      alt: photo.alt_description || query,
    }));
  } catch (err: any) {
    const status = err.response?.status;
    const isRateLimited =
      status === 403 || /rate limit/i.test(err.response?.data?.errors?.[0] || "");

    const remaining = err.response?.headers?.["x-ratelimit-remaining"];
    if (remaining !== undefined) {
      console.log(`  📊 Unsplash requests remaining: ${remaining}`);
    }

    if (isRateLimited && retries > 0) {
      const waitMs = 10000 * (3 - retries);
      console.log(`  ⏳ Rate limited, waiting ${waitMs / 1000}s before retry...`);
      await sleep(waitMs);
      return fetchPhotos(query, retries - 1);
    }

    console.error(`  ❌ Photo fetch failed for "${query}" (status: ${status})`);
    throw err;
  }
};

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const pickRandomSubset = <T,>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const slugify = (text: string, suffix: number) =>
  `${text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-")}-${suffix}`;

// Photo-oda alt_description-ah base pannி oru clean, Title-Case name
// fragment build pannurom. Idhu vachi generate panra name, andha
// specific photo-ku correct-ah match aagum (template-la irundhu
// generic-ah edukkurathukku pathila).
const NOISE_WORDS = new Set([
  "photo", "image", "picture", "of", "a", "an", "the",
  "close", "up", "closeup", "background", "isolated", "shot",
]);

const cleanAltText = (alt: string): string => {
  if (!alt) return "";
  const cleaned = alt
    .split(/\s+/)
    .filter((word) => word.length > 1 && !NOISE_WORDS.has(word.toLowerCase()))
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .trim();
  return cleaned.length > 4 && cleaned.length <= 70 ? cleaned : "";
};

const seedMissing = async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI not set in .env");
    if (!process.env.UNSPLASH_ACCESS_KEY) throw new Error("UNSPLASH_ACCESS_KEY not set in .env");

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    const seller = await User.findOne({ role: { $in: ["admin", "seller"] } });
    if (!seller) {
      throw new Error("No admin/seller user found. Register a user and set role to 'admin' or 'seller' first.");
    }
    console.log(`Using seller: ${seller.name} (${seller._id})`);

    let totalCreated = 0;

    for (const [index, config] of missingSubCategoryConfigs.entries()) {
      const existingCount = await Product.countDocuments({
        category: config.category,
        subCategory: config.subCategory,
      });
      if (existingCount > 0) {
        console.log(`\n⏭️  Skipping "${config.subCategory}" — already has ${existingCount} products`);
        continue;
      }

      console.log(`\nFetching images for "${config.subCategory}"...`);

      let photos: { url: string; alt: string }[] = [];
      try {
        photos = await fetchPhotos(config.searchQuery);
      } catch (err: any) {
        console.error(`  ⚠️ Failed to fetch photos for ${config.subCategory}:`, err.response?.data || err.message);
      }

      if (index < missingSubCategoryConfigs.length - 1) {
        await sleep(2000);
      }

      if (photos.length === 0) {
        console.log(`  No photos found, using a placeholder for ${config.subCategory}`);
        photos = [
          {
            url: `https://dummyimage.com/500x500/e5e7eb/9ca3af.png&text=${encodeURIComponent(config.subCategory)}`,
            alt: config.subCategory,
          },
        ];
      }

      const productsForSubCategory = [];

      for (let i = 0; i < 40; i++) {
        const brand = pickRandom(config.brands);

        // MUKKIYAM: photo-ah MUTHALLA pick pannுறோம், appuram andha photo-oda
        // alt text vachi name build pannுறோம். Idhu vachi name always
        // andha specific product-ku assign aagira image-ah correct-ah
        // describe pannும்.
        const photo = photos[i % photos.length];
        const altName = cleanAltText(photo.alt);

        const name = altName
          ? `${brand} ${altName}`
          : `${pickRandom(config.nameTemplates).replace("{brand}", brand)} ${i + 1}`; // alt text illama/useless-ah irundha fallback

        const price = randomBetween(config.priceRange[0], config.priceRange[1]);
        const hasDiscount = Math.random() > 0.4;
        const discountPrice = hasDiscount ? Math.round(price * (0.7 + Math.random() * 0.2)) : undefined;
        const highlights = pickRandomSubset(config.highlightsPool, 4);
        const features = pickRandomSubset(config.featuresPool, 4);

        productsForSubCategory.push({
          name,
          slug: slugify(name, Date.now() + i),
          description: `${name} — a quality ${config.subCategory.toLowerCase()} product for everyday use. ${highlights.join(", ")}. Trusted brand, reliable performance, great value for your home.`,
          brand,
          category: config.category,
          subCategory: config.subCategory,
          sku: `SKU-${config.subCategory.replace(/\s+/g, "").slice(0, 4).toUpperCase()}-${Date.now()}-${i}`,
          price,
          discountPrice,
          discountPercentage: discountPrice ? Math.round(((price - discountPrice) / price) * 100) : 0,
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
            config.category.toLowerCase().replace(/\s+/g, "-"),
            config.subCategory.toLowerCase().replace(/\s+/g, "-"),
            brand.toLowerCase(),
          ],
          highlights,
          features,
          warranty: "Warranty not available",
        });
      }

      await Product.insertMany(productsForSubCategory);
      totalCreated += productsForSubCategory.length;
      console.log(`  ✅ Created ${productsForSubCategory.length} products for ${config.subCategory}`);
    }

    console.log(`\n🎉 Done! ${totalCreated} products created across missing subcategories.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedMissing();