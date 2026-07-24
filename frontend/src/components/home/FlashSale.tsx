import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaClock } from "react-icons/fa";

import { getFlashSaleProducts } from "../../services/product.service";
import { Product } from "../../types/product";
import ProductCard from "../product/ProductCard";

const FlashSale = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlashSale();
  }, []);

  const fetchFlashSale = async () => {
    try {
      const res = await getFlashSaleProducts();
      setProducts(res.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl md:text-2xl font-bold text-red-600 mb-5">
          🔥 Flash Sale
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-gray-200 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between bg-red-600 rounded-t-lg px-4 py-3">
        <div className="flex items-center gap-2 text-white">
          <FaClock size={16} />
          <h2 className="text-lg md:text-xl font-bold">Flash Sale</h2>
        </div>

        <Link
          to="/products"
          className="text-white text-xs md:text-sm font-medium hover:underline"
        >
          Shop All →
        </Link>
      </div>

      <div className="bg-white border border-t-0 border-gray-100 rounded-b-lg p-3 md:p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {products.slice(0, 12).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlashSale;