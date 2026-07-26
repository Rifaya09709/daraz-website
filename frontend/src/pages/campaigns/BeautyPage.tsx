import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { CATEGORIES, SUBCATEGORIES } from "@/config/categories";
import { campaigns } from "@/types/campaigns.data";

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  images: { url: string; alt: string }[];
  rating?: number;
  sold?: number;
  subCategory?: string;
}

const heroImage = campaigns.beauty.heroImage;

const ProductCard = ({ p }: { p: Product }) => (
  <Link
    to={`/product/${p._id}`}
    className="relative bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col"
  >
    {p.discountPercentage ? (
      <span className="absolute top-2 left-2 z-10 bg-rose-600 text-white text-xs font-bold px-2 py-0.5 rounded">
        -{p.discountPercentage}%
      </span>
    ) : null}
    <img
      src={p.images?.[0]?.url}
      alt={p.images?.[0]?.alt || p.name}
      className="w-full aspect-square object-cover"
      onError={(e) => {
        (e.target as HTMLImageElement).src = "/placeholder-product.png";
      }}
    />
    <div className="p-2 flex flex-col gap-0.5">
      <p className="text-xs text-gray-700 truncate">{p.name}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-rose-600 font-bold text-sm">
          ৳{(p.discountPrice ?? p.price).toLocaleString()}
        </span>
        {p.discountPrice && (
          <span className="text-gray-400 line-through text-xs">
            ৳{p.price.toLocaleString()}
          </span>
        )}
      </div>
      {p.rating && (
        <span className="text-[11px] text-gray-500">
          ★{p.rating} {p.sold ? `| ${p.sold} Sold` : ""}
        </span>
      )}
    </div>
  </Link>
);

const SectionHeader = ({ title }: { title: string }) => (
  <div className="mx-4 mt-6 mb-3 bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-center py-2.5 rounded-full">
    {title}
    <Link
      to="#"
      className="float-right mr-4 text-xs bg-white/20 px-3 py-1 rounded-full"
    >
      More ›
    </Link>
  </div>
);

const ProductRowSkeleton = () => (
  <div className="grid grid-cols-3 gap-2 px-4 py-3">
    {[1, 2, 3].map((i) => (
      <div key={i} className="animate-pulse bg-gray-100 rounded-lg aspect-square" />
    ))}
  </div>
);

const ProductRow = ({
  products,
  loading,
}: {
  products: Product[];
  loading: boolean;
}) =>
  loading ? (
    <ProductRowSkeleton />
  ) : products.length === 0 ? (
    <p className="text-center text-gray-400 text-sm py-4">No products found.</p>
  ) : (
    <div className="grid grid-cols-3 gap-2 px-4 py-3">
      {products.slice(0, 6).map((p) => (
        <ProductCard key={p._id} p={p} />
      ))}
    </div>
  );

