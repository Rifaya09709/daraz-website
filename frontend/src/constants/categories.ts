/**
 * SINGLE SOURCE OF TRUTH for category / subCategory values used across
 * the app (Products.tsx sidebar filter, CampaignPage.tsx chip mapping, etc).
 *
 * Values below marked "confirmed" came directly from running this
 * aggregation on the real `products` collection in Atlas:
 *
 *   [{ "$group": { "_id": "$category", "subCategories": { "$addToSet": "$subCategory" } } }]
 *
 * Values marked "⚠️ VERIFY" are still GUESSES (not yet confirmed against
 * the DB) — categories that haven't been checked yet at all: Mobiles,
 * Fashion (only the count "20" is known, not the actual list), Groceries,
 * Home Essentials. Run the aggregation again / scroll the result to fill
 * these in, then remove the ⚠️ tags.
 */

export interface CategoryConfig {
  /** Exact DB `category` value */
  category: string;
  /** Exact DB `subCategory` values available under this category */
  subCategories: string[];
}

export const CATEGORIES: CategoryConfig[] = [
  {
    category: "Mobiles", // ⚠️ VERIFY — not yet confirmed from aggregation output
    subCategories: [
      "Smartphones", // ⚠️ VERIFY
      "Feature Phones", // ⚠️ VERIFY
      "Phone Case", // ⚠️ VERIFY
      "Chargers & Cables", // ⚠️ VERIFY
      "Power Banks", // ⚠️ VERIFY
    ],
  },
  {
    category: "Laptops", // confirmed
    subCategories: [
      "Laptops", // confirmed
      "Laptop Bags", // added — seeded via seedMissingSubcategories.ts
      "Laptop Accessories", // added — seeded via seedMissingSubcategories.ts
    ],
  },
  {
    category: "Fashion", // confirmed (category name only — 20 subCategories exist, list not yet retrieved)
    subCategories: [
      "Men's Dress", // added — seeded via seedMissingSubcategories2.ts
      "Women's Dress", // added — seeded via seedMissingSubcategories2.ts
      "Burkha", // added — seeded via seedMissingSubcategories2.ts
      "Abhaya", // added — seeded via seedMissingSubcategories2.ts
      "Travel Bags & Suitcases", // confirmed — visible in Atlas/site already
      // ⚠️ VERIFY — Atlas showed "Array (20)" total; the rest are still unlisted.
    ],
  },
  {
    category: "Bike", // confirmed — NEW category, wasn't in the old hardcoded list
    subCategories: [
      "Bicycles", // confirmed
    ],
  },
  {
    category: "Jeep", // confirmed — NEW category, wasn't in the old hardcoded list
    subCategories: [
      "Jeep Models & Accessories", // confirmed
    ],
  },
  {
    category: "Motorcycle", // confirmed — NEW category, wasn't in the old hardcoded list
    subCategories: [
      "Motorcycle Gear", // confirmed
    ],
  },
  {
    category: "Electronics", // confirmed
    subCategories: [
      "Electronics Accessories", // confirmed
      "Washing Machine", // confirmed
      "Speaker", // confirmed
      "Power Strip & Extension Board", // confirmed
      "Table Fan", // confirmed
      "Memory Cards & Pen Drives", // confirmed
      "LED Bulbs & Smart Lights", // confirmed
      "Camera Tripod", // confirmed
      "AC", // confirmed
      "Refrigerator", // confirmed
      "Bluetooth Headphones", // confirmed
      "Watches", // confirmed
      "TV Remote", // confirmed
      "TV", // added — seeded via seedMissingSubcategories3.ts
      "Oven", // added — seeded via seedMissingSubcategories3.ts
      "Ceiling Fan", // added — seeded via seedMissingSubcategories3.ts
      "USB Cables & Chargers", // confirmed
      "Hand Fan", // confirmed
      "Fan Remote", // confirmed
      "Air Cooler", // confirmed
      "Phone Case", // confirmed
      "Clock", // confirmed
    ],
  },
  {
    category: "Furniture", // confirmed
    subCategories: [
      "Furniture", // confirmed
      "Dining Table", // confirmed
      "Sofa", // added — seeded via seedMissingSubcategories3.ts
      "Beds", // added — seeded via seedMissingSubcategories.ts
      "Study Table", // added — seeded via seedMissingSubcategories.ts
      "Wardrobes", // added — seeded via seedMissingSubcategories.ts
    ],
  },
  {
    category: "Beauty & Makeup", // confirmed
    subCategories: [
      "Foundation", // confirmed
      "Fragrance", // confirmed
      "Lipstick", // confirmed
      "Makeup Brush", // confirmed
      "Skincare", // added — seeded via seedMissingSubcategories.ts
    ],
  },
  {
    category: "Personal Care", // confirmed
    subCategories: [
      "Nail Care Kit", // confirmed
      "Face Masks", // confirmed
      "Shaving Kit", // confirmed
      "Hair Styling Tools", // confirmed
      "Hand Sanitizer", // confirmed
      "Toothpaste", // confirmed
      "Toothbrush", // confirmed
      "Shampoo", // confirmed
      "Soap", // confirmed
      "Supplements", // added — seeded via seedMissingSubcategories.ts
    ],
  },
  {
    category: "Gaming", // confirmed
    subCategories: [
      "Musical Instruments", // confirmed
      "Toys & Games", // confirmed
      "Gaming Consoles & Accessories", // confirmed
      "Consoles", // added — seeded via seedMissingSubcategories.ts
      "Controllers", // added — seeded via seedMissingSubcategories.ts
      "Gaming Accessories", // added — seeded via seedMissingSubcategories.ts
    ],
  },
  {
    category: "Home & Kitchen", // confirmed
    subCategories: [
      "Iron Box", // confirmed
      "Pressure Cooker", // confirmed
      "Water Bottle & Flask", // confirmed
      "Mixer Grinder", // confirmed
      "Gas Stove & Induction", // confirmed
      "Dinner Sets", // confirmed
      "Storage Containers", // confirmed
      "Water Bottles", // confirmed
      "Cooking Vessels", // confirmed
      "Vessel Cleaner", // added — seeded via seedMissingSubcategories2.ts
      "Cookware", // added — seeded via seedMissingSubcategories.ts
      "Storage", // added — seeded via seedMissingSubcategories.ts
    ],
  },
  {
    category: "Groceries", // ⚠️ VERIFY — not yet confirmed from aggregation output
    subCategories: [
      "Pantry", // added — seeded via seedMissingSubcategories.ts
      "Snacks", // added — seeded via seedMissingSubcategories.ts
      "Beverages", // added — seeded via seedMissingSubcategories.ts
      "Biscuits", // confirmed — from original seed.ts, already in DB
      "Chocolate", // confirmed — from original seed.ts, already in DB
      "Chips", // confirmed — from original seed.ts, already in DB
    ],
  },
  {
    category: "Baby", // confirmed — names fixed to match actual seeded data
    subCategories: [
      "Baby Products", // fixed — was "Baby All Items", didn't match DB
      "Baby Carrier & Stroller", // fixed — was "Baby Lotion", didn't match DB
      "Baby Bath Tub", // fixed — was missing from filter list
    ],
  },
  {
    category: "Home Essentials", // ⚠️ VERIFY — not yet confirmed from aggregation output
    subCategories: [
      "Bathroom Cleaning", // added — seeded via seedMissingSubcategories2.ts
      "Washing Powder & Detergent", // added — seeded via seedMissingSubcategories2.ts
      "Curtains & Blinds", // added — already exists in DB, was missing from filter list
      "Wall Clocks", // added — already exists in DB, was missing from filter list
      "Photo Frames", // added — already exists in DB, was missing from filter list
      "Study Table Lamp", // added — already exists in DB, was missing from filter list
      "Bedsheets & Linen", // added — already exists in DB, was missing from filter list
      "Cleaning Supplies", // added — already exists in DB, was missing from filter list
    ],
  },
  {
    category: "Kids", // ⚠️ VERIFY — not yet confirmed from aggregation output
    subCategories: [
      "Boys Clothing", // added — seeded via seedMissingSubcategories2.ts
      "Girls Clothing", // added — seeded via seedMissingSubcategories2.ts
      "Kids Toys", // added — already exists in DB, was missing from filter list
      "Kids School Bag", // added — already exists in DB, was missing from filter list
      "Kids Water Bottle", // added — already exists in DB, was missing from filter list
      "Kids Cars and Toys", // ⚠️ VERIFY
      "Kids Study Table", // ⚠️ VERIFY
      "Stationery", // ⚠️ VERIFY
    ],
  },
  {
    category: "Jewellery", // added — NEW category, wasn't in the old hardcoded list
    subCategories: [
      "Earrings", // confirmed — from original seed.ts
      "Necklace", // confirmed — from original seed.ts
      "Rings", // confirmed — from original seed.ts
      "Bangles", // confirmed — from original seed.ts
    ],
  },
  {
    category: "Health", // added — NEW category, wasn't in the old hardcoded list
    subCategories: [
      "Sports", // confirmed — from original seed.ts
      "Weighing Scale", // confirmed — from original seed.ts
      "Blood Pressure Monitor", // confirmed — from original seed.ts
      "Resistance Bands", // confirmed — from original seed.ts
      "Skipping Rope", // confirmed — from original seed.ts
      "Protein Supplements", // confirmed — from original seed.ts
    ],
  },
];

