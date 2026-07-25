import { Link } from "react-router-dom";
import { FaStar, FaTruck, FaCoins } from "react-icons/fa";

import { Product } from "../../types/product";
import { getPrimaryImage, getFinalPrice } from "../../utils/helpers";
import { formatCurrency } from "../../utils/formatCurrency";

interface ProductCardProps {
  product: Product;
  /** Optional override for the card image — used by sections like
   * "Just For You" that cycle through a fixed set of images instead of
   * each product's own photos. Leave unset everywhere else. */
  imageOverride?: string;
}

const ProductCard = ({ product, imageOverride }: ProductCardProps) => {
  const image = imageOverride || getPrimaryImage(product.images);
  const finalPrice = getFinalPrice(product);

  // ⚠️ These two fields aren't in the Product type/schema yet — add them
  // (e.g. `freeDelivery: boolean` and `coinsSave: number`) wherever your
  // Product model/type is defined, then remove this optional-chaining
  // fallback once they're guaranteed to exist.
  const hasFreeDelivery = Boolean((product as any).freeDelivery);
  const coinsSave = (product as any).coinsSave as number | undefined;
  const hasCoins = Boolean(coinsSave && coinsSave > 0);

  return (
    <Link
      to={`/product/${product._id}`}
      className="group bg-white rounded-lg border border-gray-100 hover:shadow-lg transition-shadow duration-200 overflow-hidden block"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-50">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />

        {product.discountPercentage > 0 && (
          <span className="absolute top-2 left-2 bg-primary text-white text-[11px] font-semibold px-1.5 py-0.5 rounded">
            -{product.discountPercentage}%
          </span>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-xs font-semibold bg-black/60 px-2 py-1 rounded">
              Out of Stock
            </span>
          </div>
        )}

        {/* Free Delivery / Coins badge strip — bottom-left, segments flush
            against each other so they read as one continuous bar */}
        {(hasFreeDelivery || hasCoins) && (
          <div className="absolute bottom-0 left-0 flex text-[10px] font-bold text-white leading-none">
            {hasFreeDelivery && (
              <span className="flex items-center gap-1 bg-emerald-600 px-2 py-1">
                <FaTruck size={10} />
                FREE DELIVERY
              </span>
            )}
            {hasCoins && (
              <span className="flex items-center gap-1 bg-amber-500 px-2 py-1">
                <FaCoins size={10} />
                COINS
              </span>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5">
        <h3 className="text-[13px] text-gray-700 line-clamp-2 leading-snug h-9">
          {product.name}
        </h3>

        <div className="mt-1.5 flex items-baseline gap-1.5 flex-wrap">
          <span className="text-primary font-semibold text-[15px]">
            {formatCurrency(finalPrice)}
          </span>
          {product.discountPrice && (
            <span className="text-gray-400 text-xs line-through">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>

        {hasCoins && (
          <span className="mt-1 inline-block bg-amber-100 text-amber-800 text-[11px] font-medium px-1.5 py-0.5 rounded">
            Coins save {formatCurrency(coinsSave as number)}
          </span>
        )}

        {product.totalReviews > 0 && (
          <div className="mt-1 flex items-center gap-1">
            <div className="flex text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar
                  key={i}
                  size={9}
                  className={i < Math.round(product.rating) ? "" : "text-gray-200"}
                />
              ))}
            </div>
            <span className="text-[11px] text-gray-400">
              ({product.totalReviews})
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;