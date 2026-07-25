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

/**
 * ⚠️ category / subCategory values below have been remapped (26/07) to match
 * the 12-category taxonomy in src/config/categories.ts. Every entry now uses
 * an EXACT `category` string and an EXACT `subCategory` string that exists in
 * CATEGORY_SUBCATEGORIES for that category — cross-checked against
 * SUBCATEGORY_CHILDREN so the product's implied "child" (e.g. Lipstick ->
 * Makeup -> Lips) is a real leaf in that taxonomy too. None of the old
 * category names (Beauty & Makeup, Personal Care, Home & Kitchen, Home
 * Essentials, Mobiles, Laptops, Furniture, Kids, Jewellery, Health, Baby,
 * Gaming, Bike, Jeep, Motorcycle, Electronics, Fashion) are used anymore —
 * those don't exist in the new taxonomy.
 *
 * Where a bucket had mixed items that don't cleanly map to one subCategory
 * (e.g. old "Sports"/"Electronics Accessories"/"Baby Products"), the closest
 * single matching subCategory was chosen and noted inline.
 */
const subCategoryConfigs: SubCategoryConfig[] = [
  // ===== MAKEUP =====
  {
    category: "Health & Beauty",
    subCategory: "Makeup", // child: Lips
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
    category: "Health & Beauty",
    subCategory: "Makeup", // child: Face
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
    category: "Health & Beauty",
    subCategory: "Makeup", // child: Makeup Accessories
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
    category: "Health & Beauty",
    subCategory: "Personal Care", // child: Oral Care
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
    category: "Health & Beauty",
    subCategory: "Bath & Body", // child: Body Soaps & Shower Gels
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
    category: "Health & Beauty",
    subCategory: "Hair Care", // child: Shampoo & Conditioner
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
    category: "Health & Beauty",
    subCategory: "Personal Care", // child: Oral Care
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
    category: "Groceries & Pets",
    subCategory: "Breakfast, Choco & Snacks",
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
    category: "Groceries & Pets",
    subCategory: "Breakfast, Choco & Snacks",
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
    category: "TV & Home Appliances",
    subCategory: "Kitchen Appliances", // child: Specialty Cookware
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
    // ⚠️ RECHECK — taxonomy has no dedicated "dinnerware" leaf; closest bucket used
    category: "TV & Home Appliances",
    subCategory: "Kitchen Appliances",
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
    category: "TV & Home Appliances",
    subCategory: "Kitchen Appliances",
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
    category: "Groceries & Pets",
    subCategory: "Laundry & Household", // child: Cleaning
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
    category: "Home & Lifestyle",
    subCategory: "Bedding", // child: Bed Sheets
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
    category: "Groceries & Pets",
    subCategory: "Breakfast, Choco & Snacks",
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
    category: "Watches, Bags & Jewellery",
    subCategory: "Men's Watches",
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
    category: "Watches, Bags & Jewellery",
    subCategory: "Mens Bags", // child: Backpacks
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
    category: "Mother & Baby",
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
    category: "Mother & Baby",
    subCategory: "Toys & Games", // child: Dolls & Accessories
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
    category: "Sports & Outdoor",
    subCategory: "Outdoor Recreation", // child: Cycling
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

  // ===== JEEP (toy/diecast models) =====
  {
    category: "Mother & Baby",
    subCategory: "Remote Control & Vehicles", // child: Die-Cast Vehicles
    searchQuery: "jeep suv offroad vehicle toy model",
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
    category: "Automotive & Motorbike",
    subCategory: "Motorcycle", // child: Riding Gear
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
    category: "Watches, Bags & Jewellery",
    subCategory: "Womens Jewellery", // child: Earrings
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
    category: "Watches, Bags & Jewellery",
    subCategory: "Womens Jewellery", // child: Necklaces
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
    category: "Watches, Bags & Jewellery",
    subCategory: "Womens Jewellery", // child: Rings
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
    category: "Watches, Bags & Jewellery",
    subCategory: "Womens Jewellery", // child: Bracelets
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
    // ⚠️ RECHECK — mixed items (football/racket/mat/gloves); closest single bucket used
    category: "Sports & Outdoor",
    subCategory: "Exercise & Fitness",
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
    // ⚠️ RECHECK — mixed (diapers/lotion/wipes/bottle); diapering-heavy bucket used
    category: "Mother & Baby",
    subCategory: "Diapering & Potty",
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

  // ===== ELECTRONICS ACCESSORIES =====
  {
    category: "Electronic Accessories",
    subCategory: "Headphones & Headsets", // child: Wireless Earbuds
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
    category: "Electronic Devices",
    subCategory: "Smart Phones",
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
    category: "Electronic Devices",
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
    category: "Home & Lifestyle",
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

  // ===== PRESSURE COOKER =====
  {
    category: "TV & Home Appliances",
    subCategory: "Kitchen Appliances",
    searchQuery: "pressure cooker kitchen appliance",
    brands: ["Prestige", "Hawkins", "Pigeon", "Butterfly", "Vinod"],
    nameTemplates: [
      "{brand} Aluminium Pressure Cooker",
      "{brand} Stainless Steel Pressure Cooker",
      "{brand} Induction Base Pressure Cooker",
      "{brand} Outer Lid Pressure Cooker",
    ],
    priceRange: [699, 4999],
    highlightsPool: ["Fast cooking", "Durable build", "Best Price", "Energy efficient"],
    featuresPool: [
      "Gas & Induction Compatible",
      "Safety Valve & Gasket Release System",
      "Rust-resistant Body",
      "2-Year Warranty",
    ],
  },

  // ===== GAS STOVE / INDUCTION =====
  {
    category: "TV & Home Appliances",
    subCategory: "Kitchen Appliances", // child: Cooktop & Range
    searchQuery: "gas stove induction cooktop kitchen",
    brands: ["Prestige", "Sunflame", "Pigeon", "Elica", "Butterfly"],
    nameTemplates: [
      "{brand} 2 Burner Gas Stove",
      "{brand} 4 Burner Glass Top Gas Stove",
      "{brand} Induction Cooktop",
      "{brand} Auto-Ignition Gas Stove",
    ],
    priceRange: [1299, 8999],
    highlightsPool: ["High flame efficiency", "Sturdy pan support", "Best Price", "Easy to clean"],
    featuresPool: [
      "Toughened Glass Top",
      "Auto Ignition System",
      "ISI Certified",
      "1-Year Manufacturer Warranty",
    ],
  },

  // ===== WATER BOTTLE / FLASK =====
  {
    category: "Sports & Outdoor",
    subCategory: "Sports Accessories", // child: Water Bottles
    searchQuery: "water bottle flask steel",
    brands: ["Milton", "Cello", "Borosil", "Pigeon", "Nalgene"],
    nameTemplates: [
      "{brand} Stainless Steel Water Bottle",
      "{brand} Vacuum Insulated Flask",
      "{brand} Sports Water Bottle",
      "{brand} Kids School Water Bottle",
    ],
    priceRange: [149, 1499],
    highlightsPool: ["Leak-proof", "Keeps water cold/hot", "Best Price", "Durable build"],
    featuresPool: [
      "Double-wall Vacuum Insulation",
      "BPA-free Material",
      "Keeps Cold up to 24 Hours",
      "Leak-proof Cap Design",
    ],
  },

  // ===== BLENDER / MIXER GRINDER =====
  {
    category: "TV & Home Appliances",
    subCategory: "Kitchen Appliances", // child: Blender/Mixer/Grinder
    searchQuery: "mixer grinder blender kitchen appliance",
    brands: ["Preethi", "Bajaj", "Philips", "Prestige", "Butterfly"],
    nameTemplates: [
      "{brand} Mixer Grinder 750W",
      "{brand} 3 Jar Mixer Grinder",
      "{brand} Juicer Mixer Grinder",
      "{brand} Wet & Dry Grinder",
    ],
    priceRange: [1499, 6999],
    highlightsPool: ["Powerful motor", "Multiple jars included", "Best Price", "Durable blades"],
    featuresPool: [
      "High-speed Copper Motor",
      "Stainless Steel Blades",
      "Overload Protection",
      "2-Year Warranty",
    ],
  },

  // ===== IRON BOX =====
  {
    category: "TV & Home Appliances",
    subCategory: "Irons & Garment Care", // child: Irons
    searchQuery: "iron box clothes press",
    brands: ["Philips", "Bajaj", "Havells", "Usha", "Orient"],
    nameTemplates: [
      "{brand} Steam Iron Box",
      "{brand} Dry Iron Box",
      "{brand} Cordless Iron",
      "{brand} Ceramic Sole Plate Iron",
    ],
    priceRange: [499, 2999],
    highlightsPool: ["Smooth gliding", "Quick heat-up", "Best Price", "Even heat distribution"],
    featuresPool: [
      "Non-stick Soleplate",
      "Adjustable Temperature Control",
      "Auto Shut-off Safety",
      "1-Year Warranty",
    ],
  },

  // ===== CURTAINS & BLINDS =====
  {
    category: "Home & Lifestyle",
    subCategory: "Decor", // child: Curtains
    searchQuery: "curtains window blinds home decor",
    brands: ["Story@Home", "Homefab India", "Bombay Dyeing", "Cortina", "Spaces"],
    nameTemplates: [
      "{brand} Blackout Curtains Set",
      "{brand} Printed Door Curtains",
      "{brand} Window Blinds",
      "{brand} Sheer Curtain Panel",
    ],
    priceRange: [399, 2999],
    highlightsPool: ["Blocks sunlight", "Elegant patterns", "Best Price", "Easy to hang"],
    featuresPool: [
      "Polyester Blackout Fabric",
      "Eyelet/Ring Top Style",
      "Machine Washable",
      "Fade-resistant Print",
    ],
  },

  // ===== MEN'S INNERWEAR =====
  {
    category: "Men's Fashion",
    subCategory: "Inner Wear",
    searchQuery: "men innerwear vest boxer cotton",
    brands: ["Jockey", "Rupa", "Dollar", "VIP", "Amul Macho"],
    nameTemplates: [
      "{brand} Cotton Vest Pack",
      "{brand} Boxer Shorts Pack",
      "{brand} Trunk Pack of 3",
      "{brand} Briefs Combo Pack",
    ],
    priceRange: [199, 1299],
    highlightsPool: ["Soft cotton fabric", "All-day comfort", "Best Price", "Pack of 3/5"],
    featuresPool: [
      "100% Breathable Cotton",
      "Elastic Waistband",
      "Skin-friendly Material",
      "Machine Washable",
    ],
  },

  // ===== FORMAL SHOES =====
  {
    category: "Men's Fashion",
    subCategory: "Boy's Shoes", // child: Formal Shoes (per taxonomy naming)
    searchQuery: "formal shoes leather men",
    brands: ["Bata", "Red Tape", "Woodland", "Hush Puppies", "Metro"],
    nameTemplates: [
      "{brand} Leather Formal Shoes",
      "{brand} Lace-up Oxford Shoes",
      "{brand} Slip-on Formal Shoes",
      "{brand} Derby Formal Shoes",
    ],
    priceRange: [999, 5999],
    highlightsPool: ["Genuine leather", "Comfortable sole", "Best Price", "Elegant design"],
    featuresPool: [
      "Genuine Leather Upper",
      "Cushioned Insole",
      "Anti-skid Rubber Sole",
      "Ideal for Office & Formal Occasions",
    ],
  },

  // ===== SPORTS SHOES / SNEAKERS =====
  {
    category: "Men's Fashion",
    subCategory: "Boy's Shoes", // child: Sneakers
    searchQuery: "sports shoes sneakers running",
    brands: ["Nike", "Adidas", "Puma", "Reebok", "Asics", "Skechers"],
    nameTemplates: [
      "{brand} Running Shoes",
      "{brand} Sports Sneakers",
      "{brand} Training Shoes",
      "{brand} Casual Sneakers",
    ],
    priceRange: [1299, 7999],
    highlightsPool: ["Lightweight design", "Cushioned comfort", "Best Price", "Breathable mesh"],
    featuresPool: [
      "Breathable Mesh Upper",
      "Shock-absorbing Sole",
      "Anti-slip Grip",
      "Suitable for Running & Casual Wear",
    ],
  },

  // ===== BELTS & WALLETS =====
  {
    category: "Watches, Bags & Jewellery",
    subCategory: "Mens Bags", // child: Wallets & Cardholders
    searchQuery: "leather belt wallet men accessories",
    brands: ["Woodland", "Hidesign", "Baggit", "Louis Philippe", "Tommy Hilfiger"],
    nameTemplates: [
      "{brand} Leather Belt",
      "{brand} Bi-fold Wallet",
      "{brand} Reversible Belt",
      "{brand} Leather Card Holder Wallet",
    ],
    priceRange: [299, 2499],
    highlightsPool: ["Genuine leather", "Durable stitching", "Best Price", "Elegant finish"],
    featuresPool: [
      "Genuine Leather Material",
      "Multiple Card Slots",
      "Adjustable Buckle",
      "Comes with Gift Box",
    ],
  },

  // ===== SAREES =====
  {
    category: "Women's Fashion",
    subCategory: "Unstitched Fabric", // child: Sarees
    searchQuery: "saree indian ethnic wear",
    brands: ["Kalini", "Mimosa", "Soch", "Fabindia", "Nalli"],
    nameTemplates: [
      "{brand} Printed Silk Saree",
      "{brand} Cotton Handloom Saree",
      "{brand} Georgette Party Wear Saree",
      "{brand} Banarasi Silk Saree",
    ],
    priceRange: [499, 6999],
    highlightsPool: ["Elegant drape", "Rich fabric", "Best Price", "Comes with blouse piece"],
    featuresPool: [
      "Premium Fabric Quality",
      "Includes Matching Blouse Piece",
      "Perfect for Festive & Wedding Wear",
      "Easy to Maintain",
    ],
  },

  // ===== KURTIS & ETHNIC WEAR =====
  {
    category: "Women's Fashion",
    subCategory: "Kurtas & Shalwar Kameez", // child: Kurtis
    searchQuery: "kurti ethnic wear indian women",
    brands: ["Biba", "W", "Global Desi", "Aurelia", "Libas"],
    nameTemplates: [
      "{brand} Printed Cotton Kurti",
      "{brand} Anarkali Kurti",
      "{brand} Straight Fit Kurti",
      "{brand} Kurti with Palazzo Set",
    ],
    priceRange: [399, 2999],
    highlightsPool: ["Comfortable fit", "Vibrant prints", "Best Price", "Everyday elegance"],
    featuresPool: [
      "Breathable Cotton Fabric",
      "Machine Washable",
      "Regular Fit",
      "Available in Multiple Sizes",
    ],
  },
  {
    category: "Health & Beauty",
    subCategory: "Fragrances",
    searchQuery: "perfume fragrance bottle cosmetics",
    brands: ["Fogg", "Wild Stone", "Nivea", "Park Avenue", "Denver", "Engage"],
    nameTemplates: [
      "{brand} Eau De Parfum",
      "{brand} Body Spray",
      "{brand} Deodorant Perfume",
      "{brand} Signature Fragrance",
    ],
    priceRange: [149, 2999],
    highlightsPool: ["Long lasting scent", "Fresh fragrance", "Best Price", "Elegant bottle"],
    featuresPool: [
      "Long-lasting Fragrance Notes",
      "Alcohol-based Formula",
      "Perfect for Daily & Occasion Wear",
      "Comes in Premium Packaging",
    ],
  },

  // ===== RAINCOATS / UMBRELLAS =====
  {
    // ⚠️ RECHECK — no dedicated rainwear leaf; outdoor bucket used
    category: "Sports & Outdoor",
    subCategory: "Outdoor Recreation",
    searchQuery: "raincoat umbrella rain gear",
    brands: ["Duckback", "John's", "Zeel", "Fastrack", "Stag"],
    nameTemplates: [
      "{brand} Waterproof Raincoat",
      "{brand} Rain Poncho",
      "{brand} Auto-Open Umbrella",
      "{brand} Windproof Umbrella",
    ],
    priceRange: [199, 1499],
    highlightsPool: ["Waterproof material", "Compact & portable", "Best Price", "Wind resistant"],
    featuresPool: [
      "100% Waterproof Fabric",
      "Auto Open/Close Mechanism",
      "Lightweight & Foldable",
      "Durable Frame",
    ],
  },

  // ===== HAND SANITIZER =====
  {
    category: "Health & Beauty",
    subCategory: "Personal Care",
    searchQuery: "hand sanitizer hygiene",
    brands: ["Dettol", "Savlon", "Lifebuoy", "Godrej Protekt"],
    nameTemplates: [
      "{brand} Hand Sanitizer Gel",
      "{brand} Alcohol-based Sanitizer",
      "{brand} Sanitizer Spray",
      "{brand} Sanitizer Pump Bottle",
    ],
    priceRange: [49, 399],
    highlightsPool: ["Kills 99.9% germs", "Non-sticky formula", "Best Price", "Travel-friendly"],
    featuresPool: [
      "70% Alcohol Content",
      "Moisturizing Formula",
      "Quick-drying",
      "Dermatologically Tested",
    ],
  },

  // ===== FACE MASKS =====
  {
    category: "Health & Beauty",
    subCategory: "Medical Supplies", // child: Surgical Masks
    searchQuery: "face mask protective health",
    brands: ["Cotton World", "Xoxoday", "Boxo", "Wakefit", "Medtech"],
    nameTemplates: [
      "{brand} 3-Ply Face Mask Pack",
      "{brand} N95 Face Mask",
      "{brand} Reusable Cotton Mask",
      "{brand} Surgical Mask Pack",
    ],
    priceRange: [49, 499],
    highlightsPool: ["Breathable comfort", "Skin-friendly", "Best Price", "Pack of 10/50"],
    featuresPool: [
      "3-Layer Filtration",
      "Adjustable Ear Loops",
      "Soft Non-woven Fabric",
      "Suitable for Daily Use",
    ],
  },

  // ===== RAZOR / SHAVING KIT =====
  {
    category: "Health & Beauty",
    subCategory: "Men's Care", // child: Shaving & Grooming
    searchQuery: "razor shaving kit men grooming",
    brands: ["Gillette", "Bic", "Philips", "Bevel", "Park Avenue"],
    nameTemplates: [
      "{brand} Razor with Cartridges",
      "{brand} Shaving Cream & Razor Kit",
      "{brand} Disposable Razor Pack",
      "{brand} Grooming Kit",
    ],
    priceRange: [99, 1999],
    highlightsPool: ["Smooth shave", "Skin-friendly blades", "Best Price", "Complete grooming kit"],
    featuresPool: [
      "Sharp Stainless Steel Blades",
      "Ergonomic Non-slip Handle",
      "Suitable for Sensitive Skin",
      "Includes Shaving Cream/Gel",
    ],
  },

  // ===== HAIR DRYER / STRAIGHTENER =====
  {
    category: "Health & Beauty",
    subCategory: "Beauty Tools", // child: Hair Styling Appliances
    searchQuery: "hair dryer straightener styling tool",
    brands: ["Philips", "Havells", "Vega", "Nova", "Panasonic"],
    nameTemplates: [
      "{brand} Hair Dryer",
      "{brand} Hair Straightener",
      "{brand} Hair Curler",
      "{brand} Hair Styling Kit",
    ],
    priceRange: [499, 3499],
    highlightsPool: ["Fast styling", "Heat protection", "Best Price", "Lightweight design"],
    featuresPool: [
      "Ceramic Coated Plates",
      "Adjustable Heat Settings",
      "Cool Shot Button",
      "1-Year Manufacturer Warranty",
    ],
  },

  // ===== NAIL CARE KIT =====
  {
    category: "Health & Beauty",
    subCategory: "Makeup", // child: Nails
    searchQuery: "nail care manicure kit",
    brands: ["Vega", "Faces Canada", "Nova", "Kiro", "Lakme"],
    nameTemplates: [
      "{brand} Manicure Pedicure Kit",
      "{brand} Nail Clipper Set",
      "{brand} Nail Art Kit",
      "{brand} Professional Nail Care Set",
    ],
    priceRange: [149, 1499],
    highlightsPool: ["Complete grooming kit", "Stainless steel tools", "Best Price", "Travel case included"],
    featuresPool: [
      "Rust-resistant Stainless Steel",
      "Ergonomic Tool Grip",
      "Includes Storage Case",
      "Suitable for Home & Salon Use",
    ],
  },

  // ===== POWER STRIP / EXTENSION BOARD =====
  {
    category: "Home & Lifestyle",
    subCategory: "Tools, DIY & Outdoor", // child: Electrical
    searchQuery: "extension board power strip electrical",
    brands: ["Anchor", "Havells", "GM", "Philips", "Goldmedal"],
    nameTemplates: [
      "{brand} Extension Board 4-Socket",
      "{brand} Surge Protector Strip",
      "{brand} Power Strip with USB",
      "{brand} Multi-Plug Extension Cord",
    ],
    priceRange: [299, 1999],
    highlightsPool: ["Surge protection", "Multiple sockets", "Best Price", "Durable build"],
    featuresPool: [
      "Overload Protection",
      "Fire-resistant Material",
      "Long Power Cord",
      "1-Year Manufacturer Warranty",
    ],
  },

  // ===== LED BULBS / SMART LIGHTS =====
  {
    category: "Home & Lifestyle",
    subCategory: "Lighting", // child: Light Bulbs
    searchQuery: "led bulb smart light home",
    brands: ["Philips", "Syska", "Wipro", "Havells", "Mi"],
    nameTemplates: [
      "{brand} LED Bulb 9W",
      "{brand} Smart WiFi LED Bulb",
      "{brand} LED Tube Light",
      "{brand} Color Changing Smart Bulb",
    ],
    priceRange: [99, 1499],
    highlightsPool: ["Energy efficient", "Long lifespan", "Best Price", "Bright illumination"],
    featuresPool: [
      "Energy-saving LED Technology",
      "App-controlled (Smart Models)",
      "Long-lasting up to 25,000 Hours",
      "1-Year Manufacturer Warranty",
    ],
  },

  // ===== USB CABLES & CHARGERS =====
  {
    category: "Electronic Accessories",
    subCategory: "Mobile Accessories", // child: Cables & Converters
    searchQuery: "usb cable charger mobile accessories",
    brands: ["boAt", "Mi", "Samsung", "Portronics", "Ambrane"],
    nameTemplates: [
      "{brand} Fast Charging Cable",
      "{brand} USB Type-C Charger",
      "{brand} Multi-Pin Charging Cable",
      "{brand} 20W Fast Charger Adapter",
    ],
    priceRange: [149, 999],
    highlightsPool: ["Fast charging support", "Durable braided cable", "Best Price", "Universal compatibility"],
    featuresPool: [
      "Fast Charging up to 20W",
      "Tangle-free Braided Design",
      "Compatible with Multiple Devices",
      "1-Year Warranty",
    ],
  },

  // ===== MEMORY CARDS / PEN DRIVES =====
  {
    category: "Electronic Accessories",
    subCategory: "Storage", // child: Flash Drives
    searchQuery: "memory card pendrive storage",
    brands: ["SanDisk", "Samsung", "Kingston", "HP", "Strontium"],
    nameTemplates: [
      "{brand} 64GB Memory Card",
      "{brand} 32GB Pen Drive",
      "{brand} High-Speed microSD Card",
      "{brand} USB 3.0 Flash Drive",
    ],
    priceRange: [199, 1999],
    highlightsPool: ["High-speed transfer", "Reliable storage", "Best Price", "Compact design"],
    featuresPool: [
      "High-Speed Read/Write",
      "Shock & Water Resistant",
      "Compatible with Multiple Devices",
      "5-Year Manufacturer Warranty",
    ],
  },

  // ===== CAMERA TRIPOD =====
  {
    category: "Electronic Accessories",
    subCategory: "Camera Accessories", // child: Tripods & Monopods
    searchQuery: "camera tripod stand photography",
    brands: ["Simpex", "Digitek", "Manfrotto", "AmazonBasics", "Photron"],
    nameTemplates: [
      "{brand} Flexible Tripod Stand",
      "{brand} Camera Tripod with Phone Holder",
      "{brand} Portable Travel Tripod",
      "{brand} Professional Camera Tripod",
    ],
    priceRange: [299, 3999],
    highlightsPool: ["Sturdy & stable", "Lightweight & portable", "Best Price", "Adjustable height"],
    featuresPool: [
      "Adjustable Height & Angle",
      "Lightweight Aluminum Build",
      "Compatible with Phones & Cameras",
      "Foldable & Portable Design",
    ],
  },

  // ===== WEIGHING SCALE =====
  {
    category: "Health & Beauty",
    subCategory: "Medical Supplies", // child: Health Monitors & Tests
    searchQuery: "weighing scale digital health",
    brands: ["Dr. Trust", "Omron", "HealthSense", "Equinox", "Venus"],
    nameTemplates: [
      "{brand} Digital Weighing Scale",
      "{brand} Bathroom Weighing Scale",
      "{brand} Body Fat Analyzer Scale",
      "{brand} Smart Bluetooth Weighing Scale",
    ],
    priceRange: [499, 2999],
    highlightsPool: ["Accurate readings", "Sleek design", "Best Price", "Auto on/off"],
    featuresPool: [
      "High-precision Sensors",
      "LCD Digital Display",
      "Auto Calibration",
      "1-Year Manufacturer Warranty",
    ],
  },

  // ===== BLOOD PRESSURE MONITOR =====
  {
    category: "Health & Beauty",
    subCategory: "Medical Supplies", // child: Health Monitors & Tests
    searchQuery: "blood pressure monitor health device",
    brands: ["Omron", "Dr. Trust", "HealthSense", "BPL", "AccuSure"],
    nameTemplates: [
      "{brand} Digital BP Monitor",
      "{brand} Automatic Blood Pressure Monitor",
      "{brand} Upper Arm BP Monitor",
      "{brand} Wireless BP Monitor",
    ],
    priceRange: [899, 4999],
    highlightsPool: ["Accurate measurement", "Easy to use", "Best Price", "Large display"],
    featuresPool: [
      "Clinically Validated Accuracy",
      "Irregular Heartbeat Detection",
      "Memory Storage for Readings",
      "2-Year Manufacturer Warranty",
    ],
  },

  // ===== RESISTANCE BANDS =====
  {
    category: "Sports & Outdoor",
    subCategory: "Exercise & Fitness", // child: Exercise Bands
    searchQuery: "resistance bands fitness workout",
    brands: ["Strauss", "Kore", "Boldfit", "Fitsy", "AmazonBasics"],
    nameTemplates: [
      "{brand} Resistance Band Set",
      "{brand} Pull-Up Resistance Band",
      "{brand} Loop Resistance Bands",
      "{brand} Fitness Exercise Bands",
    ],
    priceRange: [149, 999],
    highlightsPool: ["Multiple resistance levels", "Portable & compact", "Best Price", "Durable latex"],
    featuresPool: [
      "High-quality Natural Latex",
      "Multiple Resistance Levels Included",
      "Suitable for Home & Gym Workouts",
      "Includes Carry Pouch",
    ],
  },

  // ===== SKIPPING ROPE =====
  {
    category: "Sports & Outdoor",
    subCategory: "Exercise & Fitness", // child: Cardio Training Equipment
    searchQuery: "skipping rope jump fitness",
    brands: ["Strauss", "Cosco", "Boldfit", "Nivia", "Kobo"],
    nameTemplates: [
      "{brand} Speed Skipping Rope",
      "{brand} Adjustable Jump Rope",
      "{brand} Weighted Skipping Rope",
      "{brand} Digital Counter Skipping Rope",
    ],
    priceRange: [99, 799],
    highlightsPool: ["Smooth rotation", "Adjustable length", "Best Price", "Durable cable"],
    featuresPool: [
      "Ball-bearing Smooth Rotation",
      "Adjustable Rope Length",
      "Comfortable Foam Handles",
      "Suitable for Cardio & Fitness",
    ],
  },

  // ===== PROTEIN POWDER / SUPPLEMENTS =====
  {
    category: "Sports & Outdoor",
    subCategory: "Supplements", // child: Proteins
    searchQuery: "protein powder supplement fitness",
    brands: ["MuscleBlaze", "Optimum Nutrition", "MyProtein", "Ultimate Nutrition", "GNC"],
    nameTemplates: [
      "{brand} Whey Protein Powder",
      "{brand} Mass Gainer Supplement",
      "{brand} Plant Protein Powder",
      "{brand} Protein Bar Pack",
    ],
    priceRange: [599, 4999],
    highlightsPool: ["High protein content", "Great taste", "Best Price", "Muscle recovery support"],
    featuresPool: [
      "High-quality Whey/Plant Protein",
      "No Added Sugar (Select Variants)",
      "Supports Muscle Recovery",
      "Available in Multiple Flavors",
    ],
  },

  // ===== BABY CARRIER / STROLLER =====
  {
    category: "Mother & Baby",
    subCategory: "Baby Gear", // child: Strollers / Backpacks & Carriers
    searchQuery: "baby carrier stroller infant",
    brands: ["Chicco", "LuvLap", "Mee Mee", "Baybee", "R for Rabbit"],
    nameTemplates: [
      "{brand} Baby Carrier",
      "{brand} Foldable Baby Stroller",
      "{brand} Travel System Stroller",
      "{brand} Ergonomic Baby Sling Carrier",
    ],
    priceRange: [999, 8999],
    highlightsPool: ["Ergonomic support", "Easy to fold", "Best Price", "Adjustable straps"],
    featuresPool: [
      "Ergonomic Hip-healthy Design",
      "Adjustable Padded Straps",
      "Lightweight Foldable Frame",
      "Suitable from Newborn to Toddler",
    ],
  },

  // ===== KIDS SCHOOL BAG =====
  {
    category: "Mother & Baby",
    subCategory: "Baby Gear", // child: Kids Bag
    searchQuery: "kids school bag backpack",
    brands: ["Skybags", "American Tourister", "Wildcraft", "Genie", "Disney"],
    nameTemplates: [
      "{brand} Kids School Backpack",
      "{brand} Printed School Bag",
      "{brand} Lightweight Kids Backpack",
      "{brand} Cartoon Character School Bag",
    ],
    priceRange: [399, 2499],
    highlightsPool: ["Spacious compartments", "Lightweight design", "Best Price", "Durable fabric"],
    featuresPool: [
      "Water-resistant Material",
      "Padded Shoulder Straps",
      "Multiple Compartments",
      "Ideal for Daily School Use",
    ],
  },

  // ===== BABY BATH TUB =====
  {
    category: "Mother & Baby",
    subCategory: "Baby Personal Care", // child: Bathing Tubs & Seats
    searchQuery: "baby bath tub infant care",
    brands: ["Chicco", "LuvLap", "Mee Mee", "Baybee", "Fisher-Price"],
    nameTemplates: [
      "{brand} Baby Bath Tub",
      "{brand} Foldable Bath Tub",
      "{brand} Bath Tub with Support Seat",
      "{brand} Anti-slip Baby Bath Tub",
    ],
    priceRange: [499, 2499],
    highlightsPool: ["Anti-slip base", "Comfortable support", "Best Price", "Easy to clean"],
    featuresPool: [
      "BPA-free Material",
      "Anti-slip Textured Base",
      "Ergonomic Support Design",
      "Foldable for Easy Storage",
    ],
  },

  // ===== KIDS WATER BOTTLE =====
  {
    category: "Mother & Baby",
    subCategory: "Feeding",
    searchQuery: "kids water bottle school",
    brands: ["Milton", "Cello", "Pigeon", "Disney", "Safari"],
    nameTemplates: [
      "{brand} Kids Insulated Water Bottle",
      "{brand} Cartoon Print Water Bottle",
      "{brand} Sipper Water Bottle for Kids",
      "{brand} Leak-proof School Bottle",
    ],
    priceRange: [99, 799],
    highlightsPool: ["Leak-proof design", "Fun cartoon prints", "Best Price", "Easy to carry"],
    featuresPool: [
      "BPA-free Food-grade Plastic",
      "Leak-proof Sipper Cap",
      "Lightweight & Easy Grip",
      "Ideal for School & Outings",
    ],
  },

  // ===== TRAVEL BAGS / SUITCASES =====
  {
    category: "Watches, Bags & Jewellery",
    subCategory: "Luggage & Suitcase",
    searchQuery: "travel suitcase luggage bag",
    brands: ["American Tourister", "Safari", "VIP", "Skybags", "Aristocrat"],
    nameTemplates: [
      "{brand} Hard Shell Suitcase",
      "{brand} Cabin Size Trolley Bag",
      "{brand} Soft Sided Travel Bag",
      "{brand} 4-Wheel Spinner Luggage",
    ],
    priceRange: [1499, 8999],
    highlightsPool: ["Durable build", "Spacious storage", "Best Price", "Smooth wheels"],
    featuresPool: [
      "Impact-resistant Polycarbonate Shell",
      "360° Smooth Spinner Wheels",
      "TSA-approved Lock",
      "Multiple Compartments",
    ],
  },

  // ===== WALL CLOCKS =====
  {
    category: "Home & Lifestyle",
    subCategory: "Decor", // child: Clocks
    searchQuery: "wall clock home decor",
    brands: ["Ajanta", "Titan", "Blacksmith", "Fandeliers", "HomeSage"],
    nameTemplates: [
      "{brand} Analog Wall Clock",
      "{brand} Wooden Wall Clock",
      "{brand} Silent Sweep Wall Clock",
      "{brand} Decorative Wall Clock",
    ],
    priceRange: [199, 1999],
    highlightsPool: ["Elegant design", "Silent movement", "Best Price", "Easy to install"],
    featuresPool: [
      "Silent Sweep Movement",
      "High-quality Quartz Mechanism",
      "Lightweight & Easy to Mount",
      "Durable Finish",
    ],
  },

  // ===== PHOTO FRAMES =====
  {
    category: "Home & Lifestyle",
    subCategory: "Decor", // child: Picture Frames
    searchQuery: "photo frame wall decor",
    brands: ["HomeSage", "Art Street", "WENS", "Kartik Crafts"],
    nameTemplates: [
      "{brand} Wooden Photo Frame",
      "{brand} Collage Photo Frame Set",
      "{brand} Wall Hanging Photo Frame",
      "{brand} Table Top Photo Frame",
    ],
    priceRange: [149, 1499],
    highlightsPool: ["Elegant design", "Sturdy build", "Best Price", "Perfect for gifting"],
    featuresPool: [
      "Premium Wooden/Acrylic Finish",
      "Scratch-resistant Glass",
      "Easy Wall Mounting",
      "Available in Multiple Sizes",
    ],
  },

  // ===== STUDY TABLE LAMP =====
  {
    category: "Home & Lifestyle",
    subCategory: "Lighting", // child: Table Lamps
    searchQuery: "study lamp table light",
    brands: ["Philips", "Havells", "Wipro", "Syska", "Eveready"],
    nameTemplates: [
      "{brand} LED Study Table Lamp",
      "{brand} Rechargeable Table Lamp",
      "{brand} Adjustable Desk Lamp",
      "{brand} Eye-Care Study Lamp",
    ],
    priceRange: [299, 1999],
    highlightsPool: ["Eye-care lighting", "Adjustable brightness", "Best Price", "Energy efficient"],
    featuresPool: [
      "Flicker-free LED Lighting",
      "Adjustable Arm & Brightness",
      "USB Rechargeable (Select Models)",
      "1-Year Manufacturer Warranty",
    ],
  },
];

// Fetches up to 30 photos per sub-category using a SINGLE Unsplash request
// (Unsplash's max per_page is 30 anyway). If Unsplash returns a rate limit
// error, we retry a couple of times with an increasing delay before giving
// up and letting the caller fall back to a placeholder image.
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
      const waitMs = 5000 * (3 - retries); // 5s, then 10s
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

    for (const [index, config] of subCategoryConfigs.entries()) {
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

      if (index < subCategoryConfigs.length - 1) {
        await sleep(2000);
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

    console.log(`\n🎉 Done! ${totalCreated} products created.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seed();