/** Plain "All" + category labels, for the sidebar list */
export const CATEGORY_LABELS = ["All", ...CATEGORIES.map((c) => c.category)];

/** category -> subCategories[] lookup, replaces the old hardcoded CATEGORY_SUBCATEGORIES */
export const CATEGORY_SUBCATEGORIES: Record<string, string[]> = CATEGORIES.reduce(
  (acc, c) => {
    acc[c.category] = c.subCategories;
    return acc;
  },
  {} as Record<string, string[]>
);

/**
 * campaign-label -> DB category/subCategory mapping.
 * Moved here from CampaignPage.tsx so it lives next to the categories
 * it depends on. Keys are "slug:label" for campaign-scoped overrides,
 * or a plain "label" for a shared fallback used across campaigns.
 */
export const categoryLabelToDbCategory: Record<
  string,
  { category?: string; subCategory?: string }
> = {
  // ---- campaign-scoped overrides (resolve conflicts) ----
  "mobiles:Accessories": { category: "Electronics", subCategory: "Electronics Accessories" },
  "fashion:Accessories": { category: "Fashion", subCategory: "Bags" }, // ⚠️ VERIFY "Bags" is a real Fashion subCategory

  // mobiles campaign
  Smartphones: { category: "Mobiles", subCategory: "Smartphones" }, // ⚠️ VERIFY
  Smartwatches: { category: "Electronics", subCategory: "Watches" }, // confirmed
  "Trade-In": { category: "Mobiles" }, // ⚠️ VERIFY

  // mall campaign
  Electronics: { category: "Electronics" }, // confirmed
  Fashion: { category: "Fashion" }, // confirmed (category exists)
  Beauty: { category: "Beauty & Makeup" }, // confirmed
  "Home & Living": { category: "Furniture" }, // confirmed

  // beauty campaign
  Skincare: { category: "Beauty & Makeup", subCategory: "Skincare" }, // confirmed
  Makeup: { category: "Beauty & Makeup" }, // confirmed
  Haircare: { category: "Personal Care", subCategory: "Hair Styling Tools" }, // confirmed
  Fragrance: { category: "Beauty & Makeup", subCategory: "Fragrance" }, // confirmed

  // fashion campaign
  Women: { category: "Fashion", subCategory: "Women's Dress" }, // confirmed
  Men: { category: "Fashion", subCategory: "Men's Dress" }, // confirmed
  Kids: { category: "Kids" }, // confirmed

  // free-delivery campaign
  FMCG: { category: "Groceries" }, // ⚠️ VERIFY
  Lifestyle: { category: "Home Essentials" }, // ⚠️ VERIFY

  // low-price campaign
  "Kitchen & Dining": { category: "Home & Kitchen" }, // confirmed
  "Tools, DIY & Outdoor": { category: "Home Essentials" }, // ⚠️ VERIFY
  "Health & Beauty": { category: "Beauty & Makeup" }, // confirmed

  // new-arrivals campaign
  Gadgets: { category: "Electronics" }, // confirmed
  "Home Decor": { category: "Home Essentials" }, // ⚠️ VERIFY
};

/** campaignSlug scoped first, falls back to plain label, undefined if no match */
export const resolveDbCategory = (campaignSlug: string, label: string) =>
  categoryLabelToDbCategory[`${campaignSlug}:${label}`] || categoryLabelToDbCategory[label];