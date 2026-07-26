// src/scripts/checkEmptySubCategories.ts
//
// Purpose: Ella category + subCategory combo kum, endha product irukka nu check pannuvom.
// "No Products Found" varuradhu — DB la products illama irundha bug illa,
// products irundhu um filter query wrong-a irundha adhu bug.

import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Product from "../models/Product";

const run = async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI not set in .env");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected\n");

    // Get every distinct (category, subCategory) pair that actually exists in DB
    const combos = await Product.aggregate([
      { $group: { _id: { category: "$category", subCategory: "$subCategory" }, count: { $sum: 1 } } },
      { $sort: { "_id.category": 1, "_id.subCategory": 1 } },
    ]);

    console.log(`Total distinct category+subCategory combos in DB: ${combos.length}\n`);

    let emptyCount = 0;
    for (const c of combos) {
      const cat = c._id.category || "(none)";
      const sub = c._id.subCategory || "(none)";
      if (c.count === 0) emptyCount++;
      console.log(`${cat.padEnd(28)} / ${sub.padEnd(28)}  →  ${c.count} products`);
    }

    // Specifically check the one from the screenshot
    console.log("\n--- Specific check: Electronic Accessories / Printers ---");
    const printersCount = await Product.countDocuments({
      category: "Electronic Accessories",
      subCategory: "Printers",
    });
    console.log(`Products found: ${printersCount}`);

    if (printersCount === 0) {
      console.log("⚠️ Confirmed: no products exist under this exact category+subCategory in DB.");
      console.log("   Either seed/add products here, or hide empty subcategories in the UI.");
    } else {
      console.log("🤔 Products EXIST in DB but page shows 'No Products Found' — this means");
      console.log("   the bug is in your frontend/backend query or filter logic, not the data.");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Check failed:", error);
    process.exit(1);
  }
};

run();