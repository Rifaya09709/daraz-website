/**
 * SINGLE SOURCE OF TRUTH for category / subCategory values used across
 * the app (Products.tsx sidebar filter, CampaignPage.tsx chip mapping, etc).
 *
 * ⚠️ FULL REPLACE (26/07) — rebuilt from scratch to match the Daraz-style
 * taxonomy shown in the reference screenshot / JSON (12 top-level
 * categories: Electronic Accessories, TV & Home Appliances, Health &
 * Beauty, Mother & Baby, Electronic Devices, Groceries & Pets, Home &
 * Lifestyle, Women's Fashion, Men's Fashion, Watches Bags & Jewellery,
 * Sports & Outdoor, Automotive & Motorbike).
 *
 * NONE of these are "confirmed" against this app's own MongoDB — every
 * category/subCategory/child below is taken from the reference taxonomy,
 * not from a `$group` aggregation on the real `products` collection. Any
 * product already seeded under the old category names (Mobiles, Beauty &
 * Makeup, Home & Kitchen, Personal Care, Kids, Jewellery, Health, Home
 * Essentials, etc.) needs to be remapped — those names don't exist here.
 *
 * STRUCTURE — this is now 3 levels deep, matching what you saw on the
 * live Daraz category dropdown (Category column -> Subcategory column ->
 * Children column):
 *   category        (top-level, e.g. "Electronic Accessories")
 *   subCategories   (2nd tier names only, e.g. "Mobile Accessories") —
 *                   kept as a flat string[] for backward compatibility
 *                   with existing code (Products.tsx sidebar filter,
 *                   CATEGORY_SUBCATEGORIES lookup, etc.)
 *   subCategoryDetails (same 2nd tier, but paired with its 3rd-tier
 *                   "children" array — e.g. "Mobile Accessories" ->
 *                   ["Tablet Accessories", "Cables & Converters", ...])
 *
 * If/when the Product schema grows a 3rd filter field (e.g. `childCategory`
 * or `tags`), pull the values straight from subCategoryDetails[].children.
 */

export interface SubCategoryDetail {
  /** 2nd-tier subCategory name */
  name: string;
  /** 3rd-tier leaf values under this subCategory (may be empty) */
  children: string[];
}

export interface CategoryConfig {
  /** Exact DB `category` value */
  category: string;
  /** Flat list of subCategory names — same as subCategoryDetails[].name */
  subCategories: string[];
  /** Full 3-tier breakdown: subCategory name + its children */
  subCategoryDetails: SubCategoryDetail[];
}

/** Helper so we only write each subcategory's data once */
const sc = (name: string, children: string[] = []): SubCategoryDetail => ({ name, children });

