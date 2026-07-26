// src/scripts/migrateOldCategories.ts
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Product from "../models/Product";

interface Migration {
  from: { category: string; subCategory?: string | null };
  to: { category: string; subCategory: string };
}

// null subCategory in `from` means "match products with NO subCategory field"
const MIGRATIONS: Migration[] = [
  // ===== Baby =====
  { from: { category: "Baby", subCategory: null }, to: { category: "Mother & Baby", subCategory: "Toys & Games" } },
  { from: { category: "Baby", subCategory: "Baby All Items" }, to: { category: "Mother & Baby", subCategory: "Baby Personal Care" } },
  { from: { category: "Baby", subCategory: "Baby Bath Tub" }, to: { category: "Mother & Baby", subCategory: "Baby Personal Care" } },
  { from: { category: "Baby", subCategory: "Baby Carrier & Stroller" }, to: { category: "Mother & Baby", subCategory: "Baby Gear" } },
  { from: { category: "Baby", subCategory: "Baby Lotion" }, to: { category: "Mother & Baby", subCategory: "Baby Personal Care" } },
  { from: { category: "Baby", subCategory: "Baby Products" }, to: { category: "Mother & Baby", subCategory: "Baby Personal Care" } },
  { from: { category: "Baby", subCategory: "Baby Toys" }, to: { category: "Mother & Baby", subCategory: "Toys & Games" } },

  // ===== Beauty / Beauty & Makeup =====
  { from: { category: "Beauty", subCategory: null }, to: { category: "Health & Beauty", subCategory: "Bath & Body" } },
  { from: { category: "Beauty & Makeup", subCategory: "Foundation" }, to: { category: "Health & Beauty", subCategory: "Makeup" } },
  { from: { category: "Beauty & Makeup", subCategory: "Fragrance" }, to: { category: "Health & Beauty", subCategory: "Fragrances" } },
  { from: { category: "Beauty & Makeup", subCategory: "Lipstick" }, to: { category: "Health & Beauty", subCategory: "Makeup" } },
  { from: { category: "Beauty & Makeup", subCategory: "Makeup Brush" }, to: { category: "Health & Beauty", subCategory: "Makeup" } },
  { from: { category: "Beauty & Makeup", subCategory: "Skincare" }, to: { category: "Health & Beauty", subCategory: "Skin Care" } },

  // ===== Bike =====
  { from: { category: "Bike", subCategory: null }, to: { category: "Sports & Outdoor", subCategory: "Outdoor Recreation" } },
  { from: { category: "Bike", subCategory: "Bicycles" }, to: { category: "Sports & Outdoor", subCategory: "Outdoor Recreation" } },

  // ===== Electronics (old bucket) =====
  { from: { category: "Electronics", subCategory: null }, to: { category: "Electronic Accessories", subCategory: "Computer Accessories" } },
  { from: { category: "Electronics", subCategory: "AC" }, to: { category: "TV & Home Appliances", subCategory: "Air Conditioner" } },
  { from: { category: "Electronics", subCategory: "Air Cooler" }, to: { category: "TV & Home Appliances", subCategory: "Cooling & Heating" } },
  { from: { category: "Electronics", subCategory: "Bluetooth Headphones" }, to: { category: "Electronic Accessories", subCategory: "Headphones & Headsets" } },
  { from: { category: "Electronics", subCategory: "Camera Tripod" }, to: { category: "Electronic Accessories", subCategory: "Camera Accessories" } },
  { from: { category: "Electronics", subCategory: "Clock" }, to: { category: "Home & Lifestyle", subCategory: "Decor" } },
  { from: { category: "Electronics", subCategory: "Electronics Accessories" }, to: { category: "Electronic Accessories", subCategory: "Computer Accessories" } },
  { from: { category: "Electronics", subCategory: "Fan Remote" }, to: { category: "TV & Home Appliances", subCategory: "TV Accessories" } },
  { from: { category: "Electronics", subCategory: "Hand Fan" }, to: { category: "TV & Home Appliances", subCategory: "Cooling & Heating" } },
  { from: { category: "Electronics", subCategory: "LED Bulbs & Smart Lights" }, to: { category: "Home & Lifestyle", subCategory: "Lighting" } },
  { from: { category: "Electronics", subCategory: "Memory Cards & Pen Drives" }, to: { category: "Electronic Accessories", subCategory: "Storage" } },
  { from: { category: "Electronics", subCategory: "Phone Case" }, to: { category: "Electronic Accessories", subCategory: "Mobile Accessories" } },
  { from: { category: "Electronics", subCategory: "Power Strip & Extension Board" }, to: { category: "Electronic Accessories", subCategory: "Computer Accessories" } },
  { from: { category: "Electronics", subCategory: "Refrigerator" }, to: { category: "TV & Home Appliances", subCategory: "Refrigerators & Freezers" } },
  { from: { category: "Electronics", subCategory: "Speaker" }, to: { category: "Electronic Accessories", subCategory: "Portable Speakers" } },
  { from: { category: "Electronics", subCategory: "TV Remote" }, to: { category: "TV & Home Appliances", subCategory: "TV Accessories" } },
  { from: { category: "Electronics", subCategory: "Table Fan" }, to: { category: "TV & Home Appliances", subCategory: "Cooling & Heating" } },
  { from: { category: "Electronics", subCategory: "USB Cables & Chargers" }, to: { category: "Electronic Accessories", subCategory: "Mobile Accessories" } },
  { from: { category: "Electronics", subCategory: "Washing Machine" }, to: { category: "TV & Home Appliances", subCategory: "Washing Machine" } },
  { from: { category: "Electronics", subCategory: "Watches" }, to: { category: "Watches, Bags & Jewellery", subCategory: "Men's Watches" } },

  // ===== Fashion (old bucket) =====
  { from: { category: "Fashion", subCategory: null }, to: { category: "Women's Fashion", subCategory: "Dresses & Skirts" } },
  { from: { category: "Fashion", subCategory: "Abhaya" }, to: { category: "Women's Fashion", subCategory: "Muslim Wear" } },
  { from: { category: "Fashion", subCategory: "Bags" }, to: { category: "Watches, Bags & Jewellery", subCategory: "Womens Bags" } },
  { from: { category: "Fashion", subCategory: "Belts & Wallets" }, to: { category: "Men's Fashion", subCategory: "Accessories" } },
  { from: { category: "Fashion", subCategory: "Bra" }, to: { category: "Women's Fashion", subCategory: "Bras, Panties & Lingerie" } },
  { from: { category: "Fashion", subCategory: "Burkha" }, to: { category: "Women's Fashion", subCategory: "Muslim Wear" } },
  { from: { category: "Fashion", subCategory: "Formal Shoes" }, to: { category: "Men's Fashion", subCategory: "Boy's Shoes" } },
  { from: { category: "Fashion", subCategory: "Hand Gloves" }, to: { category: "Women's Fashion", subCategory: "Winter Clothing" } },
  { from: { category: "Fashion", subCategory: "Kids Boys" }, to: { category: "Men's Fashion", subCategory: "Boy's Clothing" } },
  { from: { category: "Fashion", subCategory: "Kids Girls" }, to: { category: "Women's Fashion", subCategory: "Girls Clothing" } },
  { from: { category: "Fashion", subCategory: "Kurtis & Ethnic Wear" }, to: { category: "Women's Fashion", subCategory: "Kurtas & Shalwar Kameez" } },
  { from: { category: "Fashion", subCategory: "Men" }, to: { category: "Men's Fashion", subCategory: "Shirts & Polo" } },
  { from: { category: "Fashion", subCategory: "Men's Dress" }, to: { category: "Men's Fashion", subCategory: "Shirts & Polo" } },
  { from: { category: "Fashion", subCategory: "Men's Innerwear" }, to: { category: "Men's Fashion", subCategory: "Inner Wear" } },
  { from: { category: "Fashion", subCategory: "Raincoats & Umbrellas" }, to: { category: "Home & Lifestyle", subCategory: "Tools, DIY & Outdoor" } },
  { from: { category: "Fashion", subCategory: "Sarees" }, to: { category: "Women's Fashion", subCategory: "Unstitched Fabric" } },
  { from: { category: "Fashion", subCategory: "Shoes" }, to: { category: "Men's Fashion", subCategory: "Shoes" } },
  { from: { category: "Fashion", subCategory: "Slippers" }, to: { category: "Men's Fashion", subCategory: "Boy's Shoes" } },
  { from: { category: "Fashion", subCategory: "Socks" }, to: { category: "Men's Fashion", subCategory: "Accessories" } },
  { from: { category: "Fashion", subCategory: "Sports Shoes" }, to: { category: "Sports & Outdoor", subCategory: "Shoes & Clothing" } },
  { from: { category: "Fashion", subCategory: "Travel Bags & Suitcases" }, to: { category: "Watches, Bags & Jewellery", subCategory: "Luggage & Suitcase" } },
  { from: { category: "Fashion", subCategory: "Women" }, to: { category: "Women's Fashion", subCategory: "Dresses & Skirts" } },
  { from: { category: "Fashion", subCategory: "Women's Dress" }, to: { category: "Women's Fashion", subCategory: "Dresses & Skirts" } },

  // ===== Furniture (old bucket) =====
  { from: { category: "Furniture", subCategory: null }, to: { category: "Home & Lifestyle", subCategory: "Furniture" } },
  { from: { category: "Furniture", subCategory: "Beds" }, to: { category: "Home & Lifestyle", subCategory: "Furniture" } },
  { from: { category: "Furniture", subCategory: "Dining Table" }, to: { category: "Home & Lifestyle", subCategory: "Furniture" } },
  { from: { category: "Furniture", subCategory: "Furniture" }, to: { category: "Home & Lifestyle", subCategory: "Furniture" } },
  { from: { category: "Furniture", subCategory: "Study Table" }, to: { category: "Home & Lifestyle", subCategory: "Furniture" } },
  { from: { category: "Furniture", subCategory: "Wardrobes" }, to: { category: "Home & Lifestyle", subCategory: "Furniture" } },

  // ===== Gaming (old bucket) =====
  { from: { category: "Gaming", subCategory: null }, to: { category: "Electronic Devices", subCategory: "Gaming Consoles" } },
  { from: { category: "Gaming", subCategory: "Consoles" }, to: { category: "Electronic Devices", subCategory: "Gaming Consoles" } },
  { from: { category: "Gaming", subCategory: "Controllers" }, to: { category: "Electronic Devices", subCategory: "Gaming Consoles" } },
  { from: { category: "Gaming", subCategory: "Gaming Accessories" }, to: { category: "Electronic Accessories", subCategory: "Gaming Accessories" } },
  { from: { category: "Gaming", subCategory: "Gaming Consoles & Accessories" }, to: { category: "Electronic Devices", subCategory: "Gaming Consoles" } },
  { from: { category: "Gaming", subCategory: "Musical Instruments" }, to: { category: "Home & Lifestyle", subCategory: "Media, Music & Books" } },
  { from: { category: "Gaming", subCategory: "Toys & Games" }, to: { category: "Mother & Baby", subCategory: "Toys & Games" } },

  // ===== Groceries (old bucket) =====
  { from: { category: "Groceries", subCategory: null }, to: { category: "Groceries & Pets", subCategory: "Food Staples" } },
  { from: { category: "Groceries", subCategory: "Beverages" }, to: { category: "Groceries & Pets", subCategory: "Beverages" } },
  { from: { category: "Groceries", subCategory: "Biscuits" }, to: { category: "Groceries & Pets", subCategory: "Breakfast, Choco & Snacks" } },
  { from: { category: "Groceries", subCategory: "Chips" }, to: { category: "Groceries & Pets", subCategory: "Breakfast, Choco & Snacks" } },
  { from: { category: "Groceries", subCategory: "Chocolate" }, to: { category: "Groceries & Pets", subCategory: "Breakfast, Choco & Snacks" } },
  { from: { category: "Groceries", subCategory: "Pantry" }, to: { category: "Groceries & Pets", subCategory: "Food Staples" } },
  { from: { category: "Groceries", subCategory: "Snacks" }, to: { category: "Groceries & Pets", subCategory: "Breakfast, Choco & Snacks" } },

  // ===== Health (old bucket) =====
  { from: { category: "Health", subCategory: null }, to: { category: "Sports & Outdoor", subCategory: "Exercise & Fitness" } },
  { from: { category: "Health", subCategory: "Blood Pressure Monitor" }, to: { category: "Health & Beauty", subCategory: "Medical Supplies" } },
  { from: { category: "Health", subCategory: "Protein Supplements" }, to: { category: "Sports & Outdoor", subCategory: "Supplements" } },
  { from: { category: "Health", subCategory: "Resistance Bands" }, to: { category: "Sports & Outdoor", subCategory: "Exercise & Fitness" } },
  { from: { category: "Health", subCategory: "Skipping Rope" }, to: { category: "Sports & Outdoor", subCategory: "Exercise & Fitness" } },
  { from: { category: "Health", subCategory: "Sports" }, to: { category: "Sports & Outdoor", subCategory: "Team Sports" } },
  { from: { category: "Health", subCategory: "Weighing Scale" }, to: { category: "Health & Beauty", subCategory: "Medical Supplies" } },

  // ===== Home & Kitchen (old bucket) =====
  { from: { category: "Home & Kitchen", subCategory: null }, to: { category: "TV & Home Appliances", subCategory: "Kitchen Appliances" } },
  { from: { category: "Home & Kitchen", subCategory: "Cooking Vessels" }, to: { category: "TV & Home Appliances", subCategory: "Kitchen Appliances" } },
  { from: { category: "Home & Kitchen", subCategory: "Cookware" }, to: { category: "TV & Home Appliances", subCategory: "Kitchen Appliances" } },
  { from: { category: "Home & Kitchen", subCategory: "Dinner Sets" }, to: { category: "TV & Home Appliances", subCategory: "Kitchen Appliances" } },
  { from: { category: "Home & Kitchen", subCategory: "Gas Stove & Induction" }, to: { category: "TV & Home Appliances", subCategory: "Kitchen Appliances" } },
  { from: { category: "Home & Kitchen", subCategory: "Iron Box" }, to: { category: "TV & Home Appliances", subCategory: "Irons & Garment Care" } },
  { from: { category: "Home & Kitchen", subCategory: "Mixer Grinder" }, to: { category: "TV & Home Appliances", subCategory: "Kitchen Appliances" } },
  { from: { category: "Home & Kitchen", subCategory: "Pressure Cooker" }, to: { category: "TV & Home Appliances", subCategory: "Kitchen Appliances" } },
  { from: { category: "Home & Kitchen", subCategory: "Storage" }, to: { category: "Home & Lifestyle", subCategory: "Tools, DIY & Outdoor" } },
  { from: { category: "Home & Kitchen", subCategory: "Storage Containers" }, to: { category: "TV & Home Appliances", subCategory: "Kitchen Appliances" } },
  { from: { category: "Home & Kitchen", subCategory: "Vessel Cleaner" }, to: { category: "Groceries & Pets", subCategory: "Laundry & Household" } },
  { from: { category: "Home & Kitchen", subCategory: "Water Bottle & Flask" }, to: { category: "TV & Home Appliances", subCategory: "Kitchen Appliances" } },
  { from: { category: "Home & Kitchen", subCategory: "Water Bottles" }, to: { category: "TV & Home Appliances", subCategory: "Kitchen Appliances" } },

  // ===== Home Essentials (old bucket) =====
  { from: { category: "Home Essentials", subCategory: "Bathroom Cleaning" }, to: { category: "Groceries & Pets", subCategory: "Laundry & Household" } },
  { from: { category: "Home Essentials", subCategory: "Bedsheets & Linen" }, to: { category: "Home & Lifestyle", subCategory: "Bedding" } },
  { from: { category: "Home Essentials", subCategory: "Cleaning Supplies" }, to: { category: "Groceries & Pets", subCategory: "Laundry & Household" } },
  { from: { category: "Home Essentials", subCategory: "Curtains & Blinds" }, to: { category: "Home & Lifestyle", subCategory: "Decor" } },
  { from: { category: "Home Essentials", subCategory: "Photo Frames" }, to: { category: "Home & Lifestyle", subCategory: "Decor" } },
  { from: { category: "Home Essentials", subCategory: "Study Table Lamp" }, to: { category: "Home & Lifestyle", subCategory: "Lighting" } },
  { from: { category: "Home Essentials", subCategory: "Wall Clocks" }, to: { category: "Home & Lifestyle", subCategory: "Decor" } },
  { from: { category: "Home Essentials", subCategory: "Washing Powder & Detergent" }, to: { category: "Groceries & Pets", subCategory: "Laundry & Household" } },

  // ===== Jeep =====
  { from: { category: "Jeep", subCategory: "Jeep Models & Accessories" }, to: { category: "Mother & Baby", subCategory: "Remote Control & Vehicles" } },

  // ===== Jewellery (old bucket) =====
  { from: { category: "Jewellery", subCategory: null }, to: { category: "Watches, Bags & Jewellery", subCategory: "Womens Jewellery" } },
  { from: { category: "Jewellery", subCategory: "Bangles" }, to: { category: "Watches, Bags & Jewellery", subCategory: "Womens Jewellery" } },
  { from: { category: "Jewellery", subCategory: "Earrings" }, to: { category: "Watches, Bags & Jewellery", subCategory: "Womens Jewellery" } },
  { from: { category: "Jewellery", subCategory: "Necklace" }, to: { category: "Watches, Bags & Jewellery", subCategory: "Womens Jewellery" } },
  { from: { category: "Jewellery", subCategory: "Rings" }, to: { category: "Watches, Bags & Jewellery", subCategory: "Womens Jewellery" } },

  // ===== Kids (old bucket) =====
  { from: { category: "Kids", subCategory: "Boys Clothing" }, to: { category: "Men's Fashion", subCategory: "Boy's Clothing" } },
  { from: { category: "Kids", subCategory: "Girls Clothing" }, to: { category: "Women's Fashion", subCategory: "Girls Clothing" } },
  { from: { category: "Kids", subCategory: "Kids Cars and Toys" }, to: { category: "Mother & Baby", subCategory: "Remote Control & Vehicles" } },
  { from: { category: "Kids", subCategory: "Kids Dress" }, to: { category: "Women's Fashion", subCategory: "Girls Clothing" } },
  { from: { category: "Kids", subCategory: "Kids School Bag" }, to: { category: "Mother & Baby", subCategory: "Baby Gear" } },
  { from: { category: "Kids", subCategory: "Kids Study Table" }, to: { category: "Home & Lifestyle", subCategory: "Furniture" } },
  { from: { category: "Kids", subCategory: "Kids Toys" }, to: { category: "Mother & Baby", subCategory: "Toys & Games" } },
  { from: { category: "Kids", subCategory: "Kids Water Bottle" }, to: { category: "Mother & Baby", subCategory: "Feeding" } },
  { from: { category: "Kids", subCategory: "Stationery" }, to: { category: "Home & Lifestyle", subCategory: "Stationery & Craft" } },

  // ===== Laptops (old bucket) =====
  { from: { category: "Laptops", subCategory: null }, to: { category: "Electronic Devices", subCategory: "Laptops" } },
  { from: { category: "Laptops", subCategory: "Laptop Accessories" }, to: { category: "Electronic Accessories", subCategory: "Computer Accessories" } },
  { from: { category: "Laptops", subCategory: "Laptop Bags" }, to: { category: "Watches, Bags & Jewellery", subCategory: "Luggage & Suitcase" } },
  { from: { category: "Laptops", subCategory: "Laptops" }, to: { category: "Electronic Devices", subCategory: "Laptops" } },

  // ===== Mobiles (old bucket) =====
  { from: { category: "Mobiles", subCategory: null }, to: { category: "Electronic Devices", subCategory: "Smart Phones" } },
  { from: { category: "Mobiles", subCategory: "Chargers & Cables" }, to: { category: "Electronic Accessories", subCategory: "Mobile Accessories" } },
  { from: { category: "Mobiles", subCategory: "Feature Phones" }, to: { category: "Electronic Devices", subCategory: "Feature Phones" } },
  { from: { category: "Mobiles", subCategory: "Phone Case" }, to: { category: "Electronic Accessories", subCategory: "Mobile Accessories" } },
  { from: { category: "Mobiles", subCategory: "Power Banks" }, to: { category: "Electronic Accessories", subCategory: "Mobile Accessories" } },
  { from: { category: "Mobiles", subCategory: "Smartphones" }, to: { category: "Electronic Devices", subCategory: "Smart Phones" } },

  // ===== Motorcycle (old bucket) =====
  { from: { category: "Motorcycle", subCategory: null }, to: { category: "Automotive & Motorbike", subCategory: "Motorcycle" } },
  { from: { category: "Motorcycle", subCategory: "Motorcycle Gear" }, to: { category: "Automotive & Motorbike", subCategory: "Motorcycle" } },

  // ===== Personal Care (old bucket, note: NOT the same as Health & Beauty > Personal Care) =====
  { from: { category: "Personal Care", subCategory: "Face Masks" }, to: { category: "Health & Beauty", subCategory: "Personal Care" } },
  { from: { category: "Personal Care", subCategory: "Hair Styling Tools" }, to: { category: "Health & Beauty", subCategory: "Beauty Tools" } },
  { from: { category: "Personal Care", subCategory: "Hand Sanitizer" }, to: { category: "Health & Beauty", subCategory: "Personal Care" } },
  { from: { category: "Personal Care", subCategory: "Nail Care Kit" }, to: { category: "Health & Beauty", subCategory: "Beauty Tools" } },
  { from: { category: "Personal Care", subCategory: "Shampoo" }, to: { category: "Health & Beauty", subCategory: "Hair Care" } },
  { from: { category: "Personal Care", subCategory: "Shaving Kit" }, to: { category: "Health & Beauty", subCategory: "Men's Care" } },
  { from: { category: "Personal Care", subCategory: "Soap" }, to: { category: "Health & Beauty", subCategory: "Bath & Body" } },
  { from: { category: "Personal Care", subCategory: "Supplements" }, to: { category: "Sports & Outdoor", subCategory: "Supplements" } },
  { from: { category: "Personal Care", subCategory: "Toothbrush" }, to: { category: "Health & Beauty", subCategory: "Personal Care" } },
  { from: { category: "Personal Care", subCategory: "Toothpaste" }, to: { category: "Health & Beauty", subCategory: "Personal Care" } },
];

