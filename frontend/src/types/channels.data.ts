export interface ChannelConfig {
  slug: string;
  title: string;
  tagline: string;
  /** search keyword used to pull a relevant photo from Unsplash */
  unsplashKeyword: string;
  description: string;
  ctaLabel: string;
  ctaLink: string;
  themeColor: string; // tailwind color name, e.g. "orange", "pink"
}

// Only channels that don't already have a dedicated /campaign/:slug page
// (Beauty, New Arrivals, DarazLook, Official Mobile, DarazMall, Free
// Delivery, Everyday Low Price already route to CampaignPage — see
// Channels.tsx for those links).
export const channels: Record<string, ChannelConfig> = {
  coins: {
    slug: "coins",
    title: "Coins 99% OFF",
    tagline: "Collect coins, unlock instant discounts",
    unsplashKeyword: "shopping discount sale",
    description:
      "Earn coins every time you shop, check in daily, or complete simple tasks. Redeem your coins at checkout for up to 99% off on selected items — the more you collect, the more you save.",
    ctaLabel: "Start Earning Coins",
    ctaLink: "/products",
    themeColor: "pink",
  },
  freebie: {
    slug: "freebie",
    title: "Daraz Freebie",
    tagline: "Invite friends, win real prizes",
    unsplashKeyword: "gift box present",
    description:
      "Invite your friends to join and unlock free gifts together. Spin, scratch, and complete daily missions for a chance to win phones, appliances, and exclusive vouchers.",
    ctaLabel: "Play Now",
    ctaLink: "/products",
    themeColor: "red",
  },
  "buy-more-save": {
    slug: "buy-more-save",
    title: "Buy More, Save More",
    tagline: "Bigger cart, bigger discount",
    unsplashKeyword: "shopping cart bulk purchase",
    description:
      "The more items you add to your cart from participating sellers, the more you save — discounts stack automatically at checkout, no coupon code needed.",
    ctaLabel: "Shop the Deals",
    ctaLink: "/products",
    themeColor: "orange",
  },
  affiliates: {
    slug: "affiliates",
    title: "Affiliate Program",
    tagline: "Share products, earn commission",
    unsplashKeyword: "referral marketing teamwork",
    description:
      "Share your favorite products with your audience using a personal referral link. Earn a commission on every purchase made through your link — track your earnings in real time.",
    ctaLabel: "Join the Program",
    ctaLink: "/products",
    themeColor: "amber",
  },
  recharge: {
    slug: "recharge",
    title: "Quick Recharge",
    tagline: "Mobile top-up in seconds",
    unsplashKeyword: "mobile phone payment",
    description:
      "Top up your mobile balance instantly, pay utility bills, or recharge a friend's number — all in one place, with instant confirmation.",
    ctaLabel: "Recharge Now",
    ctaLink: "/products",
    themeColor: "emerald",
  },
  land: {
    slug: "land",
    title: "Daraz Land",
    tagline: "Grow your tree, harvest real rewards",
    unsplashKeyword: "garden plant growth",
    description:
      "Water your virtual tree daily, invite friends to help it grow faster, and harvest real coupons and vouchers once it's fully grown.",
    ctaLabel: "Visit Daraz Land",
    ctaLink: "/products",
    themeColor: "lime",
  },
};