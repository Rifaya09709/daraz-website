import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import axios from "axios";

import Product from "../models/Product"; // unga actual path-ku maathunga

const UNSPLASH_BASE_URL = "https://api.unsplash.com";

const fetchOnePhoto = async (query: string) => {
  const response = await axios.get(`${UNSPLASH_BASE_URL}/search/photos`, {
    params: { query, per_page: 5 },
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

    for (const product of brokenProducts) {
      // Use subCategory if present, else category, else product name — for the best search query
      const query = product.subCategory || product.category || product.name;

      try {
        const photo = await fetchOnePhoto(query);

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
          console.log(`  ⚠️ No photo found for: ${product.name}`);
        }
      } catch (err: any) {
        failedCount++;
        console.log(`  ❌ Failed: ${product.name} — ${err.response?.data?.errors?.[0] || err.message}`);
      }

      // Unsplash free tier = 50 requests/hour — pace requests to avoid 403s
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }

    console.log(`\n🎉 Done! Fixed ${fixedCount}, Failed ${failedCount} out of ${brokenProducts.length}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Fix script failed:", error);
    process.exit(1);
  }
};

fix();