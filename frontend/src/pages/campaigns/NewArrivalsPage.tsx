// src/pages/campaigns/NewArrivalsPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaShareAlt, FaEllipsisH } from "react-icons/fa";
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
}

const ProductCard = ({ p }: { p: Product }) => (
  <Link
    to={`/product/${p._id}`}
    className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col"
  >
    <img
      src={p.images?.[0]?.url}
      alt={p.images?.[0]?.alt || p.name}
      className="w-full aspect-square object-cover"
      onError={(e) => {
        (e.target as HTMLImageElement).src = "/placeholder-product.png";
      }}
    />
    <div className="p-2 flex flex-col gap-0.5">
      <p className="text-xs text-gray-700 line-clamp-2 leading-tight">{p.name}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-rose-600 font-bold text-sm">
          ৳{(p.discountPrice ?? p.price).toLocaleString()}
        </span>
        {p.discountPercentage ? (
          <span className="text-rose-500 bg-rose-50 text-[10px] font-semibold px-1.5 py-0.5 rounded">
            -{p.discountPercentage}%
          </span>
        ) : null}
      </div>
      {p.discountPrice && (
        <span className="text-gray-400 line-through text-xs">
          ৳{p.price.toLocaleString()}
        </span>
      )}
      {p.rating ? (
        <span className="text-[11px] text-gray-500">
          ★{p.rating} {p.sold ? `| ${p.sold} Sold` : ""}
        </span>
      ) : null}
    </div>
  </Link>
);

const GridSkeleton = () => (
  <div className="grid grid-cols-2 gap-3 px-4 py-3">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="animate-pulse bg-gray-100 rounded-lg aspect-square" />
    ))}
  </div>
);

const NewArrivalsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = async (pageNum: number) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);
      setError(null);

      const res = await api.get("/api/products", {
        params: { page: pageNum, limit: 20 },
      });

      const newProducts: Product[] = res.data.products || [];
      setProducts((prev) => (pageNum === 1 ? newProducts : [...prev, ...newProducts]));
      setHasMore(pageNum < (res.data.totalPages || 1));
    } catch (err) {
      console.error(err);
      setError("Failed to load new arrivals.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage);
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-10">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-2xl leading-none">‹</Link>
          <h1 className="font-bold text-lg">Fresh New Arrivals</h1>
        </div>
        <div className="flex items-center gap-4 text-gray-600">
          <FaSearch size={18} />
          <FaShareAlt size={18} />
          <FaEllipsisH size={18} />
        </div>
      </div>

      {/* Banner */}
      <div className="bg-orange-500 text-white text-center font-extrabold text-lg py-3 mx-0">
        Just For You
      </div>

      {error && <p className="text-center text-sm text-red-500 py-4">{error}</p>}

      {loading ? (
        <GridSkeleton />
      ) : products.length === 0 ? (
        <p className="text-center text-gray-400 py-10">No new arrivals found.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 px-4 py-3">
            {products.map((p) => (
              <ProductCard key={p._id} p={p} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center py-4">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="bg-rose-600 text-white text-sm font-semibold px-6 py-2 rounded-full disabled:opacity-50"
              >
                {loadingMore ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NewArrivalsPage;