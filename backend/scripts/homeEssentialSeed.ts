import dotenv from "dotenv";
dotenv.config();
import Product from "../models/Product";   // unga actual path-ku maathunga
import cloudinary from "../config/cloudinary"; // unga actual path-ku maathunga

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
  highlightsPool: string[]; // random short bullet points picked per product
  featuresPool: string[]; // random "Key Features" picked per product
}

const subCategoryConfigs: SubCategoryConfig[] = [
  // ===== MAKEUP =====
  {
    category: "Beauty & Makeup",
    subCategory: "Lipstick",
    searchQuery: "lipstick makeup cosmetics",
    brands: ["Lakme", "Maybelline", "Nykaa", "MAC", "LOreal", "Sugar"],
    nameTemplates: [
      "{brand} Matte Lipstick",
      "{brand} Liquid Lipstick",
      "{brand} Velvet Lip Color",
      "{brand} Long Stay Lipstick",
    ],
    priceRange: [199, 1499],
    highlightsPool: ["Long lasting", "Waterproof formula", "Rich pigment", "Best Price", "Smooth finish"],
    featuresPool: [
      "Transfer-proof & Waterproof",
      "Non-drying Matte Formula",
      "Cruelty-free",
      "Perfect for Daily Wear & Occasions",
      "Enriched with Vitamin E",
    ],
  },
  {
    category: "Beauty & Makeup",
    subCategory: "Foundation",
    searchQuery: "foundation makeup base",
    brands: ["Lakme", "Maybelline", "MAC", "LOreal", "Revlon"],
    nameTemplates: [
      "{brand} Liquid Foundation",
      "{brand} Matte Foundation",
      "{brand} Full Coverage Foundation",
      "{brand} Dewy Finish Foundation",
    ],
    priceRange: [399, 2499],
    highlightsPool: ["Full coverage", "Lightweight feel", "Best Price", "All skin types"],
    featuresPool: [
      "24-hour Wear",
      "Oil Control Formula",
      "Buildable Coverage",
      "Suitable for All Skin Tones",
    ],
  },
  {
    category: "Beauty & Makeup",
    subCategory: "Makeup Brush",
    searchQuery: "makeup brush set cosmetics",
    brands: ["Sigma", "Real Techniques", "Nykaa", "Faces Canada", "MAC"],
    nameTemplates: [
      "{brand} Makeup Brush Set",
      "{brand} Foundation Brush",
      "{brand} Blending Brush Kit",
      "{brand} Professional Brush Set",
    ],
    priceRange: [249, 2999],
    highlightsPool: ["Soft bristles", "Easy to clean", "Best Price", "Complete kit"],
    featuresPool: [
      "Synthetic Cruelty-free Bristles",
      "Ergonomic Handle Grip",
      "Includes Storage Pouch",
      "Streak-free Application",
    ],
  },

  // ===== PERSONAL CARE =====
  {
    category: "Personal Care",
    subCategory: "Toothpaste",
    searchQuery: "toothpaste oral care",
    brands: ["Colgate", "Sensodyne", "Pepsodent", "Close Up", "Patanjali"],
    nameTemplates: [
      "{brand} Toothpaste 200g",
      "{brand} Whitening Toothpaste",
      "{brand} Herbal Toothpaste",
      "{brand} Sensitive Care Toothpaste",
    ],
    priceRange: [49, 249],
    highlightsPool: ["Cavity protection", "Fresh breath", "Best Price", "Family pack"],
    featuresPool: [
      "Fluoride Enriched Formula",
      "Removes Plaque Build-up",
      "Gentle on Gums",
      "Long-lasting Freshness",
    ],
  },
  {
    category: "Personal Care",
    subCategory: "Soap",
    searchQuery: "bathing soap bar",
    brands: ["Dove", "Lux", "Pears", "Lifebuoy", "Santoor", "Medimix"],
    nameTemplates: [
      "{brand} Bathing Soap Bar",
      "{brand} Moisturizing Soap",
      "{brand} Herbal Soap",
      "{brand} Glycerin Soap",
    ],
    priceRange: [29, 199],
    highlightsPool: ["Moisturizing formula", "Gentle on skin", "Best Price", "Pleasant fragrance"],
    featuresPool: [
      "Enriched with Natural Oils",
      "Removes Germs Effectively",
      "Suitable for Daily Use",
      "Dermatologically Tested",
    ],
  },
  {
    category: "Personal Care",
    subCategory: "Shampoo",
    searchQuery: "shampoo haircare bottle",
    brands: ["Head & Shoulders", "Dove", "Sunsilk", "Clinic Plus", "Tresemme", "Pantene"],
    nameTemplates: [
      "{brand} Anti-Dandruff Shampoo",
      "{brand} Smooth & Silky Shampoo",
      "{brand} Herbal Shampoo",
      "{brand} Keratin Shampoo",
    ],
    priceRange: [99, 899],
    highlightsPool: ["Anti-dandruff", "Smooth & shiny hair", "Best Price", "Sulphate-free"],
    featuresPool: [
      "Nourishes Hair from Root to Tip",
      "Controls Frizz & Dryness",
      "Suitable for Color-treated Hair",
      "Dermatologically Tested Formula",
    ],
  },
  {
    category: "Personal Care",
    subCategory: "Toothbrush",
    searchQuery: "toothbrush oral care",
    brands: ["Colgate", "Oral-B", "Sensodyne", "Patanjali"],
    nameTemplates: [
      "{brand} Soft Bristle Toothbrush",
      "{brand} Medium Bristle Toothbrush",
      "{brand} Charcoal Toothbrush",
      "{brand} Kids Toothbrush",
    ],
    priceRange: [29, 299],
    highlightsPool: ["Soft bristles", "Gentle on gums", "Best Price", "Pack of 3"],
    featuresPool: [
      "Ergonomic Non-slip Handle",
      "Deep Cleans Hard-to-reach Areas",
      "BPA-free Material",
      "Suitable for Daily Use",
    ],
  },

  // ===== SNACKS =====
  {
    category: "Groceries",
    subCategory: "Biscuits",
    searchQuery: "biscuits cookies snack",
    brands: ["Britannia", "Parle", "Sunfeast", "Oreo", "McVities"],
    nameTemplates: [
      "{brand} Glucose Biscuits",
      "{brand} Cream Biscuits",
      "{brand} Digestive Biscuits",
      "{brand} Cookies Pack",
    ],
    priceRange: [20, 199],
    highlightsPool: ["Crunchy texture", "Rich taste", "Best Price", "Family pack"],
    featuresPool: [
      "Baked with Real Ingredients",
      "No Added Preservatives",
      "Perfect Tea-time Snack",
      "Resealable Pack for Freshness",
    ],
  },
  {
    category: "Groceries",
    subCategory: "Chocolate",
    searchQuery: "chocolate bar sweet",
    brands: ["Cadbury", "Nestle", "Amul", "Ferrero", "Hershey's"],
    nameTemplates: [
      "{brand} Milk Chocolate Bar",
      "{brand} Dark Chocolate Bar",
      "{brand} Chocolate Gift Pack",
      "{brand} Hazelnut Chocolate",
    ],
    priceRange: [40, 799],
    highlightsPool: ["Rich cocoa taste", "Smooth & creamy", "Best Price", "Perfect gift"],
    featuresPool: [
      "Made with Premium Cocoa",
      "No Artificial Colors",
      "Individually Wrapped Pieces",
      "Great for Gifting & Sharing",
    ],
  },

  // ===== KITCHEN VESSELS =====
  {
    category: "Home & Kitchen",
    subCategory: "Cooking Vessels",
    searchQuery: "kitchen cookware steel utensils",
    brands: ["Prestige", "Hawkins", "Pigeon", "Wonderchef", "Vinod"],
    nameTemplates: [
      "{brand} Steel Cooking Pot",
      "{brand} Non-Stick Frying Pan",
      "{brand} Pressure Cooker",
      "{brand} Stainless Steel Kadai",
    ],
    priceRange: [349, 4999],
    highlightsPool: ["Durable build", "Even heat distribution", "Best Price", "Easy to clean"],
    featuresPool: [
      "High-grade Stainless Steel",
      "Induction & Gas Stove Compatible",
      "Rust & Corrosion Resistant",
      "Comfortable Heat-resistant Handles",
    ],
  },
  {
    category: "Home & Kitchen",
    subCategory: "Dinner Sets",
    searchQuery: "dinner set plates bowls",
    brands: ["Corelle", "Cello", "Larah", "Servewell", "Borosil"],
    nameTemplates: [
      "{brand} Dinner Plate Set",
      "{brand} Steel Bowl Set",
      "{brand} Glass Dinner Set",
      "{brand} Ceramic Plate Set",
    ],
    priceRange: [499, 5999],
    highlightsPool: ["Elegant design", "Chip resistant", "Best Price", "Set of 6"],
    featuresPool: [
      "Microwave & Dishwasher Safe",
      "Lightweight yet Sturdy",
      "Stylish Everyday Design",
      "Easy to Stack & Store",
    ],
  },
  {
    category: "Home & Kitchen",
    subCategory: "Storage Containers",
    searchQuery: "kitchen storage containers jars",
    brands: ["Tupperware", "Cello", "Milton", "Signoraware"],
    nameTemplates: [
      "{brand} Airtight Storage Container Set",
      "{brand} Kitchen Jar Set",
      "{brand} Fridge Storage Box",
      "{brand} Spice Container Set",
    ],
    priceRange: [199, 2499],
    highlightsPool: ["Airtight lids", "Space saving", "Best Price", "BPA-free"],
    featuresPool: [
      "Keeps Food Fresh Longer",
      "Stackable Space-saving Design",
      "Transparent Body for Easy Viewing",
      "Leak-proof Seal",
    ],
  },

  // ===== HOME ESSENTIALS =====
  {
    category: "Home Essentials",
    subCategory: "Cleaning Supplies",
    searchQuery: "home cleaning supplies detergent",
    brands: ["Vim", "Surf Excel", "Harpic", "Lizol", "Colin"],
    nameTemplates: [
      "{brand} Dishwash Liquid",
      "{brand} Floor Cleaner",
      "{brand} Toilet Cleaner",
      "{brand} Glass Cleaner",
    ],
    priceRange: [49, 399],
    highlightsPool: ["Powerful cleaning", "Fresh fragrance", "Best Price", "Kills 99.9% germs"],
    featuresPool: [
      "Removes Tough Stains Easily",
      "Long-lasting Fragrance",
      "Safe on Multiple Surfaces",
      "Germ Protection Formula",
    ],
  },
  {
    category: "Home Essentials",
    subCategory: "Bedsheets & Linen",
    searchQuery: "bedsheet home linen",
    brands: ["Bombay Dyeing", "Spaces", "Cortina", "Raymond Home"],
    nameTemplates: [
      "{brand} Cotton Bedsheet Set",
      "{brand} Double Bed Bedsheet",
      "{brand} Printed Bedsheet with Pillow Covers",
      "{brand} Premium Cotton Bedsheet",
    ],
    priceRange: [399, 2999],
    highlightsPool: ["Soft cotton fabric", "Vibrant colors", "Best Price", "Includes pillow covers"],
    featuresPool: [
      "100% Pure Cotton",
      "Fade-resistant Print",
      "Breathable & Skin-friendly",
      "Machine Washable",
    ],
  },

  // ===== SNACKS - CHIPS =====
  {
    category: "Groceries",
    subCategory: "Chips",
    searchQuery: "chips snacks packet",
    brands: ["Lays", "Kurkure", "Bingo", "Haldiram's", "Pringles", "Uncle Chipps"],
    nameTemplates: [
      "{brand} Potato Chips",
      "{brand} Masala Chips",
      "{brand} Classic Salted Chips",
      "{brand} Spicy Chips Pack",
    ],
    priceRange: [10, 299],
    highlightsPool: ["Crispy & crunchy", "Bold flavor", "Best Price", "Family pack"],
    featuresPool: [
      "Made from Fresh Potatoes",
      "No Trans Fat",
      "Resealable Pack for Freshness",
      "Perfect Party Snack",
    ],
  },

  // ===== WATCHES =====
  {
    category: "Electronics",
    subCategory: "Watches",
    searchQuery: "wrist watch fashion",
    brands: ["Titan", "Fastrack", "Casio", "Fossil", "Noise", "boAt"],
    nameTemplates: [
      "{brand} Analog Watch",
      "{brand} Smart Watch",
      "{brand} Chronograph Watch",
      "{brand} Digital Sports Watch",
    ],
    priceRange: [499, 8999],
    highlightsPool: ["Stylish design", "Water resistant", "Best Price", "Long battery life"],
    featuresPool: [
      "Scratch-resistant Glass",
      "Adjustable Strap",
      "Water Resistant up to 30m",
      "1-Year Manufacturer Warranty",
    ],
  },

  // ===== BAGS =====
  {
    category: "Fashion",
    subCategory: "Bags",
    searchQuery: "backpack handbag fashion",
    brands: ["Wildcraft", "American Tourister", "Skybags", "Puma", "Caprese"],
    nameTemplates: [
      "{brand} Casual Backpack",
      "{brand} Laptop Bag",
      "{brand} Travel Duffel Bag",
      "{brand} Women's Handbag",
    ],
    priceRange: [399, 3999],
    highlightsPool: ["Spacious storage", "Durable fabric", "Best Price", "Multiple compartments"],
    featuresPool: [
      "Water-resistant Material",
      "Padded Laptop Compartment",
      "Adjustable Padded Straps",
      "Ideal for Travel & Daily Use",
    ],
  },

  // ===== TOYS & GAMES =====
  {
    category: "Gaming",
    subCategory: "Toys & Games",
    searchQuery: "kids toys games",
    brands: ["Funskool", "Hot Wheels", "LEGO", "Fisher-Price", "Nerf"],
    nameTemplates: [
      "{brand} Building Blocks Set",
      "{brand} Remote Control Car",
      "{brand} Action Figure Toy",
      "{brand} Board Game",
    ],
    priceRange: [199, 3499],
    highlightsPool: ["Fun & educational", "Safe for kids", "Best Price", "Durable build"],
    featuresPool: [
      "Non-toxic Materials",
      "Boosts Creativity & Motor Skills",
      "Suitable for Ages 3+",
      "Easy to Assemble",
    ],
  },

  // ===== KIDS =====
  {
    category: "Kids",
    subCategory: "Kids Toys",
    searchQuery: "kids toys children",
    brands: ["Fisher-Price", "Hot Wheels", "LEGO", "Barbie", "Funskool"],
    nameTemplates: [
      "{brand} Building Blocks Set",
      "{brand} Remote Control Car",
      "{brand} Doll House Playset",
      "{brand} Puzzle Game Pack",
    ],
    priceRange: [199, 4999],
    highlightsPool: ["Safe for kids", "Fun & educational", "Best Price", "Durable build"],
    featuresPool: [
      "Non-toxic Materials",
      "Boosts Creativity & Motor Skills",
      "Suitable for Ages 3+",
      "Easy to Assemble",
    ],
  },

  // ===== BIKE =====
  {
    category: "Bike",
    subCategory: "Bicycles",
    searchQuery: "bicycle bike cycling",
    brands: ["Hero", "BSA", "Firefox", "Btwin", "Hercules"],
    nameTemplates: [
      "{brand} Mountain Bike",
      "{brand} Road Cycle",
      "{brand} Kids Bicycle",
      "{brand} BMX Bike",
    ],
    priceRange: [3999, 34999],
    highlightsPool: ["Sturdy frame", "Smooth ride", "Best Price", "All terrain"],
    featuresPool: [
      "High-tensile Steel Frame",
      "Dual Disc Brakes",
      "Adjustable Seat Height",
      "1-Year Manufacturer Warranty",
    ],
  },

  // ===== JEEP =====
  {
    category: "Jeep",
    subCategory: "Jeep Models & Accessories",
    searchQuery: "jeep suv offroad vehicle",
    brands: ["Mahindra", "Force", "Tata", "Jeep"],
    nameTemplates: [
      "{brand} Off-Road Diecast Model",
      "{brand} SUV Toy Model",
      "{brand} RC Jeep Vehicle",
      "{brand} Miniature Jeep Collectible",
    ],
    priceRange: [499, 14999],
    highlightsPool: ["Detailed design", "Collector's item", "Best Price", "Sturdy build"],
    featuresPool: [
      "Die-cast Metal Body",
      "Functional Wheels",
      "1:18 Scale Model",
      "Great for Collectors",
    ],
  },

  // ===== MOTORCYCLE =====
  {
    category: "Motorcycle",
    subCategory: "Motorcycle Gear",
    searchQuery: "motorcycle riding gear helmet",
    brands: ["Royal Enfield", "Bajaj", "Studds", "Vega", "Steelbird"],
    nameTemplates: [
      "{brand} Riding Helmet",
      "{brand} Riding Gloves",
      "{brand} Bike Cover",
      "{brand} Riding Jacket",
    ],
    priceRange: [499, 9999],
    highlightsPool: ["ISI certified", "Comfortable fit", "Best Price", "All-weather protection"],
    featuresPool: [
      "Impact-resistant Shell",
      "Breathable Interior Padding",
      "Adjustable Straps",
      "Certified Safety Standards",
    ],
  },

  // ===== EARRINGS =====
  {
    category: "Jewellery",
    subCategory: "Earrings",
    searchQuery: "earrings jewelry fashion",
    brands: ["Tanishq", "CaratLane", "Voylla", "Zaveri Pearls", "Sukkhi"],
    nameTemplates: [
      "{brand} Gold Plated Earrings",
      "{brand} Pearl Drop Earrings",
      "{brand} Jhumka Earrings",
      "{brand} Stud Earrings Set",
    ],
    priceRange: [149, 4999],
    highlightsPool: ["Elegant design", "Lightweight", "Best Price", "Skin friendly"],
    featuresPool: [
      "Anti-tarnish Coating",
      "Nickel-free Material",
      "Perfect for Festive Wear",
      "Comes with Gift Box",
    ],
  },

  // ===== NECKLACE =====
  {
    category: "Jewellery",
    subCategory: "Necklace",
    searchQuery: "necklace jewelry set",
    brands: ["Tanishq", "CaratLane", "Voylla", "Zaveri Pearls", "Sukkhi"],
    nameTemplates: [
      "{brand} Pearl Necklace Set",
      "{brand} Gold Plated Necklace",
      "{brand} Kundan Necklace Set",
      "{brand} Layered Choker Necklace",
    ],
    priceRange: [299, 7999],
    highlightsPool: ["Statement piece", "Intricate design", "Best Price", "Bridal collection"],
    featuresPool: [
      "Anti-tarnish Coating",
      "Adjustable Chain Length",
      "Includes Matching Earrings",
      "Comes with Gift Box",
    ],
  },

  // ===== RINGS =====
  {
    category: "Jewellery",
    subCategory: "Rings",
    searchQuery: "ring jewelry fashion",
    brands: ["Tanishq", "CaratLane", "Voylla", "Sukkhi", "Giva"],
    nameTemplates: [
      "{brand} Adjustable Ring",
      "{brand} Solitaire Ring",
      "{brand} Silver Band Ring",
      "{brand} Couple Ring Set",
    ],
    priceRange: [199, 5999],
    highlightsPool: ["Adjustable size", "Elegant finish", "Best Price", "Everyday wear"],
    featuresPool: [
      "Anti-tarnish Coating",
      "Free Size Adjustable Band",
      "Hypoallergenic Material",
      "Comes with Gift Box",
    ],
  },

  // ===== BANGLES =====
  {
    category: "Jewellery",
    subCategory: "Bangles",
    searchQuery: "bangles jewelry traditional",
    brands: ["Tanishq", "Voylla", "Sukkhi", "Zaveri Pearls", "Giva"],
    nameTemplates: [
      "{brand} Gold Plated Bangles Set",
      "{brand} Kada Bangle",
      "{brand} Glass Bangles Set",
      "{brand} Bridal Bangle Set",
    ],
    priceRange: [249, 6999],
    highlightsPool: ["Traditional design", "Set of multiple pieces", "Best Price", "Festive collection"],
    featuresPool: [
      "Anti-tarnish Coating",
      "Available in Multiple Sizes",
      "Perfect for Weddings & Festivals",
      "Comes with Gift Box",
    ],
  },

  // ===== SPORTS =====
  {
    category: "Health",
    subCategory: "Sports",
    searchQuery: "sports fitness equipment",
    brands: ["Nivia", "Cosco", "Yonex", "Nike", "Decathlon"],
    nameTemplates: [
      "{brand} Football",
      "{brand} Badminton Racket",
      "{brand} Yoga Mat",
      "{brand} Gym Gloves",
    ],
    priceRange: [149, 2999],
    highlightsPool: ["Durable material", "Enhances performance", "Best Price", "Lightweight design"],
    featuresPool: [
      "High-grip Non-slip Surface",
      "Shock-absorbent Build",
      "Suitable for Indoor & Outdoor Use",
      "Trusted by Athletes",
    ],
  },

  // ===== BABY PRODUCTS =====
  {
    category: "Baby",
    subCategory: "Baby Products",
    searchQuery: "baby care products",
    brands: ["Pampers", "Johnson's", "Himalaya", "Chicco", "Mee Mee"],
    nameTemplates: [
      "{brand} Baby Diapers Pack",
      "{brand} Baby Lotion",
      "{brand} Baby Wipes",
      "{brand} Baby Feeding Bottle",
    ],
    priceRange: [99, 1499],
    highlightsPool: ["Gentle on skin", "Dermatologically tested", "Best Price", "Rash-free comfort"],
    featuresPool: [
      "Hypoallergenic Formula",
      "Soft & Breathable Material",
      "No Harmful Chemicals",
      "Trusted by Pediatricians",
    ],
  },

  // ===== ELECTRONICS =====
  {
    category: "Electronics",
    subCategory: "Electronics Accessories",
    searchQuery: "electronics gadgets accessories",
    brands: ["Sony", "JBL", "boAt", "Samsung", "Mi", "Realme"],
    nameTemplates: [
      "{brand} Wireless Earbuds",
      "{brand} Bluetooth Speaker",
      "{brand} Power Bank",
      "{brand} Smartphone Charger",
    ],
    priceRange: [299, 4999],
    highlightsPool: ["High sound quality", "Fast charging", "Best Price", "Compact design"],
    featuresPool: [
      "Bluetooth 5.0 Connectivity",
      "Up to 20 Hours Battery Life",
      "Fast Charging Support",
      "1-Year Manufacturer Warranty",
    ],
  },

  // ===== MOBILES =====
  {
    category: "Mobiles",
    subCategory: "Smartphones",
    searchQuery: "smartphone mobile phone",
    brands: ["Samsung", "Redmi", "Realme", "Vivo", "Oppo", "Apple"],
    nameTemplates: [
      "{brand} Smartphone 128GB",
      "{brand} 5G Mobile Phone",
      "{brand} Smartphone with 6.5\" Display",
      "{brand} Mobile Phone 8GB RAM",
    ],
    priceRange: [7999, 79999],
    highlightsPool: ["High-res camera", "Fast performance", "Best Price", "Long battery life"],
    featuresPool: [
      "AMOLED Display",
      "Fast Charging Support",
      "Triple Camera Setup",
      "1-Year Manufacturer Warranty",
    ],
  },

  // ===== LAPTOPS =====
  {
    category: "Laptops",
    subCategory: "Laptops",
    searchQuery: "laptop computer notebook",
    brands: ["HP", "Dell", "Lenovo", "Asus", "Acer", "Apple"],
    nameTemplates: [
      "{brand} Laptop Intel i5",
      "{brand} Laptop Ryzen 5",
      "{brand} Ultrabook 14\" Display",
      "{brand} Gaming Laptop",
    ],
    priceRange: [24999, 129999],
    highlightsPool: ["Fast processor", "Sleek design", "Best Price", "Long battery backup"],
    featuresPool: [
      "8GB/16GB RAM Options",
      "SSD Storage for Fast Boot",
      "Full HD Display",
      "1-Year Manufacturer Warranty",
    ],
  },

  // ===== FURNITURE =====
  {
    category: "Furniture",
    subCategory: "Furniture",
    searchQuery: "furniture home sofa chair",
    brands: ["Nilkamal", "Godrej Interio", "Urban Ladder", "Pepperfry", "Wakefit"],
    nameTemplates: [
      "{brand} Wooden Study Table",
      "{brand} 3-Seater Sofa",
      "{brand} Office Chair",
      "{brand} Bookshelf Cabinet",
    ],
    priceRange: [1499, 24999],
    highlightsPool: ["Sturdy build", "Modern design", "Best Price", "Space saving"],
    featuresPool: [
      "Solid Engineered Wood",
      "Easy Assembly",
      "Scratch-resistant Finish",
      "1-Year Manufacturer Warranty",
    ],
  },

  // ===== GAMING =====
  
  
];

