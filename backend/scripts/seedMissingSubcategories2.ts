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

const missingSubCategoryConfigs: SubCategoryConfig[] = [
  // ===== FASHION — MEN'S / WOMEN'S / KIDS SPLIT =====
  {
    category: "Fashion",
    subCategory: "Men's Dress",
    searchQuery: "men shirt clothing fashion",
    brands: ["Van Heusen", "Peter England", "Allen Solly", "Levi's", "Louis Philippe"],
    nameTemplates: [
      "{brand} Formal Shirt",
      "{brand} Casual T-Shirt",
      "{brand} Slim Fit Trousers",
      "{brand} Cotton Kurta",
    ],
    priceRange: [399, 2999],
    highlightsPool: ["Comfortable fit", "Premium fabric", "Best Price", "Everyday wear"],
    featuresPool: [
      "Breathable Cotton Blend",
      "Machine Washable",
      "Regular & Slim Fit Options",
      "Available in Multiple Sizes",
    ],
  },
  {
    category: "Fashion",
    subCategory: "Women's Dress",
    searchQuery: "women dress clothing fashion",
    brands: ["Biba", "W", "Global Desi", "Vero Moda", "AND"],
    nameTemplates: [
      "{brand} A-Line Dress",
      "{brand} Floral Print Dress",
      "{brand} Maxi Dress",
      "{brand} Casual Wrap Dress",
    ],
    priceRange: [499, 3499],
    highlightsPool: ["Elegant design", "Comfortable fit", "Best Price", "Vibrant colors"],
    featuresPool: [
      "Breathable Soft Fabric",
      "Machine Washable",
      "Regular Fit",
      "Available in Multiple Sizes",
    ],
  },
  {
    category: "Fashion",
    subCategory: "Burkha",
    searchQuery: "modest wear abaya burkha fashion",
    brands: ["Nida", "Aabaya", "Islamic Fashion", "Modest Trend"],
    nameTemplates: [
      "{brand} Nida Fabric Burkha",
      "{brand} Georgette Burkha",
      "{brand} Printed Burkha",
      "{brand} Plain Burkha with Scarf",
    ],
    priceRange: [499, 2999],
    highlightsPool: ["Soft fabric", "Elegant design", "Best Price", "Comfortable fit"],
    featuresPool: [
      "Premium Nida/Georgette Fabric",
      "Breathable & Lightweight",
      "Includes Matching Scarf (Select Styles)",
      "Available in Multiple Sizes",
    ],
  },
  {
    category: "Fashion",
    subCategory: "Abhaya",
    searchQuery: "abaya modest wear fashion",
    brands: ["Nida", "Aabaya", "Islamic Fashion", "Modest Trend"],
    nameTemplates: [
      "{brand} Classic Abhaya",
      "{brand} Embroidered Abhaya",
      "{brand} Open Front Abhaya",
      "{brand} Butterfly Abhaya",
    ],
    priceRange: [599, 3999],
    highlightsPool: ["Elegant embroidery", "Flowy fabric", "Best Price", "Premium finish"],
    featuresPool: [
      "Premium Nida Fabric",
      "Breathable & Lightweight",
      "Elegant Embroidery Detailing (Select Styles)",
      "Available in Multiple Sizes",
    ],
  },

  // ===== KIDS — BOYS / GIRLS CLOTHING =====
  {
    category: "Kids",
    subCategory: "Boys Clothing",
    searchQuery: "boys kids clothing shirt",
    brands: ["H&M Kids", "Gini and Jony", "Allen Solly Junior", "US Polo Kids"],
    nameTemplates: [
      "{brand} Boys T-Shirt",
      "{brand} Boys Casual Shirt",
      "{brand} Boys Shorts Set",
      "{brand} Boys Track Pants",
    ],
    priceRange: [199, 1499],
    highlightsPool: ["Soft cotton", "Comfortable fit", "Best Price", "Fun prints"],
    featuresPool: [
      "100% Cotton Fabric",
      "Skin-friendly & Breathable",
      "Machine Washable",
      "Available in Multiple Sizes",
    ],
  },
  {
    category: "Kids",
    subCategory: "Girls Clothing",
    searchQuery: "girls kids clothing dress",
    brands: ["H&M Kids", "Gini and Jony", "Biba Girls", "US Polo Kids"],
    nameTemplates: [
      "{brand} Girls Frock Dress",
      "{brand} Girls Casual Top",
      "{brand} Girls Party Dress",
      "{brand} Girls Ethnic Set",
    ],
    priceRange: [249, 1799],
    highlightsPool: ["Soft cotton", "Cute prints", "Best Price", "Comfortable fit"],
    featuresPool: [
      "100% Cotton Fabric",
      "Skin-friendly & Breathable",
      "Machine Washable",
      "Available in Multiple Sizes",
    ],
  },

  // ===== HOME ESSENTIALS — CLEANING =====
  {
    category: "Home Essentials",
    subCategory: "Bathroom Cleaning",
    searchQuery: "bathroom cleaner toilet cleaning",
    brands: ["Harpic", "Lizol", "Domex", "Scotch-Brite", "Colin"],
    nameTemplates: [
      "{brand} Toilet Cleaner",
      "{brand} Bathroom Floor Cleaner",
      "{brand} Tile & Glass Cleaner",
      "{brand} Bathroom Cleaning Brush Set",
    ],
    priceRange: [49, 499],
    highlightsPool: ["Powerful germ kill", "Fresh fragrance", "Best Price", "Removes tough stains"],
    featuresPool: [
      "Kills 99.9% Germs",
      "Removes Tough Stains & Limescale",
      "Long-lasting Fragrance",
      "Safe on Tiles & Fittings",
    ],
  },
  {
    category: "Home Essentials",
    subCategory: "Washing Powder & Detergent",
    searchQuery: "washing powder detergent laundry",
    brands: ["Surf Excel", "Ariel", "Tide", "Rin", "Wheel"],
    nameTemplates: [
      "{brand} Washing Powder 1kg",
      "{brand} Liquid Detergent",
      "{brand} Detergent Bar Pack",
      "{brand} Front Load Washing Powder",
    ],
    priceRange: [49, 599],
    highlightsPool: ["Removes tough stains", "Long-lasting freshness", "Best Price", "Family pack"],
    featuresPool: [
      "Removes Tough Stains Easily",
      "Suitable for Top & Front Load Machines",
      "Long-lasting Fragrance",
      "Gentle on Fabric",
    ],
  },

  // ===== HOME & KITCHEN — VESSEL CLEANING =====
  {
    category: "Home & Kitchen",
    subCategory: "Vessel Cleaner",
    searchQuery: "dishwash vessel cleaner kitchen",
    brands: ["Vim", "Pril", "Exo", "Colin", "Presto"],
    nameTemplates: [
      "{brand} Dishwash Liquid Gel",
      "{brand} Dishwash Bar Pack",
      "{brand} Vessel Scrub Pad Set",
      "{brand} Dishwasher Gel Refill Pack",
    ],
    priceRange: [29, 399],
    highlightsPool: ["Cuts grease easily", "Gentle on hands", "Best Price", "Long-lasting"],
    featuresPool: [
      "Cuts Through Tough Grease",
      "Mild on Hands with Regular Use",
      "Lemon/Fresh Fragrance",
      "Value Pack Available",
    ],
  },
];

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