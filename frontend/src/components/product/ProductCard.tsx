import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

import { Product } from "../../types/product";
import { getPrimaryImage, getFinalPrice } from "../../utils/helpers";
import { formatCurrency } from "../../utils/formatCurrency";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const image = getPrimaryImage(product.images);
  const finalPrice = getFinalPrice(product);

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