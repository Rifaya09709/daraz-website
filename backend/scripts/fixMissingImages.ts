import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import axios from "axios";

import Product from "../models/Product"; // unga actual path-ku maathunga

const UNSPLASH_BASE_URL = "https://api.unsplash.com";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Now retries on rate-limit (403) instead of giving up immediately —
// this was the main reason products were staying "stuck" on the
// placeholder image (a rate-limited request counted as "failed" and
// moved on, permanently skipping that product).
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
    if (results.length === 0) return null;

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

const fix = async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI not set in .env");
    if (!process.env.UNSPLASH_ACCESS_KEY) throw new Error("UNSPLASH_ACCESS_KEY not set in .env");

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    // Find every product whose image is still the dummyimage.com fallback
    const brokenProducts = await Product.find({
      "images.url": { $regex: "dummyimage.com" },
    });

    console.log(`Found ${brokenProducts.length} products with placeholder images`);

    let fixedCount = 0;
    let failedCount = 0;
    const stillBroken: string[] = [];

    for (const product of brokenProducts) {
      // Use subCategory if present, else category, else product name — for the best search query
      const query = product.subCategory || product.category || product.name;

      try {
        let photo = await fetchOnePhoto(query);

        // If the specific subCategory query returns nothing (e.g. an
        // unusual term Unsplash has no matches for), fall back to the
        // broader category so the product doesn't stay stuck forever.
        if (!photo && product.category && product.category !== query) {
          console.log(`  🔄 No results for "${query}", retrying with category "${product.category}"...`);
          photo = await fetchOnePhoto(product.category);
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
          stillBroken.push(product.name);
          console.log(`  ⚠️ No photo found for: ${product.name}`);
        }
      } catch (err: any) {
        failedCount++;
        stillBroken.push(product.name);
        console.log(`  ❌ Failed: ${product.name} — ${err.response?.data?.errors?.[0] || err.message}`);
      }

      // Unsplash free tier = 50 requests/hour — pace requests to avoid 403s
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }

    console.log(`\n🎉 Done! Fixed ${fixedCount}, Failed ${failedCount} out of ${brokenProducts.length}`);
    if (stillBroken.length > 0) {
      console.log(`\n⚠️ Still broken (re-run the script later to retry these):`);
      stillBroken.forEach((name) => console.log(`  - ${name}`));
    }
    process.exit(0);
  } catch (error) {
    console.error("❌ Fix script failed:", error);
    process.exit(1);
  }
};

fix();