const RAW_CATEGORIES: { category: string; items: SubCategoryDetail[] }[] = [
  {
    category: "Electronic Accessories",
    items: [
      sc("Mobile Accessories", ["Tablet Accessories", "Cables & Converters", "Phone Cases", "Car Mounts", "Parts & Tools", "Screen Protectors", "Power Banks", "Phone Camera Flash Lights", "Selfie Sticks", "Car Chargers", "Wall Chargers", "Docks & Stands"]),
      sc("Camera Accessories", ["Gimbals & Stabilizers", "Action Camera Accessories", "Lenses", "Tripods & Monopods", "Memory Cards", "Batteries", "Lighting & Studio Equipment", "Camera Cases/Covers"]),
      sc("Wearable", ["Fitness & Activity Trackers", "Virtual Reality"]),
      sc("Network Components", ["Access Points"]),
      sc("Computer Components", ["Motherboards", "Processors", "Fans & Heatsinks", "Graphic Cards", "Desktop Casings"]),
      sc("Headphones & Headsets", ["Bluetooth Headsets", "Wired Headsets", "In-Ear", "Over-The-Ear", "Wireless Earbuds", "Mono Headsets"]),
      sc("Printers", ["Ink & Toners", "Fax Machines"]),
      sc("Storage", ["Internal Hard Drives", "Storage for Mac", "Flash Drives", "OTG Drives", "External Hard Drives"]),
      sc("Portable Speakers"),
      sc("Gaming Accessories", ["Gaming Mouse", "Keyboards", "Headsets"]),
      sc("Monitors & Accessories"),
      sc("Computer Accessories"),
    ],
  },
  {
    category: "TV & Home Appliances",
    items: [
      sc("Air Conditioner"),
      sc("Washing Machine"),
      sc("Refrigerators & Freezers", ["Freezers"]),
      sc("Cooling & Heating", ["Air Cooler", "Air Purifier", "Dehumidifier", "Humidifier", "Fan", "Room Heater", "Water Heater"]),
      sc("Irons & Garment Care", ["Irons", "Garment Steamer", "Sewing Machine"]),
      sc("Vacuums & Floor Care", ["Electric Brooms", "Steam Mops", "Floor Polisher", "Vacuum Cleaner"]),
      sc("Kitchen Appliances", ["Microwave", "Water Dispensers", "Dishwashers", "Cooktop & Range", "Oven", "Air & Deep Fryers", "Specialty Cookware", "Juicer & Fruit Extraction", "Blender/Mixer/Grinder", "Electric Kettle", "Pressure Cookers", "Rice Cooker"]),
      sc("Home Audio & Theater", ["Soundbar Speakers", "Live Sound & Stage Equipment", "Home Entertainment", "Home Theater Systems"]),
      sc("Televisions", ["LED Televisions", "Smart Televisions"]),
      sc("Projectors & Players", ["Projectors", "Blu Ray & DVD Players"]),
      sc("Generator, UPS & Solar", ["Solar Inverters", "Generators", "UPS"]),
      sc("TV Accessories", ["Antennas", "TV Receivers", "Cables", "3D Glasses", "TV Remote Controllers", "Wall Mounts & Protectors", "TV Adapters"]),
    ],
  },
  {
    category: "Health & Beauty",
    items: [
      sc("Men's Care", ["Shaving & Grooming"]),
      sc("Medical Supplies", ["Stethoscopes", "Surgical Masks", "Health Monitors & Tests", "Ointments and Creams", "Nebulizer & Aspirators", "Health Accessories", "First Aid Supplies"]),
      sc("Personal Care", ["Adult Diapers", "Oral Care", "Eye Care", "Pads & Tampons", "Menstrual Cups", "Deodorants", "Personal Safety & Security", "Ear Care"]),
      sc("Hair Care", ["Oil & Serums", "Hair Care Accessories", "Shampoo & Conditioner", "Hair Treatments", "Hair Styling", "Hair Coloring"]),
      sc("Beauty Tools", ["Foot Relief Tools", "Slimming & Electric Massagers", "Hair Removal Appliances", "Hair Styling Appliances", "Skin Care Tools"]),
      sc("Makeup", ["Bulk Deals", "Eyes", "Makeup Accessories", "Lips", "Nails", "Makeup Removers", "Makeup Palettes & Sets", "Face"]),
      sc("Fragrances", ["Women", "Men", "Unisex"]),
      sc("Bath & Body", ["Hand Care", "Talcum Powder", "Foot Care", "Body Moisturizers", "Hair Removal", "Body Soaps & Shower Gels", "Body Scrubs", "Bath & Body Accessories", "Body & Massage Oils"]),
      sc("Sexual Wellness", ["Lubricants", "Condoms"]),
      sc("Skin Care", ["Moisturizers and Cream", "Lip Balm & Treatment", "Sunscreen & Aftersun", "Face Mask & Packs", "Face Scrubs & Exfoliators", "Facial Cleansers", "Toner & Mists", "Serum & Essence", "Eye Care"]),
    ],
  },
  {
    category: "Mother & Baby",
    items: [
      sc("Clothing & Accessories", ["Newborn", "Accessories", "New born sets & Packs", "Girls (Under 3 Years)", "Boys (Under 3 Years)", "New born bodysuits"]),
      sc("Maternity Care", ["Pregnancy Pillows", "Maternity Accessories", "Breast Pumps", "Nursing Covers", "Maternity Wear", "Nipple Care", "Breast Shells"]),
      sc("Baby Gear", ["Backpacks & Carriers", "Swings/Jumpers/Bouncers", "Harnesses & Leashes", "Walkers", "Car Seats", "Strollers", "Highchairs & Booster Seats", "Baby Safety", "Baby Monitor", "Kids Bag"]),
      sc("Remote Control & Vehicles", ["Play Vehicles", "RC Vehicles & Batteries", "Drones & Accessories", "Die-Cast Vehicles", "Play Trains & Railway Sets"]),
      sc("Feeding"),
      sc("Milk Formula & Baby Food", ["Toddler Milk", "Maternal", "Infant Milk (0-6 months)", "Infant Milk (6-12 months)", "Growing-up Milk", "Baby & Toddler Foods"]),
      sc("Diapering & Potty", ["Disposable diapers", "Diaper Bags", "Diapering Care", "Changing Tables/Pads/Kits", "Cloth Diapers & Accessories", "Wipes & Holders", "Potty Training"]),
      sc("Nursery", ["Storage & Organization", "Nursery Decor", "Baby Furniture", "Mattresses & Bedding"]),
      sc("Sports & Outdoor Play", ["Inflatable Bouncers", "Fidget Spinners", "Swimming Pool & Water Toys"]),
      sc("Baby & Toddler Toys", ["Activity Gym & Playmats", "Bath Toys", "Crib Toys & Attachments", "Push & Pull Toys", "Music & Sound", "Early Development Toys", "Rattles", "Building Blocks Toys"]),
      sc("Baby Personal Care", ["Shampoo & Conditioners", "Bathing Tubs & Seats", "Grooming & Healthcare Kits", "Baby Bath Mats", "Skin Care", "Soaps, Cleansers & Bodywash", "Washcloths & Towels", "Toothbrushes & Toothpaste"]),
      sc("Toys & Games", ["Stuffed Toys", "Puzzle & Boardgames", "Pretend Play", "Slime & Squishy Toys", "Learning & Education", "Blocks & Building toys", "Dolls & Accessories", "Action Figures & Collectibles", "Arts & Crafts for Kids"]),
    ],
  },
  {
    category: "Electronic Devices",
    items: [
      sc("Feature Phones"),
      sc("Daraz Like New", ["Like New Phones", "Like New Smartwatches", "Like New Laptops", "Like New Tablets", "Like New Speakers", "Like New Airbuds"]),
      sc("Security Cameras", ["IP Security Cameras"]),
      sc("Gaming Consoles", ["Playstation Games", "PlayStation Consoles", "Playstation Controllers", "Nintendo Games", "Xbox Games"]),
      sc("Smart Phones", ["Nokia Mobiles", "Honor Mobiles", "Infinix Mobiles", "Realme Mobiles", "Redmi Mobiles", "Oneplus Mobiles", "Oppo Mobile Phones", "Apple iPhones", "Tecno Mobiles", "Samsung Mobile Phones", "Vivo Mobiles"]),
      sc("Cameras & Drones", ["Drones", "Point & Shoot", "DSLR", "Instant Cameras", "Video Camera"]),
      sc("Smart Watches"),
      sc("Monitors"),
      sc("Landline Phones"),
      sc("Laptops", ["Refurbished Laptops", "Traditional Laptops"]),
      sc("Desktops", ["All-In-One"]),
    ],
  },
  {
    category: "Groceries & Pets",
    items: [
      sc("Frozen Food", ["Other Frozen Food", "Chicken", "Beef"]),
      sc("Dog", ["Bowls & Feeders", "Beds, Mats & Houses", "Cages, Crates & Doors", "Fleas & Ticks", "Leashes, Collars & Muzzles", "Carriers & Travel", "Treats", "Food", "Grooming", "Toys"]),
      sc("Cat"),
      sc("Breakfast, Choco & Snacks"),
      sc("Beverages", ["Soft Drinks", "Water", "UHT, Milk & Milk Powder", "Juices", "Coffee", "Powdered Drinks", "Tea", "Flavoring Syrup"]),
      sc("Food Staples", ["Condiment Dressing", "Home Baking & Sugar", "Cooking Ingredients", "Noodles & Pasta", "Jarred Food", "Canned Food", "Instant & Ready-to-Eat", "Grains, Beans & Pulses", "Rice", "Oil"]),
      sc("Laundry & Household", ["Laundry", "Pest Control", "Tissue Paper", "Cleaning", "AirCare", "Dishwashing", "Foils & Cling Films"]),
      sc("Fish", ["Food", "Aquarium Water Pumps", "Aquarium Decorations", "Aquarium Lighting", "Aquarium Filters", "Aquariums", "Starter Kits", "Aquarium Cleaning Tools", "Aquarium Temp Control"]),
    ],
  },
  {
    category: "Home & Lifestyle",
    items: [
      sc("Laundry & Cleaning", ["Brushes, Sponges & Wipers", "Brooms, Mops & Sweepers", "Clothes Line & Drying Racks", "Ironing Boards", "Laundry Baskets & Hampers"]),
      sc("Tools, DIY & Outdoor", ["Paints", "Fixtures & Plumbing", "Lawn & Garden", "Power Tools", "Security", "Electrical", "Primers", "Hand Tools", "Home Build Up"]),
      sc("Bath", ["Bathroom Scales", "Towel Rails & Warmers", "Shower Caddies & Hangers", "Bathroom Shelving", "Bath Towels", "Bathrobes", "Bath Mats"]),
      sc("Stationery & Craft", ["Paper Products", "Writing & Correction", "Art Supplies", "Packaging & Cartons", "School & Office Equipment", "Gifts & Wrapping", "School Uniforms"]),
      sc("Furniture", ["Kitchen Furniture", "Gaming Furniture", "Home Office", "Living Room", "Bedroom"]),
      sc("Bedding", ["Comforters, Quilts & Duvets", "Blankets & Throws", "Pillows & Bolsters", "Pillow Cases", "Bedding Accessories", "Bed Sheets", "Mattress Protectors"]),
      sc("Decor", ["Mirrors", "Cushions & Covers", "Rugs & Carpets", "Wall Stickers & Decals", "Curtains", "Artificial Flowers & Plants", "Candles & Candleholders", "Clocks", "Vases & Vessels", "Picture Frames"]),
      sc("Lighting", ["Wall Lights & Sconces", "Ceiling Lights", "Lighting Fixtures & Components", "Light Bulbs", "Lamp Shades", "Outdoor Lighting", "Table Lamps", "Floor Lamps"]),
      sc("Media, Music & Books", ["eBooks", "Books", "Musical Instruments", "Magazines"]),
    ],
  },
  {
    category: "Women's Fashion",
    items: [
      sc("Girls Shoes"),
      sc("Girls Clothing", ["Socks & Tights", "Jackets & Coats", "Underwear & Sleepwear", "Hats & Caps", "Belts", "Gloves, Scarves & Cold Wear", "Dresses", "Tops", "Bottoms", "Swimsuits", "Hair Accessories", "Hoodies"]),
      sc("Sleepwear & Innerwear", ["Tanks & Camisoles", "Robe and Gown sets", "Shapewear", "Nightwear"]),
      sc("Bras, Panties & Lingerie", ["Beachwear and Bikinis", "Lingerie Sets", "Socks & Tights", "Bras", "Panties"]),
      sc("Unstitched Fabric", ["Sarees", "Branded Unstitched"]),
      sc("Kurtas & Shalwar Kameez", ["Kurtis", "Shalwar Kameez", "Trousers & Palazzos"]),
      sc("Dresses & Skirts", ["Skirts", "Formal Wear", "Ethnic Dresses"]),
      sc("Winter Clothing", ["Jackets & Coats", "Shrugs", "Hoodies & Sweatshirts"]),
      sc("Pants, Jeans & Leggings", ["Jeggings", "Shorts", "Leggings", "Pants", "Jeans"]),
      sc("Tops", ["Tunics", "Blouses & Shirts"]),
      sc("Muslim Wear", ["Dupattas, Stoles & Shawls", "Scarves", "Abayas & Hijabs", "Hair Accessories"]),
    ],
  },
  {
    category: "Men's Fashion",
    items: [
      sc("Boy's Shoes", ["Shoes Accessories", "Slip-Ons & Loafers", "Khusa & Kolapuri", "Formal Shoes", "Flip Flops & Sandals", "Sneakers", "Boots"]),
      sc("Kurtas & Shalwar Kameez", ["Kurtas", "Shalwar", "Unstitched Fabric", "Shawls"]),
      sc("Winter Clothing", ["Jackets & Coats", "Hoodies & Sweatshirts"]),
      sc("Shorts, Joggers & Sweats", ["Joggers & Sweats"]),
      sc("Shirts & Polo", ["Polos", "Casual Shirts", "Formal Shirts"]),
      sc("T-Shirts & Tanks"),
      sc("Boy's Accessories", ["Socks", "Sunglasses", "Gloves", "Hats & Caps", "Belts", "Scarves", "Ties & Bows"]),
      sc("Boy's Clothing", ["Kurtas & Shalwar Kameez", "Shorts", "T-Shirts & Shirts", "Pants & Jeans", "Underwear & Socks"]),
      sc("Accessories", ["Socks", "Belts", "Hats & Caps"]),
      sc("Shoes"),
      sc("Inner Wear", ["Thermal", "Nightwear", "Vests", "Socks", "Briefs", "Trunk & Boxers"]),
      sc("Pants & Jeans", ["Jeans", "Cargo", "Chinos"]),
    ],
  },
  {
    category: "Watches, Bags & Jewellery",
    items: [
      sc("Women's Watches", ["Analog", "Digital", "Accessories"]),
      sc("Men's Watches", ["Analog", "Accessories", "Digital", "Chronograph", "Branded Watches"]),
      sc("Kid's Watches", ["Girls", "Boys"]),
      sc("Mens Jewellery", ["Chains", "Rings", "Bracelets", "Studs"]),
      sc("Womens Jewellery", ["Necklaces", "Rings", "Jewellery Sets", "Anklets", "Earrings", "Bracelets"]),
      sc("Sunglasses & Eyewear", ["Lenses", "Men Sunglasses", "Women Sunglasses", "Kids Sunglasses", "Unisex Sunglasses", "Kids Eyeglasses", "Unisex Eyeglasses"]),
      sc("Womens Bags", ["Wristlets", "Wallets & Accessories", "Clutches", "Backpacks", "Top-Handle Bags", "Tote Bags", "Cross Body & Shoulder Bags"]),
      sc("Mens Bags", ["Backpacks", "Crossbody Bags", "Messenger Bags", "Business Bags", "Wallets & Cardholders", "Cardholders & Keychains"]),
      sc("Luggage & Suitcase", ["Luggage", "Laptop Bags", "Travel Accessories"]),
      sc("Women's Accessories", ["Gloves", "Belts", "Hats & Caps"]),
    ],
  },
  {
    category: "Sports & Outdoor",
    items: [
      sc("Racket Sports", ["Badminton", "Tennis", "Squash"]),
      sc("Shoes & Clothing", ["Womens Shoes", "Mens Shoes", "Mens Clothing", "Womens Clothing", "Women Accessories", "Men Accessories", "Women Bags", "Men Bags"]),
      sc("Sports Accessories", ["Water Bottles", "Home Gym"]),
      sc("Fitness Gadgets", ["Fitness Trackers", "Fitness Trackers Accessories"]),
      sc("Outdoor Recreation", ["Fishing", "Water Sports", "Skate Boards", "Camping / Hiking", "Cycling", "Cycle accessories"]),
      sc("Supplements", ["Fat Burners", "Post Workouts and Recovery", "Pre Workouts", "Proteins"]),
      sc("Team Sports", ["Baseballs", "Hockey", "Basket Ball", "Volley balls", "Cricket", "Football"]),
      sc("Exercise & Fitness", ["Fitness Accessories", "Treadmills", "Exercise Bikes", "Boxing, Martial Arts & MMA", "Strength Training Equipments", "Weight", "Exercise Bands", "Cardio Training Equipment", "Yoga"]),
    ],
  },
  {
    category: "Automotive & Motorbike",
    items: [
      sc("Loaders & Rickshaw", ["Loaders", "Auto Rikshaw"]),
      sc("Automotive", ["Car Tools & Equipment", "Car Tires & Wheels", "Car Oils & Fluids", "Car Care", "Car Exterior Accessories", "Car Interior Accessories", "Car Safety & Security", "Car Electronics", "Car Parts & Spares"]),
      sc("Motorcycle", ["Motorcycle Helmets", "Sports Bikes", "Standard Bikes", "Electric Bikes", "Motorcycle Parts & Spares", "Motorcycle Oil & Fluids", "Riding Gear", "Motorcycle Accessories", "ATVs & UTVs", "Motorcycle Tires & Wheels"]),
    ],
  },
];

