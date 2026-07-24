import { useEffect, useState } from "react";

import { getLatestProducts } from "../../services/product.service";
import { Product } from "../../types/product";
import ProductCard from "../product/ProductCard";

// Fixed rotation of 5 images used ONLY in this "Just For You" section —
// keeps the row visually consistent instead of mismatched product photos.
// Replace these with your own hosted images whenever you like.
const JUST_FOR_YOU_IMAGES = [
  "https://images.unsplash.com/photo-1550985616-10810253b84d?w=500&q=80", // light bulb
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80", // laptop
  "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80", // dress / fashion
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80", // phone
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", // headphones
];

const JustForYou = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getLatestProducts();
      setProducts(res.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Just For You</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-gray-200 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-8">Just For You</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {products.map((product, index) => (
          <ProductCard
            key={product._id}
            product={product}
            imageOverride={JUST_FOR_YOU_IMAGES[index % JUST_FOR_YOU_IMAGES.length]}
          />
        ))}
      </div>
    </section>
  );
};

export default JustForYou;