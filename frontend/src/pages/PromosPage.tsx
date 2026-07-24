import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaBullhorn, FaCog } from "react-icons/fa";

interface PromoItem {
  id: string;
  title: string;
  timestamp: string;
  caption: string;
  bannerImages: string[]; // 4 images per banner -> auto-slides inside the card
}

// loremflickr gives real category-matched photos via keyword,
// "lock" keeps the same 4 images stable on every reload instead of random each time
const imgSet = (keyword: string) =>
  [1, 2, 3, 4].map(
    (n) => `https://loremflickr.com/900/450/${keyword}?lock=${keyword}-${n}`
  );

const promos: PromoItem[] = [
  {
    id: "1",
    title: "FLAT 50% OFF🔥",
    timestamp: "Yesterday",
    caption: "Bata Exclusive Shoes Collection — Grab the offer now🛒",
    bannerImages: imgSet("shoes"),
  },
  {
    id: "2",
    title: "✅HARPIC ✅LIZOL ✅TRIX",
    timestamp: "Yesterday",
    caption: "Free mug with every purchase🎁",
    bannerImages: imgSet("kitchenware"),
  },
  {
    id: "3",
    title: "Just Dropped🔥",
    timestamp: "22/07/2026",
    caption: "🎧Oraimo Brand Deals LIVE🔴 Up to 51% OFF🔥 Shop Now🛒",
    bannerImages: imgSet("headphones"),
  },
  {
    id: "4",
    title: "FLAT 20% OFF🔥",
    timestamp: "22/07/2026",
    caption: "✨RFL Best Buy — Everything within your budget💸",
    bannerImages: imgSet("bags"),
  },
  {
    id: "5",
    title: "Candy Coins Expiring Soon ❗",
    timestamp: "21/07/2026",
    caption: "If you don't claim NOW, they'll be gone FOREVER ❗",
    bannerImages: imgSet("giftbox"),
  },
  {
    id: "6",
    title: "RANGS eMart Exclusive🔥",
    timestamp: "21/07/2026",
    caption: "Up to 30% off — Branded TV, Fridge + 100% Official Warranty",
    bannerImages: imgSet("laptop"),
  },
  {
    id: "7",
    title: "Tech Tuesday Special🔥",
    timestamp: "21/07/2026",
    caption: "Branded Headphones, Smartwatch, Power Bank — Up to 51% off🔥",
    bannerImages: imgSet("smartphone"),
  },
  {
    id: "8",
    title: "UP TO 45% OFF🔥",
    timestamp: "20/07/2026",
    caption: "🏠 Curtain, Wall Clock, Rugs, Decor for your home ✨",
    bannerImages: imgSet("dress"),
  },
];

const AUTO_SLIDE_MS = 3000;

/** Mini slider inside ONE card. Each instance has its own timer,
 *  so every banner rotates through its 4 images independently. */
const BannerAutoSlider = ({ images, alt }: { images: string[]; alt: string }) => {
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, AUTO_SLIDE_MS);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <div className="relative overflow-hidden rounded-xl h-44 bg-gray-100">
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((src, i) =>
          failed.has(i) ? (
            <div
              key={i}
              className="w-full h-full shrink-0 bg-gradient-to-r from-orange-400 to-amber-300"
            />
          ) : (
            <img
              key={i}
              src={src}
              alt={alt}
              className="w-full h-full shrink-0 object-cover"
              onError={() => setFailed((prev) => new Set(prev).add(i))}
            />
          )
        )}
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-4 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const PromoCard = ({ promo }: { promo: PromoItem }) => (
  <div className="border border-gray-200 rounded-2xl p-4 mb-4">
    <div className="flex items-center gap-3 mb-3">
      <span className="flex items-center justify-center w-9 h-9 rounded-full bg-rose-500 text-white shrink-0">
        <FaBullhorn size={14} />
      </span>
      <div>
        <p className="font-bold text-gray-900 leading-tight">{promo.title}</p>
        <p className="text-xs text-gray-400">{promo.timestamp}</p>
      </div>
    </div>

    <BannerAutoSlider images={promo.bannerImages} alt={promo.title} />

    <p className="text-sm text-gray-700 mt-3">{promo.caption}</p>
  </div>
);

const PromosPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <div className="flex items-center justify-between px-4 py-4 sticky top-0 bg-white z-10">
        <button onClick={() => navigate(-1)} aria-label="Go back" className="text-gray-800">
          <FaChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Promos</h1>
        <button aria-label="Promo settings" className="text-gray-800">
          <FaCog size={20} />
        </button>
      </div>

      <div className="px-4">
        {promos.map((p) => (
          <PromoCard key={p.id} promo={p} />
        ))}
      </div>
    </div>
  );
};

export default PromosPage;