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
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80", // sneakers
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80", // watch
  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80", // backpack
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80", // sunglasses
  "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=500&q=80", // camera
  "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=500&q=80", // handbag
  "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500&q=80", // desk lamp
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80", // coffee maker
  "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80", // keyboard
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80", // sunglasses alt
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&q=80", // shoes
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=500&q=80", // smartwatch
  "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=500&q=80", // t-shirt
  "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80", // wireless earbuds
  "https://images.unsplash.com/photo-1524498658760-59f2528bee0e?w=500&q=80", // chair
  "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=80", // perfume bottle
  "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500&q=80", // sneaker alt
  "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=500&q=80", // makeup
  "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&q=80", // gaming console
  "https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=500&q=80", // wallet
  "https://images.unsplash.com/photo-1543512214-318c7553f230?w=500&q=80", // sports shoes
  "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80", // mouse
  "https://images.unsplash.com/photo-1608667508764-33cf0726b13a?w=500&q=80", // ring / jewelry
  "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&q=80", // blender
  "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&q=80", // jacket
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