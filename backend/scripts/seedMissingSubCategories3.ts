import dotenv from "dotenv";
dotenv.config();
import Product from "../models/Product";
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

const missingSubCategoryConfigs: SubCategoryConfig[] = [
  {
    category: "Electronics",
    subCategory: "TV",
    searchQuery: "television smart tv living room",
    brands: ["Samsung", "LG", "Sony", "Mi", "TCL", "OnePlus"],
    nameTemplates: [
      "{brand} 43-inch Smart LED TV",
      "{brand} 55-inch 4K Ultra HD TV",
      "{brand} Android Smart TV",
      "{brand} Full HD LED TV",
    ],
    priceRange: [11999, 79999],
    highlightsPool: ["4K resolution", "Smart TV features", "Best Price", "Slim design"],
    featuresPool: [
      "4K Ultra HD Display",
      "Built-in Android/Smart OS",
      "Multiple HDMI & USB Ports",
      "1-Year Manufacturer Warranty",
    ],
  },
  {
    category: "Electronics",
    subCategory: "Oven",
    searchQuery: "microwave oven kitchen appliance",
    brands: ["LG", "Samsung", "IFB", "Bajaj", "Whirlpool"],
    nameTemplates: [
      "{brand} Microwave Oven 20L",
      "{brand} Convection Microwave Oven",
      "{brand} Oven Toaster Griller (OTG)",
      "{brand} Solo Microwave Oven",
    ],
    priceRange: [2999, 15999],
    highlightsPool: ["Even cooking", "Multiple cooking modes", "Best Price", "Compact design"],
    featuresPool: [
      "Convection & Grill Modes",
      "Auto Cook Menus",
      "Child Safety Lock",
      "1-Year Manufacturer Warranty",
    ],
  },
  {
    category: "Electronics",
    subCategory: "Ceiling Fan",
    searchQuery: "ceiling fan home",
    brands: ["Havells", "Crompton", "Orient", "Bajaj", "Usha"],
    nameTemplates: [
      "{brand} Ceiling Fan 1200mm",
      "{brand} Decorative Ceiling Fan",
      "{brand} High Speed Ceiling Fan",
      "{brand} Energy Saving Ceiling Fan",
    ],
    priceRange: [1199, 4999],
    highlightsPool: ["High air delivery", "Energy efficient", "Best Price", "Elegant finish"],
    featuresPool: [
      "High-speed Copper Motor",
      "Rust-resistant Blades",
      "Energy Saving BLDC Technology (Select Models)",
      "2-Year Warranty",
    ],
  },
  {
    category: "Furniture",
    subCategory: "Sofa",
    searchQuery: "sofa living room couch",
    brands: ["Nilkamal", "Godrej Interio", "Urban Ladder", "Pepperfry", "Wakefit"],
    nameTemplates: [
      "{brand} 3-Seater Fabric Sofa",
      "{brand} L-Shape Sectional Sofa",
      "{brand} 2-Seater Sofa",
      "{brand} Recliner Sofa",
    ],
    priceRange: [8999, 44999],
    highlightsPool: ["Comfortable cushioning", "Sturdy frame", "Best Price", "Modern design"],
    featuresPool: [
      "Solid Wood Frame",
      "High-density Foam Cushions",
      "Premium Fabric/Leatherette Upholstery",
      "1-Year Manufacturer Warranty",
    ],
  },
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchPhotos = async (query: string, retries = 2): Promise<{ url: string; alt: string }[]> => {
  try {
    const response = await axios.get(`${UNSPLASH_BASE_URL}/search/photos`, {
      params: { query, per_page: 30, page: 1 },
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
    });
    const results = response.data.results;
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
    const isRateLimited =
      err.response?.status === 403 ||
      /rate limit/i.test(err.response?.data?.errors?.[0] || "");
    if (isRateLimited && retries > 0) {
      const waitMs = 5000 * (3 - retries);
      console.log(`  ⏳ Rate limited, waiting ${waitMs / 1000}s before retry...`);
      await sleep(waitMs);
      return fetchPhotos(query, retries - 1);
    }
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

const seedMissing = async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI not set in .env");
    if (!process.env.UNSPLASH_ACCESS_KEY) throw new Error("UNSPLASH_ACCESS_KEY not set in .env");

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    const seller = await User.findOne({ role: { $in: ["admin", "seller"] } });
    if (!seller) throw new Error("No admin/seller user found.");
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
        console.error(`  ⚠️ Failed to fetch photos:`, err.response?.data || err.message);
      }

      if (index < missingSubCategoryConfigs.length - 1) await sleep(2000);

      if (photos.length === 0) {
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
        const template = pickRandom(config.nameTemplates);
        const name = `${template.replace("{brand}", brand)} ${i + 1}`;
        const price = randomBetween(config.priceRange[0], config.priceRange[1]);
        const hasDiscount = Math.random() > 0.4;
        const discountPrice = hasDiscount ? Math.round(price * (0.7 + Math.random() * 0.2)) : undefined;
        const photo = photos[i % photos.length];
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
          images: [{ url: photo.url, public_id: "", alt: photo.alt || name, isPrimary: true }],
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

    console.log(`\n🎉 Done! ${totalCreated} products created.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedMissing();