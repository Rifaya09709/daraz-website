// src/pages/campaigns/MallPage.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import api from "@/lib/api";

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  images: { url: string; alt: string }[];
  rating?: number;
  sold?: number;
  brand?: string;
  category?: string;
}

// Group headings shown in the UI, mapped to your real DB category strings.
// Adjust the right-hand values to match `db.products.distinct("category")`.
const BRAND_SECTIONS = [
  { heading: "FASHION TOP BRANDS", category: "Men's Fashion" },
  { heading: "ELECTRONICS TOP BRANDS", category: "Electronic Devices" },
  { heading: "BEAUTY TOP BRANDS", category: "Health & Beauty" },
  { heading: "LIFESTYLE TOP BRANDS", category: "Home & Lifestyle" },
];

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
      <button className="mt-1 bg-rose-600 text-white text-xs font-semibold py-1.5 rounded">
        Shop now
      </button>
    </div>
  </Link>
);

const BrandChip = ({ name, to }: { name: string; to: string }) => (
  <Link to={to} className="flex flex-col items-center gap-1.5 text-center">
    <span className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden text-xs font-bold text-gray-700 shadow-sm">
      {name.slice(0, 2).toUpperCase()}
    </span>
    <span className="text-xs font-medium text-gray-700 w-16 truncate">{name}</span>
  </Link>
);

const SectionBanner = ({ title }: { title: string }) => (
  <div className="mx-4 mt-6 mb-3">
    <div className="bg-gradient-to-r from-purple-700 to-purple-500 text-white font-extrabold tracking-wide text-center py-3 rounded-md skew-x-[-2deg]">
      <span className="inline-block skew-x-[2deg]">{title}</span>
    </div>
  </div>
);

const BrandGridSkeleton = () => (
  <div className="grid grid-cols-4 gap-4 px-4 py-4">
    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <div key={i} className="flex flex-col items-center gap-1.5">
        <div className="w-16 h-16 rounded-full bg-gray-100 animate-pulse" />
        <div className="w-12 h-2 bg-gray-100 animate-pulse rounded" />
      </div>
    ))}
  </div>
);

const MallPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [brandsBySection, setBrandsBySection] = useState<Record<string, string[]>>({});
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoadingBrands(true);
        const results = await Promise.all(
          BRAND_SECTIONS.map((section) =>
            api.get("/api/products", {
              params: { category: section.category, limit: 100 },
            })
          )
        );

        const grouped: Record<string, string[]> = {};
        results.forEach((res, i) => {
          const products: Product[] = res.data.products || [];
          const uniqueBrands = Array.from(
            new Set(products.map((p) => p.brand).filter(Boolean))
          ) as string[];
          grouped[BRAND_SECTIONS[i].heading] = uniqueBrands.slice(0, 10);
        });
        setBrandsBySection(grouped);
      } catch (err) {
        console.error("Failed to load brands", err);
      } finally {
        setLoadingBrands(false);
      }
    };

    const fetchNewArrivals = async () => {
      try {
        setLoadingProducts(true);
        const res = await api.get("/api/products/latest");
        setNewArrivals(res.data.products || []);
      } catch (err) {
        console.error("Failed to load new arrivals", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchBrands();
    fetchNewArrivals();
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-10">
      {/* Search bar */}
      <div className="sticky top-0 z-20 bg-purple-800 px-4 py-3 flex items-center gap-2">
        <Link to="/" className="text-white text-xl">‹</Link>
        <div className="flex-1 flex items-center bg-white rounded-full overflow-hidden">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search in DarazMall"
            className="flex-1 px-4 py-2 text-sm outline-none"
          />
          <button onClick={handleSearch} className="px-4 py-2 bg-gray-100 text-gray-600">
            <FaSearch size={14} />
          </button>
        </div>
        <Link to="/cart" className="text-white">
          <FaShoppingCart size={20} />
        </Link>
      </div>

      {/* Brand sections grouped by category */}
      {BRAND_SECTIONS.map((section) => (
        <div key={section.heading}>
          <SectionBanner title={section.heading} />
          {loadingBrands ? (
            <BrandGridSkeleton />
          ) : brandsBySection[section.heading]?.length ? (
            <div className="grid grid-cols-4 gap-4 px-4 py-2">
              {brandsBySection[section.heading].map((brand) => (
                <BrandChip
                  key={brand}
                  name={brand}
                  to={`/search?brand=${encodeURIComponent(brand)}`}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 text-sm py-4">No brands found.</p>
          )}
        </div>
      ))}

      {/* New Arrivals */}
      <div className="bg-purple-800 text-white font-bold text-lg px-4 py-3 mt-6 flex items-center justify-between">
        <span>NEW ARRIVALS</span>
        <Link to="/campaign/new-arrivals" className="text-xs bg-white/20 px-3 py-1 rounded-full">
          More ›
        </Link>
      </div>
      {loadingProducts ? (
        <div className="grid grid-cols-3 gap-2 px-4 py-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-lg aspect-square" />
          ))}
        </div>
      ) : newArrivals.length === 0 ? (
        <p className="text-center text-gray-400 py-6">No new arrivals yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-2 px-4 py-3">
          {newArrivals.slice(0, 6).map((p) => (
            <ProductCard key={p._id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MallPage;