/** Build the exported CATEGORIES array (flat subCategories + full details) from RAW_CATEGORIES */
export const CATEGORIES: CategoryConfig[] = RAW_CATEGORIES.map((c) => ({
  category: c.category,
  subCategories: c.items.map((i) => i.name),
  subCategoryDetails: c.items,
}));

/** Plain "All" + category labels, for the sidebar list */
export const CATEGORY_LABELS = ["All", ...CATEGORIES.map((c) => c.category)];

/** category -> subCategories[] lookup (flat names only), replaces the old hardcoded CATEGORY_SUBCATEGORIES */
export const CATEGORY_SUBCATEGORIES: Record<string, string[]> = CATEGORIES.reduce(
  (acc, c) => {
    acc[c.category] = c.subCategories;
    return acc;
  },
  {} as Record<string, string[]>
);

/** category -> subCategoryDetails[] lookup, for anywhere you need the 3rd-tier children too */
export const CATEGORY_SUBCATEGORY_DETAILS: Record<string, SubCategoryDetail[]> = CATEGORIES.reduce(
  (acc, c) => {
    acc[c.category] = c.subCategoryDetails;
    return acc;
  },
  {} as Record<string, SubCategoryDetail[]>
);

/** "category:subCategory" -> children[] lookup, handy for a 3rd dropdown/chip level */
export const SUBCATEGORY_CHILDREN: Record<string, string[]> = CATEGORIES.reduce(
  (acc, c) => {
    for (const detail of c.subCategoryDetails) {
      acc[`${c.category}:${detail.name}`] = detail.children;
    }
    return acc;
  },
  {} as Record<string, string[]>
);

