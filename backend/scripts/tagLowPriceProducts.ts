// src/scripts/tagLowPriceProducts.ts
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Product from "../models/Product"; // unga actual path-ku maathunga

const run = async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI not set in .env");

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    const result = await Product.updateMany(
      { $or: [{ discountPrice: { $lte: 500 } }, { price: { $lte: 500 } }] },
      { $addToSet: { tags: "low-price" } }
    );

    console.log(`✅ Tagged ${result.modifiedCount} products as low-price`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Script failed:", error);
    process.exit(1);
  }
};

run();