// Fetches 40 unique photos per sub-category (Unsplash max per_page = 30,
// so we combine page 1 (30) + page 2 (10) in parallel to get 40)
const fetchPhotos = async (query: string) => {
  const [page1, page2] = await Promise.all([
    axios.get(`${UNSPLASH_BASE_URL}/search/photos`, {
      params: { query, per_page: 30, page: 1 },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    }),
    axios.get(`${UNSPLASH_BASE_URL}/search/photos`, {
      params: { query, per_page: 10, page: 2 },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    }),
  ]);

  const combinedResults = [...page1.data.results, ...page2.data.results];

  // Dedupe by photo id in case Unsplash returns overlapping results across pages
  const seen = new Set<string>();
  const uniquePhotos = combinedResults.filter((photo: any) => {
    if (seen.has(photo.id)) return false;
    seen.add(photo.id);
    return true;
  });

  return uniquePhotos.map((photo: any) => ({
    url: photo.urls.regular,
    alt: photo.alt_description || query,
  }));
};

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Picks 3-4 random, non-repeating items from a pool for highlights/features
const pickRandomSubset = <T,>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const slugify = (text: string, suffix: number) =>
  `${text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-")}-${suffix}`;

const seed = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not set in .env");
    }
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      throw new Error("UNSPLASH_ACCESS_KEY not set in .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    const seller = await User.findOne({
      role: { $in: ["admin", "seller"] },
    });

    if (!seller) {
      throw new Error(
        "No admin/seller user found. Register a user and set role to 'admin' or 'seller' first."
      );
    }

    console.log(`Using seller: ${seller.name} (${seller._id})`);

    let totalCreated = 0;

    for (const config of subCategoryConfigs) {
      console.log(`\nFetching images for "${config.subCategory}"...`);

      let photos: { url: string; alt: string }[] = [];
      try {
        photos = await fetchPhotos(config.searchQuery);
      } catch (err: any) {
        console.error(
          `  ⚠️ Failed to fetch photos for ${config.subCategory}:`,
          err.response?.data || err.message
        );
      }

      if (photos.length === 0) {
        console.log(`  No photos found, using a placeholder for ${config.subCategory}`);
        photos = [
          {
            url: `https://dummyimage.com/500x500/e5e7eb/9ca3af.png&text=${encodeURIComponent(
              config.subCategory
            )}`,
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
        const discountPrice = hasDiscount
          ? Math.round(price * (0.7 + Math.random() * 0.2))
          : undefined;

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
          highlights,
          features,
          warranty: "Warranty not available",
        });
      }

      await Product.insertMany(productsForSubCategory);
      totalCreated += productsForSubCategory.length;
      console.log(`  ✅ Created ${productsForSubCategory.length} products for ${config.subCategory}`);
    }

    console.log(`\n🎉 Done! ${totalCreated} home essentials products created.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seed();