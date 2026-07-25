// src/pages/campaigns/OfficialMobilePage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaShieldAlt, FaBoxOpen, FaTruck, FaPercent } from "react-icons/fa";
import api from "@/lib/api"; // your existing axios/fetch instance

interface Product {
  _id: string;
  name: string;
  image: string;       // e.g. "/uploads/products/xyz.jpg" or full CDN URL from DB
  price: number;
  oldPrice?: number;
  discountPct?: number;
  rating?: number;
  sold?: number;
  section: "just-launched" | "premium" | "budget";
  brand?: string;
}

const trustBadges = [
  { Icon: FaShieldAlt, label: "Authentic" },
  { Icon: FaBoxOpen, label: "Official Warranty" },
  { Icon: FaTruck, label: "Daraz Shipping" },
  { Icon: FaPercent, label: "0% EMI" },
];

const ProductCard = ({ p }: { p: Product }) => (
  <Link
    to={`/product/${p._id}`}
    className="relative bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col"
  >
    {p.discountPct && (
      <span className="absolute top-2 left-2 z-10 bg-rose-600 text-white text-xs font-bold px-2 py-0.5 rounded">
        -{p.discountPct}%
      </span>
    )}
    <img
      src={p.image}
      alt={p.name}
      className="w-full aspect-square object-cover"
      onError={(e) => {
        // fallback if DB image path is broken/missing
        (e.target as HTMLImageElement).src = "/placeholder-phone.png";
      }}
    />
    <div className="p-2 flex flex-col gap-0.5">
      <p className="text-xs text-gray-700 truncate">{p.name}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-rose-600 font-bold text-sm">৳{p.price.toLocaleString()}</span>
        {p.oldPrice && (
          <span className="text-gray-400 line-through text-xs">৳{p.oldPrice.toLocaleString()}</span>
        )}
      </div>
      {p.rating && (
        <span className="text-[11px] text-gray-500">
          ★{p.rating} {p.sold ? `| ${p.sold} Sold` : ""}
        </span>
      )}
      <button className="mt-1 bg-rose-600 text-white text-xs font-semibold py-1.5 rounded">
        Shop now
      </button>
    </div>
  </Link>
);

const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="bg-sky-100 px-4 py-3 mt-6">
    <h2 className="font-bold text-lg">{title}</h2>
    {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
  </div>
);

const ProductGridSkeleton = () => (
  <div className="grid grid-cols-3 gap-2 px-4 py-3">
    {[1, 2, 3].map((i) => (
      <div key={i} className="animate-pulse bg-gray-100 rounded-lg aspect-square" />
    ))}
  </div>
);

const OfficialMobilePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<{ name: string; logo: string; to: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Backend endpoints — adjust paths to match your Node/Express routes
        const [productsRes, brandsRes] = await Promise.all([
          api.get("/api/products", { params: { category: "mobiles" } }),
          api.get("/api/brands", { params: { category: "mobiles" } }),
        ]);
        setProducts(productsRes.data.products); // each product.image comes straight from Mongo doc
        setBrands(
          brandsRes.data.brands.map((b: any) => ({
            name: b.name,
            logo: b.logo, // image field from brand doc in DB
            to: `/brand/${b.slug}`,
          }))
        );
      } catch (err) {
        console.error(err);
        setError("Failed to load mobile store data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const justLaunched = products.filter((p) => p.section === "just-launched");
  const premiumPhones = products.filter((p) => p.section === "premium");
  const budgetPhones = products.filter((p) => p.section === "budget");

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-10">
      {/* Hero banner */}
      <div className="relative bg-gradient-to-r from-orange-600 to-yellow-400 p-4 text-white overflow-hidden">
        <p className="text-2xl font-black leading-tight">Daraz</p>
        <p className="text-3xl font-black text-yellow-300 leading-tight">
          OFFICIAL MOBILE STORE
        </p>
        <div className="flex flex-wrap gap-3 mt-3 text-[11px]">
          {trustBadges.map(({ Icon, label }) => (
            <span key={label} className="flex items-center gap-1 bg-white/20 rounded px-2 py-1">
              <Icon size={12} /> {label}
            </span>
          ))}
        </div>
        <Link
          to="/campaign/mobiles/shop"
          className="inline-block mt-4 bg-yellow-300 text-gray-900 font-bold text-sm px-5 py-2 rounded-full"
        >
          Shop Now
        </Link>
      </div>

      {error && (
        <p className="text-center text-sm text-red-500 py-4">{error}</p>
      )}

      {/* Brand grid */}
      <div className="grid grid-cols-4 gap-4 px-4 py-6">
        {brands.map((b) => (
          <Link key={b.name} to={b.to} className="flex flex-col items-center gap-1.5 text-center">
            <span className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center overflow-hidden">
              <img src={b.logo} alt={b.name} className="w-10 h-10 object-contain" />
            </span>
            <span className="text-xs font-medium text-gray-700">{b.name}</span>
          </Link>
        ))}
      </div>

      {/* Just Launched */}
      <SectionHeader title="Just Launched" />
      {loading ? <ProductGridSkeleton /> : (
        <div className="grid grid-cols-3 gap-2 px-4 py-3">
          {justLaunched.map((p) => <ProductCard key={p._id} p={p} />)}
        </div>
      )}

      {/* Best Premium Phone */}
      <SectionHeader title="Best Premium Phone" subtitle="0% EMI Cost & Under 4,000/Month" />
      {loading ? <ProductGridSkeleton /> : (
        <div className="grid grid-cols-3 gap-2 px-4 py-3">
          {premiumPhones.map((p) => <ProductCard key={p._id} p={p} />)}
        </div>
      )}

      {/* Best Budget Phone */}
      <SectionHeader title="Best Budget Phone" subtitle="0% EMI Cost & Under 2,500/Month" />
      {loading ? <ProductGridSkeleton /> : (
        <div className="grid grid-cols-3 gap-2 px-4 py-3">
          {budgetPhones.map((p) => <ProductCard key={p._id} p={p} />)}
        </div>
      )}
    </div>
  );
};

export default OfficialMobilePage;