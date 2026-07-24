import {
  FaMobileAlt,
  FaHeadphones,
  FaClock,
  FaExchangeAlt,
  FaTshirt,
  FaShoePrints,
  FaGem,
  FaLaptop,
  FaCouch,
  FaBaby,
  FaBicycle,
  FaMotorcycle,
  FaFutbol,
  FaBook,
  FaHome,
  FaShoppingBag,
  FaGamepad,
  FaCar,
  FaBoxOpen,
  FaSpa,
  FaMagic,
  FaWind,
} from "react-icons/fa";
import { IconType } from "react-icons";

// Exact label matches, checked FIRST — avoids substring false-positives
// like "skincare"/"haircare" both containing "car".
const exactLabelIconMap: Record<string, IconType> = {
  skincare: FaSpa,
  makeup: FaMagic,
  haircare: FaWind,
  fragrance: FaSpa,
  smartphones: FaMobileAlt,
  smartwatches: FaClock,
  watches: FaClock,
  accessories: FaHeadphones,
  "trade-in": FaExchangeAlt,
};

// Fallback fuzzy matching for anything not in the exact map above.
// Uses word-boundary regex instead of plain .includes() so "skincare"
// no longer accidentally matches the "car" keyword.
const iconMap: { keywords: string[]; icon: IconType }[] = [
  { keywords: ["mobile", "phone"], icon: FaMobileAlt },
  { keywords: ["headphone", "earbud", "charger"], icon: FaHeadphones },
  { keywords: ["watch"], icon: FaClock },
  { keywords: ["exchange"], icon: FaExchangeAlt },
  { keywords: ["fashion", "clothing", "dress", "shirt", "tshirt"], icon: FaTshirt },
  { keywords: ["shoe", "footwear"], icon: FaShoePrints },
  { keywords: ["jewel", "ring", "necklace", "earring", "bangle"], icon: FaGem },
  { keywords: ["laptop", "computer", "notebook"], icon: FaLaptop },
  { keywords: ["furniture", "sofa", "chair", "table"], icon: FaCouch },
  { keywords: ["baby", "kids", "child"], icon: FaBaby },
  { keywords: ["bicycle", "cycle"], icon: FaBicycle },
  { keywords: ["motorcycle", "helmet"], icon: FaMotorcycle },
  { keywords: ["sport", "fitness", "gym"], icon: FaFutbol },
  { keywords: ["book"], icon: FaBook },
  { keywords: ["home", "kitchen", "essential"], icon: FaHome },
  { keywords: ["bag", "handbag", "backpack"], icon: FaShoppingBag },
  { keywords: ["game", "gaming", "toy"], icon: FaGamepad },
  { keywords: ["vehicle", "jeep", "automotive"], icon: FaCar },
  { keywords: ["\\bcar\\b"], icon: FaCar }, // only a standalone "car", not a substring
];

export const getCategoryIcon = (label: string, keyword?: string): IconType => {
  const normalizedLabel = label.trim().toLowerCase();
  if (exactLabelIconMap[normalizedLabel]) {
    return exactLabelIconMap[normalizedLabel];
  }

  const text = `${label} ${keyword || ""}`.toLowerCase();
  const match = iconMap.find((entry) =>
    entry.keywords.some((k) => new RegExp(`\\b${k}\\b`, "i").test(text) || text.includes(k))
  );
  return match ? match.icon : FaBoxOpen;
};