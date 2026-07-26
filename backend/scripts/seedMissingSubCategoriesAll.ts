// src/scripts/seedMissingSubCategoriesAll.ts
//
// Combined script — rendu batch-oda missing subCategory configs-um
// (Mobiles/Laptops/Furniture/Beauty/etc. + Electronic Accessories/
// TV & Appliances/Fashion/etc.) oru array-la merge pannirukom.
// category/subCategory strings frontend categories.ts-oda exact match
// aaganum, so idha rename pannadha.

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

// ===== BATCH 1 (Mobiles, Laptops, Furniture, Beauty, Personal Care,
// Gaming, Groceries, Home & Kitchen) =====
const batch1Configs: SubCategoryConfig[] = [
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

// ===== BATCH 2 (Electronic Accessories, TV & Home Appliances,
// Health & Beauty, Mother & Baby, Electronic Devices, Groceries & Pets,
// Home & Lifestyle, Women's/Men's Fashion, Watches Bags & Jewellery,
// Sports & Outdoor, Automotive & Motorbike) =====
const batch2Configs: SubCategoryConfig[] = [
  {
    category: "Electronic Accessories",
    subCategory: "Wearable",
    searchQuery: "fitness tracker wearable band",
    brands: ["Mi", "Noise", "boAt", "Fire-Boltt", "Realme"],
    nameTemplates: [
      "{brand} Fitness Band",
      "{brand} Activity Tracker",
      "{brand} Smart Fitness Band",
      "{brand} Heart Rate Tracker Band",
    ],
    priceRange: [999, 3999],
    highlightsPool: ["Heart rate monitor", "Step counter", "Best Price", "Water resistant"],
    featuresPool: [
      "24/7 Heart Rate Monitoring",
      "Sleep Tracking",
      "7-Day Battery Life",
      "IP68 Water Resistant",
    ],
  },
  {
    category: "Electronic Accessories",
    subCategory: "Network Components",
    searchQuery: "wifi router access point network",
    brands: ["TP-Link", "D-Link", "Netgear", "Tenda", "Mercusys"],
    nameTemplates: [
      "{brand} WiFi Access Point",
      "{brand} Wireless Router",
      "{brand} Dual Band Router",
      "{brand} Mesh WiFi Extender",
    ],
    priceRange: [999, 5999],
    highlightsPool: ["Wide coverage", "Fast speed", "Best Price", "Easy setup"],
    featuresPool: [
      "Dual Band 2.4GHz & 5GHz",
      "Up to 300Mbps Speed",
      "Multiple LAN Ports",
      "1-Year Manufacturer Warranty",
    ],
  },
  {
    category: "Electronic Accessories",
    subCategory: "Computer Components",
    searchQuery: "computer motherboard processor hardware",
    brands: ["ASUS", "MSI", "Gigabyte", "Intel", "AMD"],
    nameTemplates: [
      "{brand} Motherboard",
      "{brand} Processor Cooling Fan",
      "{brand} Graphics Card",
      "{brand} Desktop Cabinet",
    ],
    priceRange: [1999, 24999],
    highlightsPool: ["High performance", "Stable build", "Best Price", "Gaming ready"],
    featuresPool: [
      "Supports Latest Chipsets",
      "Enhanced Cooling Design",
      "Durable PCB Build",
      "3-Year Manufacturer Warranty",
    ],
  },
  {
    category: "Electronic Accessories",
    subCategory: "Printers",
    searchQuery: "printer inkjet laser office",
    brands: ["HP", "Canon", "Epson", "Brother", "Samsung"],
    nameTemplates: [
      "{brand} Inkjet Printer",
      "{brand} Laser Printer",
      "{brand} All-in-One Printer",
      "{brand} Wireless Printer",
    ],
    priceRange: [3999, 19999],
    highlightsPool: ["Fast printing", "High resolution", "Best Price", "Wireless connectivity"],
    featuresPool: [
      "Wireless & USB Connectivity",
      "High-quality Print Resolution",
      "Compact Design",
      "1-Year Manufacturer Warranty",
    ],
  },
  {
    category: "Electronic Accessories",
    subCategory: "Monitors & Accessories",
    searchQuery: "computer monitor screen display",
    brands: ["Samsung", "LG", "Dell", "Acer", "BenQ"],
    nameTemplates: [
      "{brand} Full HD Monitor",
      "{brand} Curved Gaming Monitor",
      "{brand} 24-inch LED Monitor",
      "{brand} IPS Display Monitor",
    ],
    priceRange: [6999, 34999],
    highlightsPool: ["Vivid colors", "Wide viewing angle", "Best Price", "Eye care technology"],
    featuresPool: [
      "Full HD/QHD Resolution",
      "Flicker-free Eye Care",
      "HDMI & VGA Ports",
      "3-Year Manufacturer Warranty",
    ],
  },
  {
    category: "TV & Home Appliances",
    subCategory: "Vacuums & Floor Care",
    searchQuery: "vacuum cleaner home appliance",
    brands: ["Eureka Forbes", "Philips", "Kent", "Black+Decker", "Xiaomi"],
    nameTemplates: [
      "{brand} Vacuum Cleaner",
      "{brand} Robotic Vacuum Cleaner",
      "{brand} Handheld Vacuum Cleaner",
      "{brand} Wet & Dry Vacuum Cleaner",
    ],
    priceRange: [2999, 24999],
    highlightsPool: ["Powerful suction", "Compact design", "Best Price", "Easy to maneuver"],
    featuresPool: [
      "High-power Suction Motor",
      "HEPA Filtration",
      "Lightweight & Portable",
      "1-Year Manufacturer Warranty",
    ],
  },
  {
    category: "TV & Home Appliances",
    subCategory: "Home Audio & Theater",
    searchQuery: "home theater speaker system",
    brands: ["Sony", "JBL", "Bose", "Philips", "Zebronics"],
    nameTemplates: [
      "{brand} Home Theater System",
      "{brand} Soundbar with Subwoofer",
      "{brand} 5.1 Channel Speaker System",
      "{brand} Bluetooth Home Theater",
    ],
    priceRange: [3999, 29999],
    highlightsPool: ["Immersive sound", "Deep bass", "Best Price", "Easy connectivity"],
    featuresPool: [
      "Dolby Digital Surround Sound",
      "Bluetooth & HDMI Connectivity",
      "Powerful Subwoofer",
      "1-Year Manufacturer Warranty",
    ],
  },
  {
    category: "TV & Home Appliances",
    subCategory: "Televisions",
    searchQuery: "smart tv led television",
    brands: ["Samsung", "LG", "Sony", "Mi", "TCL"],
    nameTemplates: [
      "{brand} 43-inch Smart LED TV",
      "{brand} 4K Ultra HD Smart TV",
      "{brand} Android Smart TV",
      "{brand} Full HD LED Television",
    ],
    priceRange: [14999, 79999],
    highlightsPool: ["Vivid picture quality", "Smart features", "Best Price", "Slim design"],
    featuresPool: [
      "4K Ultra HD Resolution",
      "Built-in Smart OS & Apps",
      "Multiple HDMI/USB Ports",
      "1-Year Manufacturer Warranty",
    ],
  },
  {
    category: "TV & Home Appliances",
    subCategory: "Projectors & Players",
    searchQuery: "projector home theater device",
    brands: ["Epson", "BenQ", "Sony", "ViewSonic", "Xiaomi"],
    nameTemplates: [
      "{brand} Mini Projector",
      "{brand} Full HD Home Projector",
      "{brand} Portable LED Projector",
      "{brand} Smart Android Projector",
    ],
    priceRange: [4999, 39999],
    highlightsPool: ["Bright display", "Large screen size", "Best Price", "Portable design"],
    featuresPool: [
      "Full HD/4K Supported",
      "Built-in Speaker",
      "HDMI & USB Connectivity",
      "1-Year Manufacturer Warranty",
    ],
  },
  {
    category: "TV & Home Appliances",
    subCategory: "Generator, UPS & Solar",
    searchQuery: "ups inverter power backup",
    brands: ["Luminous", "APC", "Microtek", "Su-Kam", "V-Guard"],
    nameTemplates: [
      "{brand} Home UPS Inverter",
      "{brand} Solar Inverter System",
      "{brand} Portable Generator",
      "{brand} Sine Wave UPS",
    ],
    priceRange: [4999, 49999],
    highlightsPool: ["Reliable backup", "Long-lasting battery", "Best Price", "Silent operation"],
    featuresPool: [
      "Pure Sine Wave Output",
      "Automatic Voltage Regulation",
      "Overload Protection",
      "2-Year Manufacturer Warranty",
    ],
  },
  {
    category: "Health & Beauty",
    subCategory: "Sexual Wellness",
    searchQuery: "personal wellness health product",
    brands: ["Durex", "Manforce", "Kamasutra", "Skore"],
    nameTemplates: [
      "{brand} Condoms Pack",
      "{brand} Lubricant Gel",
      "{brand} Ultra Thin Condoms Pack",
      "{brand} Personal Lubricant",
    ],
    priceRange: [99, 599],
    highlightsPool: ["Dermatologically tested", "Discreet packaging", "Best Price", "Pack of 3/10"],
    featuresPool: [
      "Dermatologically Tested",
      "Discreet & Secure Packaging",
      "Smooth & Comfortable",
      "Quality Assured",
    ],
  },
  {
    category: "Mother & Baby",
    subCategory: "Clothing & Accessories",
    searchQuery: "newborn baby clothes set",
    brands: ["Mothercare", "Chicco", "Baby Studio", "Mee Mee", "First Cry"],
    nameTemplates: [
      "{brand} Newborn Baby Bodysuit Set",
      "{brand} Infant Clothing Combo",
      "{brand} Baby Romper Set",
      "{brand} Newborn Cap & Mittens Set",
    ],
    priceRange: [299, 1999],
    highlightsPool: ["Soft cotton fabric", "Gentle on skin", "Best Price", "Easy to wear"],
    featuresPool: [
      "100% Soft Cotton",
      "Snap Button Closure",
      "Breathable Fabric",
      "Suitable for 0-6 Months",
    ],
  },
  {
    category: "Mother & Baby",
    subCategory: "Maternity Care",
    searchQuery: "maternity wear pregnancy clothes",
    brands: ["Mothercare", "Momsoon", "Wobbly Walk", "Nine Maternity"],
    nameTemplates: [
      "{brand} Maternity Feeding Wear",
      "{brand} Pregnancy Support Belt",
      "{brand} Maternity Nursing Bra",
      "{brand} Maternity Comfort Dress",
    ],
    priceRange: [399, 2999],
    highlightsPool: ["Comfortable fit", "Stretchable fabric", "Best Price", "Nursing friendly"],
    featuresPool: [
      "Soft Stretchable Fabric",
      "Nursing-friendly Design",
      "Adjustable Fit",
      "Breathable Material",
    ],
  },
  {
    category: "Mother & Baby",
    subCategory: "Milk Formula & Baby Food",
    searchQuery: "baby formula milk powder infant food",
    brands: ["Nestle", "Similac", "Nan Pro", "Enfamil", "Lactogen"],
    nameTemplates: [
      "{brand} Infant Formula Milk Powder",
      "{brand} Toddler Growing-up Milk",
      "{brand} Baby Cereal Food",
      "{brand} Nutritional Follow-up Formula",
    ],
    priceRange: [399, 1999],
    highlightsPool: ["Nutrient rich", "Easy to digest", "Best Price", "Doctor recommended"],
    featuresPool: [
      "Fortified with Essential Nutrients",
      "Easy to Digest Formula",
      "No Added Preservatives",
      "Suitable as per Age Group",
    ],
  },
  {
    category: "Mother & Baby",
    subCategory: "Nursery",
    searchQuery: "baby crib nursery furniture",
    brands: ["Mothercare", "LuvLap", "R for Rabbit", "Baybee", "Wonder Kids"],
    nameTemplates: [
      "{brand} Baby Crib",
      "{brand} Nursery Storage Organizer",
      "{brand} Baby Cot with Mattress",
      "{brand} Nursery Decor Set",
    ],
    priceRange: [1999, 14999],
    highlightsPool: ["Sturdy build", "Safe for baby", "Best Price", "Space saving"],
    featuresPool: [
      "Non-toxic Paint Finish",
      "Sturdy Wooden/Metal Frame",
      "Adjustable Height Settings",
      "1-Year Manufacturer Warranty",
    ],
  },
  {
    category: "Mother & Baby",
    subCategory: "Sports & Outdoor Play",
    searchQuery: "kids swimming pool inflatable toy",
    brands: ["Intex", "Bestway", "Funskool", "Baybee", "Ching Ching"],
    nameTemplates: [
      "{brand} Kids Inflatable Pool",
      "{brand} Water Play Toy Set",
      "{brand} Inflatable Bouncer",
      "{brand} Kids Fidget Spinner Toy",
    ],
    priceRange: [299, 3999],
    highlightsPool: ["Fun outdoor play", "Durable material", "Best Price", "Easy to inflate"],
    featuresPool: [
      "Puncture-resistant Material",
      "Easy Inflate & Deflate",
      "Safe for Outdoor Play",
      "Suitable for Ages 3+",
    ],
  },
  {
    category: "Mother & Baby",
    subCategory: "Baby & Toddler Toys",
    searchQuery: "baby toddler educational toy",
    brands: ["Fisher-Price", "Chicco", "VTech", "Funskool", "LuvLap"],
    nameTemplates: [
      "{brand} Baby Activity Gym",
      "{brand} Musical Rattle Toy",
      "{brand} Stacking Blocks Toy",
      "{brand} Early Learning Toy Set",
    ],
    priceRange: [199, 2499],
    highlightsPool: ["Safe for babies", "Sensory development", "Best Price", "Colorful design"],
    featuresPool: [
      "Non-toxic BPA-free Material",
      "Boosts Sensory & Motor Skills",
      "Bright Colors & Sounds",
      "Suitable for 0-3 Years",
    ],
  },
  {
    category: "Electronic Devices",
    subCategory: "Daraz Like New",
    searchQuery: "refurbished smartphone used electronics",
    brands: ["Samsung", "Apple", "OnePlus", "Xiaomi", "Realme"],
    nameTemplates: [
      "{brand} Like New Smartphone",
      "{brand} Refurbished Laptop",
      "{brand} Like New Smartwatch",
      "{brand} Certified Refurbished Tablet",
    ],
    priceRange: [4999, 49999],
    highlightsPool: ["Certified refurbished", "Tested & inspected", "Best Price", "Great condition"],
    featuresPool: [
      "Quality Checked & Certified",
      "Includes Warranty Period",
      "Fully Functional Tested",
      "Significant Savings vs New",
    ],
  },
  {
    category: "Electronic Devices",
    subCategory: "Security Cameras",
    searchQuery: "cctv security camera surveillance",
    brands: ["CP Plus", "Hikvision", "Mi", "TP-Link", "D-Link"],
    nameTemplates: [
      "{brand} IP Security Camera",
      "{brand} Wireless CCTV Camera",
      "{brand} Smart Home Security Camera",
      "{brand} Outdoor Surveillance Camera",
    ],
    priceRange: [1499, 8999],
    highlightsPool: ["Night vision", "Motion detection", "Best Price", "Remote monitoring"],
    featuresPool: [
      "Full HD Night Vision",
      "Motion Detection Alerts",
      "Two-way Audio Support",
      "1-Year Manufacturer Warranty",
    ],
  },
  {
    category: "Electronic Devices",
    subCategory: "Cameras & Drones",
    searchQuery: "drone camera aerial photography",
    brands: ["DJI", "Syma", "Hubsan", "Holy Stone", "Snaptain"],
    nameTemplates: [
      "{brand} Camera Drone",
      "{brand} Foldable Mini Drone",
      "{brand} 4K HD Drone",
      "{brand} Beginner Quadcopter Drone",
    ],
    priceRange: [2999, 49999],
    highlightsPool: ["Stable flight", "HD camera", "Best Price", "Easy to control"],
    featuresPool: [
      "4K/HD Camera Onboard",
      "GPS Return-to-Home",
      "Long Flight Time",
      "Beginner-friendly Controls",
    ],
  },
  {
    category: "Electronic Devices",
    subCategory: "Smart Watches",
    searchQuery: "smart watch wearable device",
    brands: ["Noise", "boAt", "Fire-Boltt", "Samsung", "Apple"],
    nameTemplates: [
      "{brand} Smart Watch",
      "{brand} Bluetooth Calling Smartwatch",
      "{brand} Fitness Smart Watch",
      "{brand} AMOLED Display Smart Watch",
    ],
    priceRange: [1499, 24999],
    highlightsPool: ["Bluetooth calling", "Fitness tracking", "Best Price", "Long battery life"],
    featuresPool: [
      "Bluetooth Calling Support",
      "Heart Rate & SpO2 Monitor",
      "Multiple Watch Faces",
      "1-Year Manufacturer Warranty",
    ],
  },
  {
    category: "Electronic Devices",
    subCategory: "Monitors",
    searchQuery: "desktop computer monitor screen",
    brands: ["Dell", "HP", "Samsung", "LG", "Acer"],
    nameTemplates: [
      "{brand} Full HD Computer Monitor",
      "{brand} Widescreen LED Monitor",
      "{brand} Gaming Monitor 144Hz",
      "{brand} Business Display Monitor",
    ],
    priceRange: [7999, 39999],
    highlightsPool: ["Crisp display", "Wide color range", "Best Price", "Adjustable stand"],
    featuresPool: [
      "Full HD/QHD Resolution",
      "High Refresh Rate (Select Models)",
      "Multiple Connectivity Ports",
      "3-Year Manufacturer Warranty",
    ],
  },
  {
    category: "Electronic Devices",
    subCategory: "Landline Phones",
    searchQuery: "landline telephone office home",
    brands: ["Panasonic", "Beetel", "Gigaset", "Uniden"],
    nameTemplates: [
      "{brand} Cordless Landline Phone",
      "{brand} Corded Telephone",
      "{brand} Landline Phone with Caller ID",
      "{brand} Office Desk Telephone",
    ],
    priceRange: [699, 3999],
    highlightsPool: ["Clear call quality", "Caller ID support", "Best Price", "Easy to use"],
    featuresPool: [
      "Caller ID & Call Waiting",
      "Backlit Display",
      "Hands-free Speakerphone",
      "1-Year Manufacturer Warranty",
    ],
  },
  {
    category: "Electronic Devices",
    subCategory: "Desktops",
    searchQuery: "desktop computer all in one pc",
    brands: ["HP", "Dell", "Lenovo", "Apple", "Acer"],
    nameTemplates: [
      "{brand} All-in-One Desktop PC",
      "{brand} Desktop Computer Intel i5",
      "{brand} Business Desktop PC",
      "{brand} Gaming Desktop Tower",
    ],
    priceRange: [24999, 89999],
    highlightsPool: ["Fast performance", "Sleek design", "Best Price", "Reliable build"],
    featuresPool: [
      "Latest Gen Processor",
      "SSD Storage Included",
      "Compact All-in-One Design",
      "1-Year Manufacturer Warranty",
    ],
  },
  {
    category: "Groceries & Pets",
    subCategory: "Frozen Food",
    searchQuery: "frozen food chicken meat packet",
    brands: ["Godrej Yummiez", "Venky's", "ITC", "Al Kabeer", "Suguna"],
    nameTemplates: [
      "{brand} Frozen Chicken Nuggets",
      "{brand} Frozen Paratha Pack",
      "{brand} Frozen Vegetable Mix",
      "{brand} Frozen Meat Pack",
    ],
    priceRange: [99, 599],
    highlightsPool: ["Ready to cook", "Long shelf life", "Best Price", "Convenient packaging"],
    featuresPool: [
      "Flash Frozen for Freshness",
      "No Added Preservatives",
      "Quick & Easy to Cook",
      "Hygienically Packed",
    ],
  },
  {
    category: "Groceries & Pets",
    subCategory: "Dog",
    searchQuery: "dog food toys pet supplies",
    brands: ["Pedigree", "Royal Canin", "Drools", "Himalaya", "Purepet"],
    nameTemplates: [
      "{brand} Dog Food Pack",
      "{brand} Dog Chew Toy",
      "{brand} Dog Grooming Kit",
      "{brand} Dog Leash & Collar Set",
    ],
    priceRange: [149, 2999],
    highlightsPool: ["Balanced nutrition", "Durable material", "Best Price", "Vet recommended"],
    featuresPool: [
      "Complete & Balanced Nutrition",
      "Suitable for All Breeds",
      "Durable Chew-resistant Material",
      "Vet Recommended Formula",
    ],
  },
  {
    category: "Groceries & Pets",
    subCategory: "Cat",
    searchQuery: "cat food toys pet supplies",
    brands: ["Whiskas", "Royal Canin", "Me-O", "Purina", "Sheba"],
    nameTemplates: [
      "{brand} Cat Food Pack",
      "{brand} Cat Litter Box",
      "{brand} Cat Toy Set",
      "{brand} Cat Grooming Brush",
    ],
    priceRange: [99, 1999],
    highlightsPool: ["Balanced nutrition", "Cats love it", "Best Price", "Easy to use"],
    featuresPool: [
      "Complete & Balanced Nutrition",
      "Suitable for All Life Stages",
      "Easy Clean-up Design",
      "Vet Recommended Formula",
    ],
  },
  {
    category: "Groceries & Pets",
    subCategory: "Fish",
    searchQuery: "aquarium fish tank supplies",
    brands: ["Boyu", "Sobo", "Venus", "Optima", "Resun"],
    nameTemplates: [
      "{brand} Aquarium Fish Tank",
      "{brand} Aquarium Filter",
      "{brand} Fish Food Pack",
      "{brand} Aquarium LED Light",
    ],
    priceRange: [299, 6999],
    highlightsPool: ["Crystal clear design", "Easy maintenance", "Best Price", "Complete setup"],
    featuresPool: [
      "Durable Acrylic/Glass Build",
      "Efficient Filtration System",
      "LED Lighting Included",
      "Easy to Clean & Maintain",
    ],
  },
  {
    category: "Home & Lifestyle",
    subCategory: "Laundry & Cleaning",
    searchQuery: "broom mop cleaning tools home",
    brands: ["Gala", "Scotch-Brite", "Spotzero", "Livpure", "Bathla"],
    nameTemplates: [
      "{brand} Spin Mop with Bucket",
      "{brand} Floor Wiper",
      "{brand} Cleaning Broom",
      "{brand} Microfiber Mop Set",
    ],
    priceRange: [199, 1999],
    highlightsPool: ["Easy to use", "Durable build", "Best Price", "Effective cleaning"],
    featuresPool: [
      "360° Spin Technology",
      "Microfiber Cleaning Pads",
      "Lightweight & Easy to Store",
      "Long-lasting Build Quality",
    ],
  },
  {
    category: "Home & Lifestyle",
    subCategory: "Bath",
    searchQuery: "bath towel bathroom accessories",
    brands: ["Bombay Dyeing", "Spaces", "Trident", "Story@Home"],
    nameTemplates: [
      "{brand} Cotton Bath Towel",
      "{brand} Bathroom Bath Mat",
      "{brand} Towel Rail Holder",
      "{brand} Bathrobe Set",
    ],
    priceRange: [199, 1999],
    highlightsPool: ["Soft & absorbent", "Quick dry", "Best Price", "Durable fabric"],
    featuresPool: [
      "100% Cotton Material",
      "High Absorbency",
      "Quick-dry Technology",
      "Machine Washable",
    ],
  },
  {
    category: "Women's Fashion",
    subCategory: "Girls Shoes",
    searchQuery: "girls shoes kids sandals sneakers",
    brands: ["Bata", "Liberty", "Campus", "Kittens", "Force 10"],
    nameTemplates: [
      "{brand} Girls Casual Sneakers",
      "{brand} Girls Sandals",
      "{brand} Girls School Shoes",
      "{brand} Girls Party Wear Shoes",
    ],
    priceRange: [299, 1999],
    highlightsPool: ["Comfortable fit", "Durable sole", "Best Price", "Stylish design"],
    featuresPool: [
      "Lightweight & Comfortable",
      "Anti-skid Sole",
      "Durable Build Quality",
      "Available in Multiple Sizes",
    ],
  },
  {
    category: "Women's Fashion",
    subCategory: "Sleepwear & Innerwear",
    searchQuery: "women nightwear sleepwear pajama",
    brands: ["Clovia", "Zivame", "Enamor", "Amante", "Jockey"],
    nameTemplates: [
      "{brand} Women's Nightsuit Set",
      "{brand} Cotton Nightdress",
      "{brand} Pajama Set",
      "{brand} Loungewear Set",
    ],
    priceRange: [299, 1999],
    highlightsPool: ["Soft & comfortable", "Breathable fabric", "Best Price", "Everyday wear"],
    featuresPool: [
      "Soft Cotton/Rayon Blend",
      "Breathable & Skin-friendly",
      "Elastic Waistband",
      "Machine Washable",
    ],
  },
  {
    category: "Women's Fashion",
    subCategory: "Pants, Jeans & Leggings",
    searchQuery: "women jeans pants leggings",
    brands: ["Levis", "Only", "Vero Moda", "AND", "W"],
    nameTemplates: [
      "{brand} Women's Skinny Jeans",
      "{brand} High Waist Jeans",
      "{brand} Stretchable Leggings",
      "{brand} Straight Fit Trousers",
    ],
    priceRange: [499, 3499],
    highlightsPool: ["Comfortable stretch", "Trendy fit", "Best Price", "Durable denim"],
    featuresPool: [
      "Stretchable Denim/Fabric",
      "High-waist Comfortable Fit",
      "Machine Washable",
      "Available in Multiple Sizes",
    ],
  },
  {
    category: "Women's Fashion",
    subCategory: "Tops",
    searchQuery: "women tops blouse shirt casual",
    brands: ["Only", "Vero Moda", "AND", "Global Desi", "Forever 21"],
    nameTemplates: [
      "{brand} Casual Top",
      "{brand} Formal Blouse",
      "{brand} Printed Tunic Top",
      "{brand} Sleeveless Top",
    ],
    priceRange: [299, 1999],
    highlightsPool: ["Trendy design", "Comfortable fit", "Best Price", "Versatile styling"],
    featuresPool: [
      "Breathable Fabric",
      "Regular Fit Design",
      "Machine Washable",
      "Available in Multiple Colors",
    ],
  },
  {
    category: "Men's Fashion",
    subCategory: "Kurtas & Shalwar Kameez",
    searchQuery: "men kurta ethnic wear shalwar kameez",
    brands: ["Manyavar", "Fabindia", "Peter England", "Levi's", "Khadi India"],
    nameTemplates: [
      "{brand} Men's Cotton Kurta",
      "{brand} Shalwar Kameez Set",
      "{brand} Festive Kurta Pajama Set",
      "{brand} Ethnic Wear Kurta",
    ],
    priceRange: [499, 2999],
    highlightsPool: ["Comfortable fit", "Festive design", "Best Price", "Breathable fabric"],
    featuresPool: [
      "Breathable Cotton Fabric",
      "Regular Fit Design",
      "Machine Washable",
      "Ideal for Festive Occasions",
    ],
  },
  {
    category: "Men's Fashion",
    subCategory: "Winter Clothing",
    searchQuery: "men winter jacket sweatshirt hoodie",
    brands: ["Woodland", "Levi's", "Puma", "Roadster", "US Polo"],
    nameTemplates: [
      "{brand} Men's Winter Jacket",
      "{brand} Hoodie Sweatshirt",
      "{brand} Puffer Jacket",
      "{brand} Fleece Sweatshirt",
    ],
    priceRange: [799, 4999],
    highlightsPool: ["Warm & cozy", "Windproof design", "Best Price", "Stylish fit"],
    featuresPool: [
      "Insulated for Warmth",
      "Windproof & Water-resistant",
      "Regular Fit Design",
      "Machine Washable",
    ],
  },
  {
    category: "Men's Fashion",
    subCategory: "Shorts, Joggers & Sweats",
    searchQuery: "men joggers shorts sweatpants",
    brands: ["Puma", "Nike", "Adidas", "Roadster", "HRX"],
    nameTemplates: [
      "{brand} Men's Jogger Pants",
      "{brand} Casual Shorts",
      "{brand} Sweatpants",
      "{brand} Track Pants",
    ],
    priceRange: [399, 2499],
    highlightsPool: ["Comfortable fit", "Breathable fabric", "Best Price", "Everyday wear"],
    featuresPool: [
      "Stretchable Comfortable Fabric",
      "Elastic Waistband with Drawstring",
      "Machine Washable",
      "Available in Multiple Sizes",
    ],
  },
  {
    category: "Men's Fashion",
    subCategory: "T-Shirts & Tanks",
    searchQuery: "men t-shirt tank top casual",
    brands: ["Puma", "Nike", "Adidas", "Roadster", "US Polo"],
    nameTemplates: [
      "{brand} Men's Round Neck T-Shirt",
      "{brand} Polo T-Shirt",
      "{brand} Tank Top",
      "{brand} Graphic Print T-Shirt",
    ],
    priceRange: [299, 1999],
    highlightsPool: ["Soft cotton fabric", "Comfortable fit", "Best Price", "Everyday casual wear"],
    featuresPool: [
      "100% Cotton Material",
      "Regular Fit Design",
      "Machine Washable",
      "Available in Multiple Colors",
    ],
  },
  {
    category: "Men's Fashion",
    subCategory: "Boy's Accessories",
    searchQuery: "boys kids accessories belt cap",
    brands: ["Fastrack", "Wildcraft", "US Polo", "Allen Solly"],
    nameTemplates: [
      "{brand} Boy's Belt",
      "{brand} Kids Cap",
      "{brand} Boy's Socks Pack",
      "{brand} Kids Sunglasses",
    ],
    priceRange: [99, 999],
    highlightsPool: ["Durable build", "Comfortable fit", "Best Price", "Fun design"],
    featuresPool: [
      "Durable & Skin-friendly Material",
      "Adjustable Fit",
      "Fun Prints & Colors",
      "Suitable for Daily Use",
    ],
  },
  {
    category: "Men's Fashion",
    subCategory: "Pants & Jeans",
    searchQuery: "men jeans formal pants trousers",
    brands: ["Levi's", "Wrangler", "Peter England", "Louis Philippe", "Pepe Jeans"],
    nameTemplates: [
      "{brand} Men's Slim Fit Jeans",
      "{brand} Formal Trousers",
      "{brand} Straight Fit Jeans",
      "{brand} Chino Pants",
    ],
    priceRange: [699, 3999],
    highlightsPool: ["Comfortable fit", "Durable denim", "Best Price", "Versatile styling"],
    featuresPool: [
      "Durable Denim/Cotton Fabric",
      "Slim/Regular Fit Options",
      "Machine Washable",
      "Available in Multiple Sizes",
    ],
  },
  {
    category: "Watches, Bags & Jewellery",
    subCategory: "Women's Watches",
    searchQuery: "women wrist watch fashion",
    brands: ["Titan", "Fastrack", "Casio", "Fossil", "Daniel Wellington"],
    nameTemplates: [
      "{brand} Women's Analog Watch",
      "{brand} Rose Gold Watch",
      "{brand} Women's Chain Strap Watch",
      "{brand} Women's Digital Watch",
    ],
    priceRange: [599, 7999],
    highlightsPool: ["Elegant design", "Water resistant", "Best Price", "Comfortable strap"],
    featuresPool: [
      "Scratch-resistant Glass",
      "Adjustable Strap",
      "Water Resistant up to 30m",
      "1-Year Manufacturer Warranty",
    ],
  },
  {
    category: "Watches, Bags & Jewellery",
    subCategory: "Kid's Watches",
    searchQuery: "kids watch children wrist",
    brands: ["Titan", "Fastrack", "Disney", "Zoop", "Casio"],
    nameTemplates: [
      "{brand} Kid's Analog Watch",
      "{brand} Cartoon Character Watch",
      "{brand} Kid's Digital Watch",
      "{brand} Kid's Sports Watch",
    ],
    priceRange: [299, 1999],
    highlightsPool: ["Fun design", "Durable build", "Best Price", "Easy to read"],
    featuresPool: [
      "Shockproof Build",
      "Adjustable Strap",
      "Water Resistant",
      "1-Year Manufacturer Warranty",
    ],
  },
  {
    category: "Watches, Bags & Jewellery",
    subCategory: "Mens Jewellery",
    searchQuery: "men jewellery chain bracelet",
    brands: ["Voylla", "Giva", "Sukkhi", "Zaveri Pearls"],
    nameTemplates: [
      "{brand} Men's Chain",
      "{brand} Men's Bracelet",
      "{brand} Men's Ring",
      "{brand} Men's Stud Earrings",
    ],
    priceRange: [299, 3999],
    highlightsPool: ["Sturdy build", "Stylish finish", "Best Price", "Skin friendly"],
    featuresPool: [
      "Anti-tarnish Coating",
      "Nickel-free Material",
      "Sturdy Clasp Design",
      "Comes with Gift Box",
    ],
  },
  {
    category: "Watches, Bags & Jewellery",
    subCategory: "Sunglasses & Eyewear",
    searchQuery: "sunglasses eyewear fashion",
    brands: ["Ray-Ban", "Fastrack", "Vincent Chase", "Idee", "Polaroid"],
    nameTemplates: [
      "{brand} Aviator Sunglasses",
      "{brand} Wayfarer Sunglasses",
      "{brand} Polarized Sunglasses",
      "{brand} Round Frame Sunglasses",
    ],
    priceRange: [299, 3999],
    highlightsPool: ["UV protection", "Stylish design", "Best Price", "Durable frame"],
    featuresPool: [
      "100% UV Protection",
      "Polarized Lens (Select Models)",
      "Lightweight Durable Frame",
      "Comes with Protective Case",
    ],
  },
  {
    category: "Watches, Bags & Jewellery",
    subCategory: "Women's Accessories",
    searchQuery: "women accessories belt hat scarf",
    brands: ["Baggit", "Accessorize", "Fossil", "Da Milano"],
    nameTemplates: [
      "{brand} Women's Belt",
      "{brand} Women's Scarf",
      "{brand} Women's Sun Hat",
      "{brand} Women's Hair Accessories Set",
    ],
    priceRange: [199, 1999],
    highlightsPool: ["Elegant design", "Comfortable fit", "Best Price", "Versatile styling"],
    featuresPool: [
      "Premium Quality Material",
      "Adjustable/One Size Fit",
      "Lightweight & Easy to Carry",
      "Complements Multiple Outfits",
    ],
  },
  {
    category: "Sports & Outdoor",
    subCategory: "Racket Sports",
    searchQuery: "badminton racket tennis squash sports",
    brands: ["Yonex", "Li-Ning", "Cosco", "Wilson", "Nivia"],
    nameTemplates: [
      "{brand} Badminton Racket",
      "{brand} Tennis Racket",
      "{brand} Squash Racket",
      "{brand} Badminton Shuttlecock Pack",
    ],
    priceRange: [299, 4999],
    highlightsPool: ["Lightweight frame", "Great control", "Best Price", "Durable build"],
    featuresPool: [
      "Lightweight Graphite/Aluminum Frame",
      "High Tension String",
      "Comfortable Grip",
      "Includes Carry Cover",
    ],
  },
  {
    category: "Sports & Outdoor",
    subCategory: "Fitness Gadgets",
    searchQuery: "fitness tracker gadget sports",
    brands: ["Fire-Boltt", "Noise", "boAt", "Mi", "Realme"],
    nameTemplates: [
      "{brand} Fitness Tracker Band",
      "{brand} Smart Fitness Gadget",
      "{brand} Heart Rate Monitor Band",
      "{brand} Sports Activity Tracker",
    ],
    priceRange: [999, 3999],
    highlightsPool: ["Accurate tracking", "Long battery life", "Best Price", "Water resistant"],
    featuresPool: [
      "24/7 Activity Tracking",
      "Heart Rate & Sleep Monitor",
      "7-Day Battery Backup",
      "IP68 Water Resistant",
    ],
  },
  {
    category: "Automotive & Motorbike",
    subCategory: "Loaders & Rickshaw",
    searchQuery: "auto rickshaw loader vehicle parts",
    brands: ["Bajaj", "Piaggio", "Mahindra", "TVS", "Atul"],
    nameTemplates: [
      "{brand} Auto Rickshaw Spare Part",
      "{brand} Loader Vehicle Accessory",
      "{brand} Rickshaw Seat Cover",
      "{brand} Loader Body Part",
    ],
    priceRange: [499, 9999],
    highlightsPool: ["Durable build", "Genuine fit", "Best Price", "Long lasting"],
    featuresPool: [
      "High-grade Durable Material",
      "Perfect Fit for Standard Models",
      "Rust & Corrosion Resistant",
      "1-Year Manufacturer Warranty",
    ],
  },
  {
    category: "Automotive & Motorbike",
    subCategory: "Automotive",
    searchQuery: "car interior accessories automotive",
    brands: ["3M", "Michelin", "Bosch", "AutoFurnish", "Spidy Moto"],
    nameTemplates: [
      "{brand} Car Seat Cover Set",
      "{brand} Car Floor Mats",
      "{brand} Car Air Freshener",
      "{brand} Car Phone Mount Holder",
    ],
    priceRange: [199, 4999],
    highlightsPool: ["Easy installation", "Durable material", "Best Price", "Universal fit"],
    featuresPool: [
      "Universal Fit for Most Cars",
      "Durable & Easy to Clean",
      "Enhances Car Interior",
      "Easy DIY Installation",
    ],
  },
];

// Combined array — both batches merged, script safely skips any
// subCategory that already has products (checked below).
const missingSubCategoryConfigs: SubCategoryConfig[] = [
  ...batch1Configs,
  ...batch2Configs,
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

    // Query specific-ah results illainna, generic fallback query try pannunga
    if (results.length === 0) {
      const fallbackQuery = query.split(" ").slice(0, 2).join(" "); // first 2 words mattum
      console.log(`  ⚠️ No results for "${query}", trying fallback: "${fallbackQuery}"`);
      const fallbackRes = await axios.get(`${UNSPLASH_BASE_URL}/search/photos`, {
        params: { query: fallbackQuery, per_page: 30, page: 1 },
        headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
      });
      results.push(...fallbackRes.data.results);
    }

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
    const status = err.response?.status;
    const isRateLimited =
      status === 403 || /rate limit/i.test(err.response?.data?.errors?.[0] || "");

    // Rate limit headers check pannunga — remaining count log pannunga
    const remaining = err.response?.headers?.["x-ratelimit-remaining"];
    if (remaining !== undefined) {
      console.log(`  📊 Unsplash requests remaining: ${remaining}`);
    }

    if (isRateLimited && retries > 0) {
      const waitMs = 10000 * (3 - retries); // wait time increase pannirukom (10s, 20s)
      console.log(`  ⏳ Rate limited, waiting ${waitMs / 1000}s before retry...`);
      await sleep(waitMs);
      return fetchPhotos(query, retries - 1);
    }

    console.error(`  ❌ Photo fetch failed for "${query}" (status: ${status})`);
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