const BeautyPage = () => {
  const [makeup, setMakeup] = useState<Product[]>([]);
  const [skincare, setSkincare] = useState<Product[]>([]);
  const [haircare, setHaircare] = useState<Product[]>([]);
  const [bodycare, setBodycare] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const [makeupRes, skincareRes, haircareRes, bodycareRes] = await Promise.all([
          api.get("/api/products", {
            params: { category: CATEGORIES.HEALTH_BEAUTY, subCategory: SUBCATEGORIES.MAKEUP, limit: 20 },
          }),
          api.get("/api/products", {
            params: { category: CATEGORIES.HEALTH_BEAUTY, subCategory: SUBCATEGORIES.BATH_BODY, limit: 20 },
          }),
          api.get("/api/products", {
            params: { category: CATEGORIES.HEALTH_BEAUTY, subCategory: SUBCATEGORIES.HAIR_CARE, limit: 20 },
          }),
          api.get("/api/products", {
            params: { category: CATEGORIES.HEALTH_BEAUTY, subCategory: SUBCATEGORIES.PERSONAL_CARE, limit: 20 },
          }),
        ]);

        setMakeup(makeupRes.data.products || []);
        setSkincare(skincareRes.data.products || []);
        setHaircare(haircareRes.data.products || []);
        setBodycare(bodycareRes.data.products || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load beauty products.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-10">
      {/* Hero banner */}
      <div className="relative bg-gradient-to-r from-rose-100 to-pink-50 p-4 overflow-hidden min-h-[160px]">
        <img
          src={heroImage}
          alt="Beauty"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-2xl leading-none">‹</Link>
          </div>
          <p className="text-3xl font-black text-rose-700 mt-2 leading-tight drop-shadow-sm">
            RADIANCE REVIVAL
          </p>
          <span className="inline-block mt-1 bg-yellow-300 text-gray-900 text-xs font-bold px-2 py-1 rounded-full">
            UP TO 60% OFF
          </span>
          <p className="text-rose-600 font-medium mt-1">Glow like spring</p>
        </div>
      </div>

      {error && <p className="text-center text-sm text-red-500 py-4">{error}</p>}

      {/* Makeup Favourites */}
      <SectionHeader title="Makeup Favourites" />
      <div className="flex gap-6 px-4 py-2 overflow-x-auto no-scrollbar">
        {["Lipsticks", "Eyeshadow", "Blush & Highlighter", "Tools & brushes", "Foundation"].map(
          (label) => (
            <Link
              key={label}
              to={`/search?subCategory=${encodeURIComponent(SUBCATEGORIES.MAKEUP)}&q=${encodeURIComponent(label)}`}
              className="flex flex-col items-center gap-1.5 shrink-0"
            >
              <span className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center text-[10px] font-bold text-rose-600 text-center px-1">
                {label.split(" ")[0]}
              </span>
              <span className="text-[11px] text-gray-700 w-16 text-center leading-tight">
                {label}
              </span>
            </Link>
          )
        )}
      </div>
      <ProductRow products={makeup} loading={loading} />

      {/* Skincare Favourites */}
      <SectionHeader title="Skincare Favourites" />
      <div className="flex gap-6 px-4 py-2 overflow-x-auto no-scrollbar">
        {["Facewash", "Creams & moisturizers", "Face mask & packs", "Lip balms"].map((label) => (
          <Link
            key={label}
            to={`/search?subCategory=${encodeURIComponent(SUBCATEGORIES.PERSONAL_CARE)}&q=${encodeURIComponent(label)}`}
            className="flex flex-col items-center gap-1.5 shrink-0"
          >
            <span className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center text-[10px] font-bold text-rose-600 text-center px-1">
              {label.split(" ")[0]}
            </span>
            <span className="text-[11px] text-gray-700 w-16 text-center leading-tight">
              {label}
            </span>
          </Link>
        ))}
      </div>
      <ProductRow products={skincare} loading={loading} />

      {/* Care by Need banner */}
      <div className="mx-4 my-4 bg-gradient-to-br from-sky-50 to-pink-50 rounded-xl p-4">
        <p className="text-center font-bold text-gray-700 mb-3">✨ Care by Need ✨</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Sun Care", to: "/search?q=sun care" },
            { label: "Lip Care", to: "/search?q=lip care" },
            { label: "Foot Care", to: "/search?q=foot care" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="bg-white rounded-lg overflow-hidden shadow-sm flex flex-col items-center py-4"
            >
              <span className="text-xs font-semibold text-gray-700">{item.label} ›</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Hair Care Favourites */}
      <SectionHeader title="Hair Care Favourites" />
      <div className="flex gap-6 px-4 py-2 overflow-x-auto no-scrollbar">
        {["Shampoo & Conditioner", "Hair oil & Mask", "Haircare Accessories", "Hair Colors"].map(
          (label) => (
            <Link
              key={label}
              to={`/search?subCategory=${encodeURIComponent(SUBCATEGORIES.HAIR_CARE)}&q=${encodeURIComponent(label)}`}
              className="flex flex-col items-center gap-1.5 shrink-0"
            >
              <span className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center text-[10px] font-bold text-rose-600 text-center px-1">
                {label.split(" ")[0]}
              </span>
              <span className="text-[11px] text-gray-700 w-16 text-center leading-tight">
                {label}
              </span>
            </Link>
          )
        )}
      </div>
      <ProductRow products={haircare} loading={loading} />

      {/* Groom with Greatness banner */}
      <div className="mx-4 my-4 bg-gradient-to-b from-yellow-50 to-cyan-50 rounded-xl p-6 text-center">
        <p className="font-black text-lg text-gray-800 mb-4">GROOM WITH GREATNESS</p>
        <div className="grid grid-cols-2 gap-4">
          {["Skin & Body", "Hair styling", "Shaving & Grooming", "Bodyspray & Deo"].map((label) => (
            <Link
              key={label}
              to={`/search?q=${encodeURIComponent(label)}`}
              className="bg-white/70 rounded-lg py-3 text-xs font-semibold text-gray-700"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Body Care Favourites */}
      <SectionHeader title="Body Care Favourites" />
      <div className="flex gap-6 px-4 py-2 overflow-x-auto no-scrollbar">
        {["Soap", "Shower gel", "Lotion", "Hair Removal"].map((label) => (
          <Link
            key={label}
            to={`/search?subCategory=${encodeURIComponent(SUBCATEGORIES.BATH_BODY)}&q=${encodeURIComponent(label)}`}
            className="flex flex-col items-center gap-1.5 shrink-0"
          >
            <span className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center text-[10px] font-bold text-rose-600 text-center px-1">
              {label.split(" ")[0]}
            </span>
            <span className="text-[11px] text-gray-700 w-16 text-center leading-tight">
              {label}
            </span>
          </Link>
        ))}
      </div>
      <ProductRow products={bodycare} loading={loading} />
    </div>
  );
};

export default BeautyPage;