
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
    category: "Fashion",
    subCategory: "Slippers",
    searchQuery: "slippers footwear",
    brands: ["Bata", "Relaxo", "Paragon", "Sparx", "Puma"],
    nameTemplates: ["{brand} Casual Slippers", "{brand} Flip Flops", "{brand} Bathroom Slippers", "{brand} Comfort Sandals"],
    priceRange: [149, 999],
  },
  {
    category: "Fashion",
    subCategory: "Shoes",
    searchQuery: "shoes sneakers footwear",
    brands: ["Nike", "Adidas", "Puma", "Bata", "Woodland", "Sparx"],
    nameTemplates: ["{brand} Running Shoes", "{brand} Casual Sneakers", "{brand} Formal Shoes", "{brand} Sports Shoes"],
    priceRange: [699, 4999],
  },
  {
    category: "Fashion",
    subCategory: "Socks",
    searchQuery: "socks fashion",
    brands: ["Puma", "Bonjour", "Nike", "Levis", "Jockey"],
    nameTemplates: ["{brand} Ankle Socks Pack", "{brand} Sports Socks", "{brand} Cotton Crew Socks", "{brand} Formal Socks Set"],
    priceRange: [99, 599],
  },
  {
    category: "Electronics",
    subCategory: "Speaker",
    searchQuery: "bluetooth speaker audio",
    brands: ["JBL", "Sony", "Boat", "Zebronics", "Marshall"],
    nameTemplates: ["{brand} Bluetooth Speaker", "{brand} Portable Speaker", "{brand} Party Speaker", "{brand} Home Theatre Speaker"],
    priceRange: [799, 9999],
  },
  {
    category: "Fashion",
    subCategory: "Bra",
    searchQuery: "women innerwear fashion",
    brands: ["Jockey", "Enamor", "Triumph", "Clovia", "Amante"],
    nameTemplates: ["{brand} Everyday Bra", "{brand} T-Shirt Bra", "{brand} Sports Bra", "{brand} Padded Bra"],
    priceRange: [299, 1499],
  },
  {
    category: "Fashion",
    subCategory: "Burkha",
    searchQuery: "abaya modest fashion",
    brands: ["Aab", "Nida", "Modanisa", "Inaaya"],
    nameTemplates: ["{brand} Plain Burkha", "{brand} Embroidered Burkha", "{brand} Georgette Burkha", "{brand} Chiffon Burkha Set"],
    priceRange: [899, 3999],
  },
  {
    category: "Fashion",
    subCategory: "Abhaya",
    searchQuery: "abaya elegant dress",
    brands: ["Aab", "Nida", "Modanisa", "Inaaya"],
    nameTemplates: ["{brand} Classic Abhaya", "{brand} Embellished Abhaya", "{brand} Front Open Abhaya", "{brand} Kaftan Abhaya"],
    priceRange: [999, 4999],
  },
  {
    category: "Electronics",
    subCategory: "TV Remote",
    searchQuery: "tv remote control",
    brands: ["Samsung", "LG", "Sony", "Universal", "MI"],
    nameTemplates: ["{brand} TV Remote Control", "{brand} Universal Remote", "{brand} Smart TV Remote", "{brand} Replacement Remote"],
    priceRange: [149, 999],
  },
  {
    category: "Electronics",
    subCategory: "Fan Remote",
    searchQuery: "remote control device",
    brands: ["Havells", "Orient", "Crompton", "Bajaj", "Usha"],
    nameTemplates: ["{brand} Ceiling Fan Remote", "{brand} Regulator Remote", "{brand} Fan Remote Kit", "{brand} Wireless Fan Remote"],
    priceRange: [199, 799],
  },
  {
    category: "Electronics",
    subCategory: "Air Cooler",
    searchQuery: "air cooler appliance",
    brands: ["Symphony", "Bajaj", "Crompton", "Voltas", "Orient"],
    nameTemplates: ["{brand} Personal Air Cooler", "{brand} Desert Air Cooler", "{brand} Tower Air Cooler", "{brand} Room Air Cooler"],
    priceRange: [3999, 15999],
  },
  {
    category: "Electronics",
    subCategory: "AC",
    searchQuery: "air conditioner appliance",
    brands: ["LG", "Samsung", "Voltas", "Daikin", "Blue Star", "Carrier"],
    nameTemplates: ["{brand} Split AC 1.5 Ton", "{brand} Window AC", "{brand} Inverter AC", "{brand} 5 Star AC"],
    priceRange: [24999, 59999],
  },
  {
    category: "Electronics",
    subCategory: "Table Fan",
    searchQuery: "table fan appliance",
    brands: ["Havells", "Orient", "Crompton", "Bajaj", "Usha"],
    nameTemplates: ["{brand} Table Fan", "{brand} High Speed Table Fan", "{brand} Oscillating Table Fan", "{brand} Mini Desk Fan"],
    priceRange: [799, 2999],
  },
  {
    category: "Electronics",
    subCategory: "Hand Fan",
    searchQuery: "handheld fan portable",
    brands: ["Havells", "Portronics", "Syska", "Generic"],
    nameTemplates: ["{brand} Rechargeable Hand Fan", "{brand} Mini Portable Fan", "{brand} USB Hand Fan", "{brand} Foldable Hand Fan"],
    priceRange: [199, 999],
  },
  {
    category: "Kids",
    subCategory: "Kids Cars and Toys",
    searchQuery: "kids toy car",
    brands: ["Hot Wheels", "Fisher-Price", "LEGO", "Funskool", "Chicco"],
    nameTemplates: ["{brand} Ride-On Car", "{brand} Remote Control Car", "{brand} Push Car for Toddlers", "{brand} Battery Operated Car"],
    priceRange: [499, 5999],
  },
  {
    category: "Kids",
    subCategory: "Kids Study Table",
    searchQuery: "kids study table desk",
    brands: ["Nilkamal", "Godrej Interio", "Delta", "Home Story"],
    nameTemplates: ["{brand} Kids Study Table", "{brand} Homework Desk with Chair", "{brand} Foldable Study Table", "{brand} Kids Desk Set"],
    priceRange: [1499, 6999],
  },
  {
    category: "Electronics",
    subCategory: "Phone Case",
    searchQuery: "phone case cover mobile",
    brands: ["Spigen", "Nillkin", "MI", "Samsung", "Generic"],
    nameTemplates: ["{brand} Silicone Phone Case", "{brand} Transparent Back Cover", "{brand} Shockproof Case", "{brand} Leather Phone Case"],
    priceRange: [149, 999],
  },
  {
    category: "Baby",
    subCategory: "Baby All Items",
    searchQuery: "baby products essentials",
    brands: ["Pampers", "Johnson's", "Mee Mee", "Chicco", "LuvLap"],
    nameTemplates: ["{brand} Baby Care Combo", "{brand} Baby Grooming Kit", "{brand} Baby Bath Set", "{brand} Baby Essentials Pack"],
    priceRange: [299, 2999],
  },
  {
    category: "Baby",
    subCategory: "Baby Lotion",
    searchQuery: "himalaya baby lotion",
    brands: ["Himalaya", "Johnson's", "Sebamed", "Mamaearth"],
    nameTemplates: ["{brand} Baby Lotion", "{brand} Baby Massage Oil", "{brand} Baby Moisturizing Lotion", "{brand} Baby Body Lotion"],
    priceRange: [99, 499],
  },
  {
    category: "Home & Kitchen",
    subCategory: "Water Bottles",
    searchQuery: "water bottle drinkware",
    brands: ["Milton", "Cello", "Borosil", "Tupperware", "Steelo"],
    nameTemplates: ["{brand} Steel Water Bottle", "{brand} Insulated Water Bottle", "{brand} Sports Water Bottle", "{brand} Glass Water Bottle"],
    priceRange: [149, 1499],
  },
  {
    category: "Gaming",
    subCategory: "Musical Instruments",
    searchQuery: "musical instrument",
    brands: ["Yamaha", "Casio", "Kadence", "Juarez", "Cosmos"],
    nameTemplates: ["{brand} Acoustic Guitar", "{brand} Digital Keyboard", "{brand} Ukulele", "{brand} Drum Practice Pad"],
    priceRange: [1499, 14999],
  },
  {
    category: "Kids",
    subCategory: "Stationery",
    searchQuery: "stationery school supplies",
    brands: ["Doms", "Camlin", "Nataraj", "Faber-Castell", "Classmate"],
    nameTemplates: ["{brand} Sketch Pens Set", "{brand} Pencil Pack", "{brand} Eraser Pack", "{brand} Sharpener Set", "{brand} Stationery Combo Kit"],
    priceRange: [29, 499],
  },
  {
    category: "Fashion",
    subCategory: "Hand Gloves",
    searchQuery: "hand gloves accessory",
    brands: ["Generic", "Vissco", "3M", "Honeywell"],
    nameTemplates: ["{brand} Winter Hand Gloves", "{brand} Riding Gloves", "{brand} Cotton Gloves Pack", "{brand} Rubber Hand Gloves"],
    priceRange: [99, 799],
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
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI not set in .env");
    if (!process.env.UNSPLASH_ACCESS_KEY) throw new Error("UNSPLASH_ACCESS_KEY not set in .env");

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    const seller = await User.findOne({ role: { $in: ["admin", "seller"] } });
    if (!seller) {
      throw new Error(
        "No admin/seller user found. Register a user and set role to 'admin' or 'seller' first."
      );
    }
    console.log(`Using seller: ${seller.name} (${seller._id})`);
    console.log(`Total items to process: ${itemConfigs.length} (${itemConfigs.length} Unsplash calls)`);

    let totalCreated = 0;

    for (const config of itemConfigs) {
      console.log(`\nFetching images for "${config.subCategory}"...`);

      let photos: { url: string; alt: string }[] = [];
      try {
        photos = await fetchItemPhotos(config.searchQuery);
      } catch (err: any) {
        console.error(
          `  ⚠️ Failed to fetch photos for ${config.subCategory}:`,
          err.response?.data?.errors?.[0] || err.message
        );
      }

      if (photos.length === 0) {
        photos = [
          {
            url: `https://dummyimage.com/500x500/e5e7eb/9ca3af.png&text=${encodeURIComponent(config.subCategory)}`,
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
          description: `${name} — quality ${config.subCategory.toLowerCase()} for everyday use. Trusted brand, reliable, great value.`,
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
            config.category.toLowerCase().replace(/\s+/g, "-"),
            config.subCategory.toLowerCase().replace(/\s+/g, "-"),
            brand.toLowerCase(),
          ],
        });
      }

      await Product.insertMany(productsForItem);
      totalCreated += productsForItem.length;
      console.log(`  ✅ Created ${productsForItem.length} products for ${config.subCategory}`);
    }

    console.log(`\n🎉 Done! ${totalCreated} products created across ${itemConfigs.length} new item types.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seed();