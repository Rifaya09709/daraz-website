import { CampaignConfig } from "../types/campaign.types"; // adjust path if needed

export const campaigns: Record<string, CampaignConfig> = {
  "free-delivery": {
    slug: "free-delivery",
    layout: "shipping",
    pageTitle: "Free Shipping",
    themeColor: "emerald",
    heroHeadline: "Collect & Get ৳110 off on Delivery",
    heroSubtext: "Stack delivery vouchers and shop with zero shipping cost",
    categories: [
      { label: "Free Delivery", emoji: "🚚", imageKeyword: "delivery,truck" },
      { label: "Fashion", emoji: "👕", imageKeyword: "fashion,clothing" },
      { label: "Electronics", emoji: "🔌", imageKeyword: "electronics,gadget" },
      { label: "FMCG", emoji: "🧴", imageKeyword: "grocery,products" },
      { label: "Lifestyle", emoji: "🛋️", imageKeyword: "lifestyle,home" },
    ],
    steps: [
      { title: "Collect Free Delivery Vouchers", description: "Grab vouchers before they run out" },
      { title: "Look for the Free Delivery label", description: "Tagged products ship at zero cost" },
      { title: "Checkout automatically", description: "Discount applies at checkout — no code needed" },
    ],
    products: [
      { id: "fd1", name: "Matte Lip Crayon", image: "/images/lip-crayon.jpg", price: 149, tag: "FREE DELIVERY" },
      { id: "fd2", name: "Custom Name Keychain", image: "/images/keychain.jpg", price: 199, tag: "FREE DELIVERY" },
      { id: "fd3", name: "Microfiber Cloth Set", image: "/images/cloth.jpg", price: 89, tag: "FREE DELIVERY" },
    ],
  },

  "low-price": {
    slug: "low-price",
    layout: "deals",
    pageTitle: "Everyday Low Price",
    themeColor: "amber",
    heroHeadline: "Everyday Low Price",
    heroSubtext: "The essentials you buy every month, always at the lowest price",
    categories: [
      { label: "Kitchen & Dining", emoji: "🍳", imageKeyword: "kitchen,cookware" },
      { label: "Tools, DIY & Outdoor", emoji: "🧰", imageKeyword: "tools,hardware" },
      { label: "Choice Deals", emoji: "🎁", imageKeyword: "gift,shopping" },
      { label: "Health & Beauty", emoji: "💊", imageKeyword: "beauty,skincare" },
    ],
    voucher: {
      discountLabel: "10% OFF",
      title: "Low Price Voucher",
      minSpend: "Min. Spend ৳399",
      validity: "22/07/2026 – 31/07/2026",
    },
    tabs: ["Hot Deals", "Groceries", "Health & Beauty", "Tk.99"],
    products: [
      { id: "lp1", name: "Baby Wet Wipes 120pcs", image: "/images/wipes.jpg", price: 99, originalPrice: 149, tag: "FREE DELIVERY" },
      { id: "lp2", name: "Hair Care Bundle", image: "/images/haircare.jpg", price: 249, originalPrice: 349, tag: "FREE DELIVERY" },
      { id: "lp3", name: "Non-stick Cookware Set", image: "/images/cookware.jpg", price: 799, originalPrice: 1299 },
    ],
  },

  freebies: {
    slug: "freebies",
    layout: "deals",
    pageTitle: "Freebie Zone",
    themeColor: "rose",
    heroHeadline: "Play, Invite & Win Free Gifts",
    heroSubtext: "Free samples, mystery gifts and giveaways — refreshed daily",
    categories: [
      { label: "Mystery Gifts", emoji: "🎁", imageKeyword: "gift,box" },
      { label: "Free Samples", emoji: "🧪", imageKeyword: "cosmetics,sample" },
      { label: "Spin & Win", emoji: "🎡", imageKeyword: "wheel,prize" },
      { label: "Invite & Earn", emoji: "🤝", imageKeyword: "friends,invite" },
    ],
    tabs: ["Free Now", "Ending Soon", "Won by Others"],
    products: [
      { id: "fr1", name: "Sample Perfume Vial", image: "/images/perfume-sample.jpg", price: 0, tag: "FREE" },
      { id: "fr2", name: "Mini Skincare Set", image: "/images/skincare-mini.jpg", price: 0, tag: "FREE" },
    ],
  },

  mobiles: {
    slug: "mobiles",
    layout: "deals",
    pageTitle: "Official Mobile Store",
    themeColor: "indigo",
    heroHeadline: "100% Authentic. Official Warranty.",
    heroSubtext: "Flagship phones, accessories and trade-in deals",
    categories: [
      { label: "Smartphones", emoji: "📱", imageKeyword: "smartphone,mobile" },
      { label: "Accessories", emoji: "🎧", imageKeyword: "headphones,accessories" },
      { label: "Smartwatches", emoji: "⌚", imageKeyword: "smartwatch,wearable" },
      { label: "Trade-In", emoji: "♻️", imageKeyword: "recycle,phone" },
    ],
    voucher: {
      discountLabel: "৳500 OFF",
      title: "Mobile Store Voucher",
      minSpend: "Min. Spend ৳9,999",
      validity: "22/07/2026 – 31/07/2026",
    },
    tabs: ["Best Sellers", "Under ৳15,000", "Trade-In Offers"],
    products: [
      { id: "mb1", name: "AMOLED Smartphone 128GB", image: "/images/phone1.jpg", price: 18999, originalPrice: 21999 },
      { id: "mb2", name: "Wireless Earbuds", image: "/images/earbuds.jpg", price: 1499, originalPrice: 2499 },
    ],
  },

  mall: {
    slug: "mall",
    layout: "deals",
    pageTitle: "DarazMall",
    themeColor: "violet",
    heroHeadline: "100% Genuine Brands, Verified Sellers",
    heroSubtext: "Shop official brand stores with easy returns",
    categories: [
      { label: "Electronics", emoji: "💻", imageKeyword: "laptop,electronics" },
      { label: "Fashion", emoji: "👗", imageKeyword: "dress,fashion" },
      { label: "Beauty", emoji: "💄", imageKeyword: "makeup,beauty" },
      { label: "Home & Living", emoji: "🏠", imageKeyword: "home,decor" },
    ],
    tabs: ["Featured Brands", "New In Mall", "Mall Exclusive"],
    products: [
      { id: "ml1", name: "Brand Running Shoes", image: "/images/shoes.jpg", price: 3499, originalPrice: 4999 },
      { id: "ml2", name: "Ceramic Cookware Set", image: "/images/cookware2.jpg", price: 2199, originalPrice: 2999 },
    ],
  },

  beauty: {
    slug: "beauty",
    layout: "deals",
    pageTitle: "Beauty",
    themeColor: "pink",
    heroHeadline: "Your Everyday Beauty Edit",
    heroSubtext: "Skincare, makeup and fragrance picks curated for you",
    categories: [
      { label: "Skincare", emoji: "🧴", imageKeyword: "skincare,serum" },
      { label: "Makeup", emoji: "💋", imageKeyword: "makeup,lipstick" },
      { label: "Haircare", emoji: "💆", imageKeyword: "haircare,shampoo" },
      { label: "Fragrance", emoji: "🌸", imageKeyword: "perfume,fragrance" },
    ],
    voucher: {
      discountLabel: "15% OFF",
      title: "Beauty Voucher",
      minSpend: "Min. Spend ৳599",
      validity: "22/07/2026 – 31/07/2026",
    },
    tabs: ["Bestsellers", "K-Beauty", "Under ৳300"],
    products: [
      { id: "bt1", name: "Vitamin C Serum", image: "/images/serum.jpg", price: 349, originalPrice: 599 },
      { id: "bt2", name: "Matte Lipstick Set", image: "/images/lipstick.jpg", price: 299, originalPrice: 450 },
    ],
  },

  "new-arrivals": {
    slug: "new-arrivals",
    layout: "shipping",
    pageTitle: "New Arrivals",
    themeColor: "sky",
    heroHeadline: "Fresh Drops, Every Week",
    heroSubtext: "Be the first to shop what just landed",
    categories: [
      { label: "This Week", emoji: "🆕", imageKeyword: "new,arrival" },
      { label: "Fashion", emoji: "👕", imageKeyword: "clothing,fashion" },
      { label: "Gadgets", emoji: "📷", imageKeyword: "camera,gadget" },
      { label: "Home Decor", emoji: "🕯️", imageKeyword: "candle,decor" },
    ],
    steps: [
      { title: "Browse fresh drops", description: "New products added daily across every category" },
      { title: "Save to your wishlist", description: "Keep track of what you don't want to miss" },
      { title: "Grab early-bird pricing", description: "First 48 hours often carry launch discounts" },
    ],
    products: [
      { id: "na1", name: "Retro Sunglasses", image: "/images/sunglasses.jpg", price: 599, tag: "NEW" },
      { id: "na2", name: "Desk Lamp", image: "/images/lamp.jpg", price: 899, tag: "NEW" },
    ],
  },

  fashion: {
    slug: "fashion",
    layout: "deals",
    pageTitle: "DarazLook",
    themeColor: "lime",
    heroHeadline: "Style For Every Look",
    heroSubtext: "Curated outfits and trending fashion, in one place",
    categories: [
      { label: "Women", emoji: "👗", imageKeyword: "women,dress" },
      { label: "Men", emoji: "👔", imageKeyword: "men,shirt" },
      { label: "Kids", emoji: "🧒", imageKeyword: "kids,clothing" },
      { label: "Accessories", emoji: "👜", imageKeyword: "handbag,accessories" },
    ],
    tabs: ["Trending", "New In", "Under ৳999"],
    products: [
      { id: "fs1", name: "Oversized Cotton Tee", image: "/images/tee.jpg", price: 449, originalPrice: 699 },
      { id: "fs2", name: "Denim Jacket", image: "/images/jacket.jpg", price: 1299, originalPrice: 1899 },
    ],
  },

  channels: {
    slug: "channels",
    layout: "deals",
    pageTitle: "Channels",
    themeColor: "slate",
    heroHeadline: "Explore Every Way to Shop",
    heroSubtext: "Live sales, auctions, flash deals and group buys",
    categories: [
      { label: "Live Shopping", emoji: "🔴", imageKeyword: "livestream,shopping" },
      { label: "Auctions", emoji: "🔨", imageKeyword: "auction,gavel" },
      { label: "Flash Deals", emoji: "⚡", imageKeyword: "sale,discount" },
      { label: "Group Buy", emoji: "👥", imageKeyword: "group,people" },
    ],
    tabs: ["Live Now", "Starting Soon", "Popular"],
    products: [
      { id: "ch1", name: "Group Buy: Air Fryer", image: "/images/airfryer.jpg", price: 2499, originalPrice: 3999, tag: "GROUP BUY" },
      { id: "ch2", name: "Auction: Vintage Watch", image: "/images/watch.jpg", price: 1200, tag: "BIDDING" },
    ],
  },
};