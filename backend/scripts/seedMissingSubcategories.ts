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

// Only the subcategories that are missing — exact category/subCategory
// strings match CATEGORY_SUBCATEGORIES in frontend/src/constants/categories.ts
// so the filter sidebar actually returns results for these once seeded.
const missingSubCategoryConfigs: SubCategoryConfig[] = [
  // ===== MOBILES =====
  {
    category: "Mobiles",
    subCategory: "Feature Phones",
    searchQuery: "feature phone keypad mobile",
    brands: ["Nokia", "Itel", "Lava", "Jio", "Samsung"],
    nameTemplates: [
      "{brand} Feature Phone Dual SIM",
      "{brand} Keypad Mobile Phone",
      "{brand} Basic Phone with Torch",
      "{brand} Feature Phone Long Battery",
    ],
    priceRange: [999, 3999],
    highlightsPool: ["Long battery life", "Durable build", "Best Price", "Easy to use"],
    featuresPool: [
      "Dual SIM Support",
      "Long-lasting Battery Backup",
      "Built-in Torch & FM Radio",
      "1-Year Manufacturer Warranty",
    ],
  },
  {
    category: "Mobiles",
    subCategory: "Phone Case",
    searchQuery: "mobile phone case cover",
    brands: ["Spigen", "Nillkin", "Ringke", "Amazon Basics", "Zapcase"],
    nameTemplates: [
      "{brand} Silicone Phone Case",
      "{brand} Transparent Back Cover",
      "{brand} Shockproof Phone Case",
      "{brand} Leather Flip Cover",
    ],
    priceRange: [99, 999],
    highlightsPool: ["Shockproof", "Slim fit", "Best Price", "Precise cutouts"],
    featuresPool: [
      "Military-grade Drop Protection",
      "Anti-yellowing Material",
      "Precise Camera & Port Cutouts",
      "Wireless Charging Compatible",
    ],
  },
  {
    category: "Mobiles",
    subCategory: "Chargers & Cables",
    searchQuery: "mobile charger cable adapter",
    brands: ["Mi", "boAt", "Samsung", "Portronics", "Ambrane"],
    nameTemplates: [
      "{brand} Fast Charger Adapter",
      "{brand} Type-C Charging Cable",
      "{brand} 20W PD Charger",
      "{brand} Multi-Pin USB Cable",
    ],
    priceRange: [199, 1299],
    highlightsPool: ["Fast charging", "Durable cable", "Best Price", "Universal compatibility"],
    featuresPool: [
      "Fast Charging up to 20W",
      "Tangle-free Braided Cable",
      "Compatible with Multiple Devices",
      "1-Year Warranty",
    ],
  },
  {
    category: "Mobiles",
    subCategory: "Power Banks",
    searchQuery: "power bank portable charger",
    brands: ["Mi", "boAt", "Ambrane", "Portronics", "Realme"],
    nameTemplates: [
      "{brand} 10000mAh Power Bank",
      "{brand} 20000mAh Fast Charging Power Bank",
      "{brand} Slim Power Bank",
      "{brand} Dual USB Power Bank",
    ],
    priceRange: [499, 2499],
    highlightsPool: ["High capacity", "Fast charging", "Best Price", "Compact design"],
    featuresPool: [
      "18W Fast Charging Support",
      "Dual USB Output Ports",
      "LED Battery Indicator",
      "1-Year Manufacturer Warranty",
    ],
  },

  // ===== LAPTOPS =====
  {
    category: "Laptops",
    subCategory: "Laptop Bags",
    searchQuery: "laptop bag backpack office",
    brands: ["American Tourister", "Skybags", "Wildcraft", "HP", "Dell"],
    nameTemplates: [
      "{brand} Laptop Backpack 15.6\"",
      "{brand} Office Laptop Bag",
      "{brand} Water Resistant Laptop Sleeve Bag",
      "{brand} Anti-theft Laptop Backpack",
    ],
    priceRange: [499, 2999],
    highlightsPool: ["Padded compartment", "Spacious storage", "Best Price", "Water resistant"],
    featuresPool: [
      "Padded Laptop Compartment up to 15.6 inch",
      "Water-resistant Fabric",
      "Multiple Organizer Pockets",
      "Comfortable Padded Straps",
    ],
  },
  {
    category: "Laptops",
    subCategory: "Laptop Accessories",
    searchQuery: "laptop accessories mouse stand",
    brands: ["Logitech", "HP", "Dell", "Portronics", "Zebronics"],
    nameTemplates: [
      "{brand} Wireless Mouse",
      "{brand} Laptop Cooling Stand",
      "{brand} USB Hub Adapter",
      "{brand} Laptop Sleeve Cover",
    ],
    priceRange: [299, 2499],
    highlightsPool: ["Ergonomic design", "Plug & play", "Best Price", "Portable"],
    featuresPool: [
      "Plug & Play — No Drivers Needed",
      "Ergonomic Comfortable Design",
      "Compatible with Windows & Mac",
      "1-Year Manufacturer Warranty",
    ],
  },

  // ===== FURNITURE =====
  {
    category: "Furniture",
    subCategory: "Beds",
    searchQuery: "wooden bed frame bedroom furniture",
    brands: ["Nilkamal", "Godrej Interio", "Urban Ladder", "Wakefit", "Durian"],
    nameTemplates: [
      "{brand} Wooden Bed Frame",
      "{brand} Queen Size Bed with Storage",
      "{brand} King Size Upholstered Bed",
      "{brand} Engineered Wood Bed",
    ],
    priceRange: [7999, 39999],
    highlightsPool: ["Sturdy build", "Storage included", "Best Price", "Modern design"],
    featuresPool: [
      "Solid Engineered Wood Frame",
      "Hydraulic Storage (Select Models)",
      "Easy Assembly",
      "1-Year Manufacturer Warranty",
    ],
  },
  {
    category: "Furniture",
    subCategory: "Study Table",
    searchQuery: "study table desk wooden",
    brands: ["Nilkamal", "Godrej Interio", "Urban Ladder", "Wakefit", "Featherlite"],
    nameTemplates: [
      "{brand} Wooden Study Table",
      "{brand} Study Desk with Drawer",
      "{brand} Compact Study Table",
      "{brand} Study Table with Bookshelf",
    ],
    priceRange: [1999, 12999],
    highlightsPool: ["Sturdy build", "Space saving", "Best Price", "Modern design"],
    featuresPool: [
      "Solid Engineered Wood",
      "Built-in Storage Drawer",
      "Scratch-resistant Finish",
      "Easy Assembly",
    ],
  },
  {
    category: "Furniture",
    subCategory: "Wardrobes",
    searchQuery: "wardrobe cupboard bedroom furniture",
    brands: ["Nilkamal", "Godrej Interio", "Urban Ladder", "Spacewood", "Durian"],
    nameTemplates: [
      "{brand} 3-Door Wardrobe",
      "{brand} Sliding Door Wardrobe",
      "{brand} 2-Door Wardrobe with Mirror",
      "{brand} Wooden Wardrobe with Drawers",
    ],
    priceRange: [8999, 44999],
    highlightsPool: ["Spacious storage", "Sturdy build", "Best Price", "Modern design"],
    featuresPool: [
      "Solid Engineered Wood Frame",
      "Multiple Shelves & Hanging Space",
      "Scratch-resistant Finish",
      "1-Year Manufacturer Warranty",
    ],
  },

  // ===== BEAUTY & MAKEUP =====
  {
    category: "Beauty & Makeup",
    subCategory: "Skincare",
    searchQuery: "skincare face cream cosmetics",
    brands: ["Nivea", "Ponds", "Lakme", "The Ordinary", "Mamaearth", "Minimalist"],
    nameTemplates: [
      "{brand} Face Moisturizer Cream",
      "{brand} Vitamin C Face Serum",
      "{brand} Sunscreen SPF 50",
      "{brand} Face Wash for All Skin Types",
    ],
    priceRange: [149, 1999],
    highlightsPool: ["Dermatologically tested", "Lightweight formula", "Best Price", "Suitable for all skin types"],
    featuresPool: [
      "Dermatologically Tested Formula",
      "Non-greasy Lightweight Texture",
      "Enriched with Active Ingredients",
      "Suitable for Daily Use",
    ],
  },

  // ===== PERSONAL CARE =====
  {
    category: "Personal Care",
    subCategory: "Supplements",
    searchQuery: "vitamin supplements health capsules",
    brands: ["HealthKart", "Himalaya", "Nature's Bounty", "Wellbeing Nutrition", "Carbamide Forte"],
    nameTemplates: [
      "{brand} Multivitamin Tablets",
      "{brand} Biotin Capsules",
      "{brand} Vitamin C Tablets",
      "{brand} Omega-3 Fish Oil Capsules",
    ],
    priceRange: [199, 1499],
    highlightsPool: ["Immunity support", "Daily nutrition", "Best Price", "Doctor recommended"],
    featuresPool: [
      "Supports Daily Nutritional Needs",
      "No Added Preservatives (Select Variants)",
      "Easy-to-swallow Tablets/Capsules",
      "Suitable for Daily Use",
    ],
  },

  // ===== GAMING =====
  {
    category: "Gaming",
    subCategory: "Consoles",
    searchQuery: "gaming console playstation xbox",
    brands: ["Sony", "Microsoft", "Nintendo"],
    nameTemplates: [
      "{brand} Gaming Console 1TB",
      "{brand} Gaming Console Digital Edition",
      "{brand} Handheld Gaming Console",
      "{brand} Gaming Console Bundle",
    ],
    priceRange: [19999, 54999],
    highlightsPool: ["High performance", "4K gaming", "Best Price", "Includes controller"],
    featuresPool: [
      "Ultra-fast SSD Storage",
      "4K Gaming Support",
      "Includes Wireless Controller",
      "1-Year Manufacturer Warranty",
    ],
  },
  {
    category: "Gaming",
    subCategory: "Controllers",
    searchQuery: "game controller gamepad",
    brands: ["Sony", "Microsoft", "Logitech", "Redgear", "Sony DualSense"],
    nameTemplates: [
      "{brand} Wireless Game Controller",
      "{brand} Pro Gaming Controller",
      "{brand} Wired Gamepad",
      "{brand} Controller with Vibration Feedback",
    ],
    priceRange: [999, 5999],
    highlightsPool: ["Ergonomic grip", "Responsive buttons", "Best Price", "Wireless connectivity"],
    featuresPool: [
      "Wireless Bluetooth Connectivity",
      "Ergonomic Non-slip Grip",
      "Vibration Feedback",
      "Compatible with PC & Console",
    ],
  },
  {
    category: "Gaming",
    subCategory: "Gaming Accessories",
    searchQuery: "gaming headset keyboard accessories",
    brands: ["Redgear", "Logitech", "Cosmic Byte", "boAt", "Zebronics"],
    nameTemplates: [
      "{brand} Gaming Headset",
      "{brand} Mechanical Gaming Keyboard",
      "{brand} RGB Gaming Mouse",
      "{brand} Gaming Mouse Pad",
    ],
    priceRange: [399, 4999],
    highlightsPool: ["RGB lighting", "Precision response", "Best Price", "Comfortable for long sessions"],
    featuresPool: [
      "RGB Backlit Design",
      "High-precision Sensors",
      "Ergonomic Build for Long Sessions",
      "Plug & Play Compatibility",
    ],
  },

  // ===== GROCERIES =====
  {
    category: "Groceries",
    subCategory: "Pantry",
    searchQuery: "pantry staples grocery rice flour",
    brands: ["Tata Sampann", "Fortune", "Aashirvaad", "India Gate", "Patanjali"],
    nameTemplates: [
      "{brand} Basmati Rice 5kg",
      "{brand} Wheat Flour Atta",
      "{brand} Cooking Oil 1L",
      "{brand} Toor Dal Pack",
    ],
    priceRange: [59, 899],
    highlightsPool: ["Premium quality", "Everyday essentials", "Best Price", "Family pack"],
    featuresPool: [
      "100% Natural & Unpolished (Select Items)",
      "Rich in Nutrients",
      "Sourced from Trusted Farms",
      "Resealable Packaging",
    ],
  },
  {
    category: "Groceries",
    subCategory: "Snacks",
    searchQuery: "packaged snacks namkeen",
    brands: ["Haldiram's", "Bikaji", "Lays", "Kurkure", "Balaji"],
    nameTemplates: [
      "{brand} Namkeen Mixture Pack",
      "{brand} Roasted Snacks Pack",
      "{brand} Spicy Namkeen",
      "{brand} Party Snacks Combo",
    ],
    priceRange: [30, 349],
    highlightsPool: ["Crispy & tasty", "Bold flavors", "Best Price", "Family pack"],
    featuresPool: [
      "Made with Quality Ingredients",
      "No Artificial Colors",
      "Resealable Pack for Freshness",
      "Perfect Tea-time Snack",
    ],
  },
  {
    category: "Groceries",
    subCategory: "Beverages",
    searchQuery: "beverages juice soft drink bottle",
    brands: ["Tropicana", "Real", "Coca-Cola", "Pepsi", "Bisleri"],
    nameTemplates: [
      "{brand} Fruit Juice 1L",
      "{brand} Soft Drink Bottle",
      "{brand} Packaged Drinking Water",
      "{brand} Energy Drink Can",
    ],
    priceRange: [20, 299],
    highlightsPool: ["Refreshing taste", "Chilled & ready", "Best Price", "Family pack"],
    featuresPool: [
      "Made with Real Fruit Extracts (Select Items)",
      "No Added Preservatives (Select Items)",
      "Convenient Packaging",
      "Great for Daily Refreshment",
    ],
  },

  // ===== HOME & KITCHEN =====
  {
    category: "Home & Kitchen",
    subCategory: "Cookware",
    searchQuery: "cookware pan pot kitchen set",
    brands: ["Prestige", "Hawkins", "Pigeon", "Wonderchef", "Meyer"],
    nameTemplates: [
      "{brand} Non-Stick Cookware Set",
      "{brand} Cast Iron Skillet",
      "{brand} Stainless Steel Cookware Set",
      "{brand} Ceramic Coated Cookware",
    ],
    priceRange: [499, 5999],
    highlightsPool: ["Even heat distribution", "Durable build", "Best Price", "Easy to clean"],
    featuresPool: [
      "PFOA-free Non-stick Coating",
      "Induction & Gas Compatible",
      "Ergonomic Heat-resistant Handles",
      "2-Year Warranty",
    ],
  },
  {
    category: "Home & Kitchen",
    subCategory: "Storage",
    searchQuery: "kitchen storage organizer boxes",
    brands: ["Tupperware", "Cello", "Milton", "Signoraware", "Joyo"],
    nameTemplates: [
      "{brand} Kitchen Storage Set",
      "{brand} Modular Storage Boxes",
      "{brand} Fridge Organizer Set",
      "{brand} Airtight Storage Jars",
    ],
    priceRange: [199, 2299],
    highlightsPool: ["Airtight lids", "Space saving", "Best Price", "BPA-free"],
    featuresPool: [
      "Keeps Food Fresh Longer",
      "Stackable Space-saving Design",
      "Transparent Body for Easy Viewing",
      "Leak-proof Seal",
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
      // Skip if this exact category/subCategory already has products —
      // makes the script safe to re-run without creating duplicates.
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