/**
 * campaign-label -> DB category/subCategory mapping.
 *
 * ⚠️ RECHECK EVERYTHING BELOW — every mapping here used to point at the old
 * category names (Mobiles, Beauty & Makeup, Home & Kitchen, Personal Care,
 * Kids, etc.) which no longer exist. Remapped to the closest equivalent in
 * the new 12-category structure as a starting point — verify against your
 * actual campaign pages before shipping.
 */
export const categoryLabelToDbCategory: Record<
  string,
  { category?: string; subCategory?: string }
> = {
  // ---- campaign-scoped overrides (resolve conflicts) ----
  "mobiles:Accessories": { category: "Electronic Accessories", subCategory: "Mobile Accessories" },
  "fashion:Accessories": { category: "Women's Fashion" }, // ⚠️ RECHECK — bags live under "Watches, Bags & Jewellery" now

  // mobiles campaign
  Smartphones: { category: "Electronic Devices", subCategory: "Smart Phones" },
  Smartwatches: { category: "Electronic Devices", subCategory: "Smart Watches" },
  "Trade-In": { category: "Electronic Devices" }, // ⚠️ RECHECK — no direct equivalent subCategory

  // mall campaign
  Electronics: { category: "Electronic Devices" }, // ⚠️ RECHECK — could also mean "Electronic Accessories" depending on campaign intent
  Fashion: { category: "Women's Fashion" }, // ⚠️ RECHECK — split into Women's/Men's Fashion now, pick per context
  Beauty: { category: "Health & Beauty" },
  "Home & Living": { category: "Home & Lifestyle" },

  // beauty campaign
  Skincare: { category: "Health & Beauty", subCategory: "Skin Care" },
  Makeup: { category: "Health & Beauty", subCategory: "Makeup" },
  Haircare: { category: "Health & Beauty", subCategory: "Hair Care" },
  Fragrance: { category: "Health & Beauty", subCategory: "Fragrances" },

  // fashion campaign
  Women: { category: "Women's Fashion" },
  Men: { category: "Men's Fashion" },
  Kids: { category: "Mother & Baby", subCategory: "Toys & Games" }, // ⚠️ RECHECK — no standalone "Kids" category anymore

  // free-delivery campaign
  FMCG: { category: "Groceries & Pets" },
  Lifestyle: { category: "Home & Lifestyle" },

  // low-price campaign
  "Kitchen & Dining": { category: "TV & Home Appliances", subCategory: "Kitchen Appliances" },
  "Tools, DIY & Outdoor": { category: "Home & Lifestyle", subCategory: "Tools, DIY & Outdoor" },
  "Health & Beauty": { category: "Health & Beauty" },

  // new-arrivals campaign
  Gadgets: { category: "Electronic Devices" },
  "Home Decor": { category: "Home & Lifestyle", subCategory: "Decor" },
};

/** campaignSlug scoped first, falls back to plain label, undefined if no match */
export const resolveDbCategory = (campaignSlug: string, label: string) =>
  categoryLabelToDbCategory[`${campaignSlug}:${label}`] || categoryLabelToDbCategory[label];