// src/scripts/ensureProductImages.ts
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import axios from "axios";
import Product from "../models/Product"; // unga actual path-ku maathunga

const UNSPLASH_BASE_URL = "https://api.unsplash.com";
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ---- Fetch one photo, with retry on rate-limit ----
const fetchOnePhoto = async (
  query: string,
  retries = 3
): Promise<{ url: string; alt: string } | null> => {
  try {
    const response = await axios.get(`${UNSPLASH_BASE_URL}/search/photos`, {
      params: { query, per_page: 10 },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    });

    const results = response.data.results;
    if (!results || results.length === 0) return null;

    const photo = results[Math.floor(Math.random() * results.length)];
    return {
      url: photo.urls.regular,
      alt: photo.alt_description || query,
    };
  } catch (err: any) {
    const isRateLimited =
      err.response?.status === 403 ||
      /rate limit/i.test(err.response?.data?.errors?.[0] || "");

    if (isRateLimited && retries > 0) {
      const waitMs = 10000 * (4 - retries); // 10s, 20s, 30s
      console.log(`  ⏳ Rate limited, waiting ${waitMs / 1000}s before retry...`);
      await sleep(waitMs);
      return fetchOnePhoto(query, retries - 1);
    }
    throw err;
  }
};

// A product "needs fixing" if:
// 1. images array is missing/empty
// 2. any image has no url / empty url
// 3. any image url is the dummyimage.com placeholder
const buildBrokenQuery = () => ({
  $or: [
    { images: { $exists: false } },
    { images: { $size: 0 } },
    { "images.url": { $in: [null, "", undefined] } },
    { "images.url": { $regex: "dummyimage.com" } },
  ],
});

const fixBatch = async (): Promise<{ fixed: number; failed: number; remaining: number }> => {
  const brokenProducts = await Product.find(buildBrokenQuery());
  console.log(`\nFound ${brokenProducts.length} products needing a real image`);

  let fixedCount = 0;
  let failedCount = 0;

  for (const product of brokenProducts) {
    const primaryQuery = product.subCategory || product.category || product.name;

    try {
      let photo = await fetchOnePhoto(primaryQuery);

      // Fallback chain: subCategory -> category -> product name -> generic "product"
      if (!photo && product.category && product.category !== primaryQuery) {
        console.log(`  🔄 No results for "${primaryQuery}", trying category "${product.category}"...`);
        photo = await fetchOnePhoto(product.category);
      }
      if (!photo && product.name) {
        console.log(`  🔄 Still nothing, trying product name "${product.name}"...`);
        photo = await fetchOnePhoto(product.name);
      }
      if (!photo) {
        console.log(`  🔄 Last resort, trying generic "product"...`);
        photo = await fetchOnePhoto("product");
      }

      if (photo) {
        product.images = [
          {
            url: photo.url,
            public_id: "",
            alt: photo.alt || product.name,
            isPrimary: true,
          },
        ] as any;

        await product.save();
        fixedCount++;
        console.log(`  ✅ Fixed: ${product.name}`);
      } else {
        failedCount++;
        console.log(`  ⚠️ No photo found anywhere for: ${product.name}`);
      }
    } catch (err: any) {
      failedCount++;
      console.log(`  ❌ Failed: ${product.name} — ${err.response?.data?.errors?.[0] || err.message}`);
    }

    // Unsplash free tier = 50 req/hour — pace requests to avoid 403s
    await sleep(1200);
  }

  const remaining = await Product.countDocuments(buildBrokenQuery());
  return { fixed: fixedCount, failed: failedCount, remaining };
};

const run = async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI not set in .env");
    if (!process.env.UNSPLASH_ACCESS_KEY) throw new Error("UNSPLASH_ACCESS_KEY not set in .env");

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    let totalFixed = 0;
    let pass = 1;
    const MAX_PASSES = 5; // enough passes to clear rate-limit stragglers

    while (pass <= MAX_PASSES) {
      console.log(`\n===== Pass ${pass} =====`);
      const { fixed, failed, remaining } = await fixBatch();
      totalFixed += fixed;

      console.log(`Pass ${pass} done → fixed: ${fixed}, failed: ${failed}, still broken: ${remaining}`);

      if (remaining === 0) {
        console.log("\n🎉 All products now have a real image!");
        break;
      }
      if (fixed === 0) {
        console.log("\n⚠️ No progress this pass — stopping to avoid infinite loop. Re-run the script later.");
        break;
      }
      pass++;
    }

    console.log(`\n✅ Total fixed across all passes: ${totalFixed}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Script failed:", error);
    process.exit(1);
  }
};

run();