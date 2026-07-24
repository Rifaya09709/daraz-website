import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaArrowLeft, FaSearch, FaSyncAlt, FaEllipsisV } from "react-icons/fa";
import { campaigns } from "../types/campaigns.data";
import { formatCurrency } from "../utils/formatCurrency";
import { getProductsByCategory, getLatestProducts } from "../services/product.service";
import { getPrimaryImage, getFinalPrice } from "../utils/helpers";
import { getCategoryIcon } from "../utils/categoryIcons";
import { Product } from "../types/product";
import { resolveDbCategory } from "../constants/categories";

// Maps every `imageKeyword` used across campaigns.data.ts to an image that
// actually matches the category, so tapping "Women" shows dresses, "Men"
// shows menswear, "Gadgets" shows gadgets, etc. — instead of whatever
// unrelated photo happened to be on the product record.
const CATEGORY_IMAGES: Record<string, string> = {
  "delivery,truck": "https://images.unsplash.com/photo-1601591356789-ba8dfa8e9b3d?w=500&q=80",
  "fashion,clothing": "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80",
  "electronics,gadget": "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&q=80",
  "grocery,products": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80",
  "lifestyle,home": "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=500&q=80",
  "kitchen,cookware": "https://images.unsplash.com/photo-1584990347449-a5d9f800a783?w=500&q=80",
  "tools,hardware": "https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=500&q=80",
  "gift,shopping": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80",
  "beauty,skincare": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80",
  "gift,box": "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=500&q=80",
  "cosmetics,sample": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=80",
  "wheel,prize": "https://images.unsplash.com/photo-1518481852452-9415b262eba4?w=500&q=80",
  "friends,invite": "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=500&q=80",
  "smartphone,mobile": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80",
  "headphones,accessories": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
  "smartwatch,wearable": "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=500&q=80",
  "recycle,phone": "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&q=80",
  "laptop,electronics": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
  "dress,fashion": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80",
  "makeup,beauty": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=80",
  "home,decor": "https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?w=500&q=80",
  "skincare,serum": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80",
  "makeup,lipstick": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80",
  "haircare,shampoo": "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&q=80",
  "perfume,fragrance": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&q=80",
  "new,arrival": "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=500&q=80",
  "camera,gadget": "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=500&q=80",
  "candle,decor": "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=500&q=80",
  "women,dress": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80",
  "men,shirt": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80",
  "kids,clothing": "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=500&q=80",
  "handbag,accessories": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80",
  "livestream,shopping": "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&q=80",
  "auction,gavel": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&q=80",
  "sale,discount": "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=500&q=80",
  "group,people": "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&q=80",
};

const FALLBACK_IMAGE = "https://placehold.co/400x400?text=No+Image";

const themeClasses: Record<
  string,
  { heroBg: string; chipBg: string; chipText: string; tabActiveBg: string; voucherAccent: string }
> = {
  emerald: { heroBg: "bg-emerald-500", chipBg: "bg-emerald-100", chipText: "text-emerald-700", tabActiveBg: "bg-emerald-500", voucherAccent: "text-emerald-600" },
  amber:   { heroBg: "bg-amber-400",   chipBg: "bg-amber-100",   chipText: "text-amber-700",   tabActiveBg: "bg-amber-400",   voucherAccent: "text-rose-500" },
  rose:    { heroBg: "bg-rose-500",    chipBg: "bg-rose-100",    chipText: "text-rose-700",    tabActiveBg: "bg-rose-500",    voucherAccent: "text-rose-600" },
  indigo:  { heroBg: "bg-indigo-600",  chipBg: "bg-indigo-100",  chipText: "text-indigo-700",  tabActiveBg: "bg-indigo-600",  voucherAccent: "text-indigo-600" },
  violet:  { heroBg: "bg-violet-600",  chipBg: "bg-violet-100",  chipText: "text-violet-700",  tabActiveBg: "bg-violet-600",  voucherAccent: "text-violet-600" },
  pink:    { heroBg: "bg-pink-500",    chipBg: "bg-pink-100",    chipText: "text-pink-700",    tabActiveBg: "bg-pink-500",    voucherAccent: "text-pink-600" },
  sky:     { heroBg: "bg-sky-500",     chipBg: "bg-sky-100",     chipText: "text-sky-700",     tabActiveBg: "bg-sky-500",     voucherAccent: "text-sky-600" },
  lime:    { heroBg: "bg-lime-500",    chipBg: "bg-lime-100",    chipText: "text-lime-700",    tabActiveBg: "bg-lime-500",    voucherAccent: "text-lime-600" },
  slate:   { heroBg: "bg-slate-700",   chipBg: "bg-slate-100",   chipText: "text-slate-700",   tabActiveBg: "bg-slate-700",   voucherAccent: "text-slate-700" },
};

const CampaignHeader = ({ title }: { title: string }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white sticky top-0 z-10 border-b">
      <button onClick={() => navigate(-1)} className="text-gray-700">
        <FaArrowLeft size={18} />
      </button>
      <h1 className="flex-1 text-lg font-bold text-gray-900">{title}</h1>
      <button className="text-gray-500"><FaSearch size={16} /></button>
      <button className="text-gray-500"><FaSyncAlt size={16} /></button>
      <button className="text-gray-500"><FaEllipsisV size={16} /></button>
    </div>
  );
};

const CampaignPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const config = slug ? campaigns[slug] : undefined;
  const [activeTab, setActiveTab] = useState(0);

  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (config && config.categories.length > 0) {
      setSelectedCategory(config.categories[0].label);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    if (!selectedCategory || !slug) return;

    setLoading(true);
    const mapped = resolveDbCategory(slug, selectedCategory);

    // No DB category mapped for this chip (promo-only labels like
    // "Free Delivery", "Live Shopping", "Choice Deals" etc.) — show
    // latest products instead of an empty grid.
    const request = mapped?.category
      ? getProductsByCategory(mapped.category, mapped.subCategory, 20)
      : getLatestProducts();

    request
      .then((data) => setProducts(data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [selectedCategory, slug]);

  if (!config) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>This page isn't set up yet.</p>
        <Link to="/" className="text-primary font-medium">Go back home</Link>
      </div>
    );
  }

  const t = themeClasses[config.themeColor] ?? themeClasses.slate;

  // Look up the image that matches whichever category chip is selected —
  // falls back to each product's own image if the keyword isn't mapped.
  const activeCategoryConfig = config.categories.find((c) => c.label === selectedCategory);
  const categoryImage = activeCategoryConfig
    ? CATEGORY_IMAGES[activeCategoryConfig.imageKeyword]
    : undefined;

  return (
    <div className="max-w-2xl mx-auto pb-16 bg-gray-50 min-h-screen">
      <CampaignHeader title={config.pageTitle} />

      {/* Category row — now shown on both phone and laptop (md:hidden removed) */}
      <div className="flex gap-5 overflow-x-auto no-scrollbar px-4 py-5 bg-white">
        {config.categories.map((c) => {
          const Icon = getCategoryIcon(c.label, c.imageKeyword);
          const isActive = selectedCategory === c.label;
          return (
            <button
              key={c.label}
              onClick={() => setSelectedCategory(c.label)}
              className="flex flex-col items-center gap-1.5 shrink-0 w-16 text-center"
            >
              <span
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                  isActive ? `${t.tabActiveBg} text-white` : `${t.chipBg} ${t.chipText}`
                }`}
              >
                <Icon size={24} />
              </span>
              <span
                className={`text-[11px] leading-tight ${
                  isActive ? "font-bold text-gray-900" : "text-gray-600"
                }`}
              >
                {c.label}
              </span>
            </button>
          );
        })}
      </div>

      {config.layout === "shipping" ? (
        <>
          <div className={`${t.heroBg} text-white px-4 py-4 flex items-center justify-between`}>
            <div>
              <p className="font-bold text-base">{config.heroHeadline}</p>
              <p className="text-white/85 text-xs mt-0.5">{config.heroSubtext}</p>
            </div>
            <span className="bg-white/20 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">
              More →
            </span>
          </div>

          {config.steps && (
            <div className="grid grid-cols-3 gap-2 px-4 py-6 bg-white mt-2">
              {config.steps.map((s, i) => (
                <div key={s.title} className="text-center">
                  <div className={`w-10 h-10 mx-auto rounded-full ${t.chipBg} ${t.chipText} flex items-center justify-center font-bold text-sm mb-2`}>
                    {i + 1}
                  </div>
                  <p className="text-xs font-semibold text-gray-800 mb-1">{s.title}</p>
                  <p className="text-[11px] text-gray-500 leading-snug">{s.description}</p>
                </div>
              ))}
            </div>
          )}

          <p className="px-4 pt-5 pb-2 font-bold text-gray-900">
            {selectedCategory || "Deals For You"}
          </p>
        </>
      ) : (
        <>
          <div className={`${t.heroBg} text-white px-4 py-6 text-center`}>
            <p className="font-extrabold text-xl mb-1">{config.heroHeadline}</p>
            <p className="text-white/85 text-sm">{config.heroSubtext}</p>
          </div>

          {config.voucher && (
            <div className="bg-white mx-4 -mt-4 rounded-xl shadow p-4 flex items-center justify-between relative z-10">
              <div>
                <p className={`text-xl font-extrabold ${t.voucherAccent}`}>{config.voucher.discountLabel}</p>
                <p className="text-sm font-semibold text-gray-800">{config.voucher.title}</p>
                <p className="text-xs text-gray-400">{config.voucher.minSpend}</p>
                <p className="text-[11px] text-gray-400">{config.voucher.validity}</p>
              </div>
              <button className={`${t.heroBg} text-white text-sm font-semibold px-5 py-2 rounded-full`}>
                Collect
              </button>
            </div>
          )}

          {config.tabs && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-4">
              {config.tabs.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={`shrink-0 text-sm font-medium px-4 py-2 rounded-full ${
                    activeTab === i ? `${t.tabActiveBg} text-white` : "bg-white text-gray-600 border"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}

          <p className="px-4 pt-2 pb-2 font-bold text-gray-900">
            {selectedCategory}
          </p>
        </>
      )}

      <div className="grid grid-cols-2 gap-3 px-4 pb-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 rounded-lg bg-gray-200 animate-pulse" />
          ))
        ) : products.length === 0 ? (
          <p className="col-span-2 text-center text-gray-500 py-10">
            No products found for {selectedCategory}.
          </p>
        ) : (
          products.map((p) => (
            <Link
              key={p._id}
              to={`/product/${p._id}`}
              className="bg-white rounded-lg overflow-hidden border hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <img
                  src={categoryImage || getPrimaryImage(p.images)}
                  alt={p.name}
                  loading="lazy"
                  className="w-full aspect-square object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                />
                {p.isFlashSale && (
                  <span className={`absolute top-1.5 left-1.5 ${t.heroBg} text-white text-[10px] font-bold px-1.5 py-0.5 rounded`}>
                    SALE
                  </span>
                )}
              </div>
              <div className="p-2.5">
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(getFinalPrice(p))}
                </p>
                {p.discountPrice && (
                  <p className="text-xs text-gray-400 line-through">
                    {formatCurrency(p.price)}
                  </p>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default CampaignPage;