const run = async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI not set in .env");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    let totalMigrated = 0;
    let totalRules = 0;

    for (const m of MIGRATIONS) {
      const filter: any = { category: m.from.category };
      if (m.from.subCategory === null) {
        filter.subCategory = { $exists: false };
      } else if (m.from.subCategory) {
        filter.subCategory = m.from.subCategory;
      }

      const result = await Product.updateMany(filter, {
        $set: { category: m.to.category, subCategory: m.to.subCategory },
      });

      totalRules++;
      if (result.modifiedCount > 0) {
        console.log(
          `✅ ${result.modifiedCount.toString().padStart(4)} products: "${m.from.category}${m.from.subCategory ? "/" + m.from.subCategory : ""}" → "${m.to.category}/${m.to.subCategory}"`
        );
      }
      totalMigrated += result.modifiedCount;
    }

    console.log(`\n✅ Done. ${totalRules} rules applied, ${totalMigrated} products migrated.`);

    // Sanity check: any old category names left?
    const OLD_CATEGORIES = [
      "Baby", "Beauty", "Beauty & Makeup", "Bike", "Electronics", "Fashion",
      "Furniture", "Gaming", "Groceries", "Health", "Home & Kitchen",
      "Home Essentials", "Jeep", "Jewellery", "Kids", "Laptops", "Mobiles",
      "Motorcycle", "Personal Care",
    ];
    const remaining = await Product.distinct("category", { category: { $in: OLD_CATEGORIES } });
    if (remaining.length > 0) {
      console.log(`\n⚠️ Old category names still present (add rules for these): ${remaining.join(", ")}`);
    } else {
      console.log("\n🎉 No old category names remain — taxonomy fully migrated!");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

run();