import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaShoppingCart } from "react-icons/fa";

import { useAppDispatch, useAppSelector } from "../hooks/useAuth";
import { fetchWishlist, removeWishlistItem } from "../store/wishlistSlice";
import { addItemToCart } from "../store/cartSlice";
import { getPrimaryImage, getFinalPrice } from "../utils/helpers";
import { formatCurrency } from "../utils/formatCurrency";

const Wishlist = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { items, loading } = useAppSelector((state) => state.wishlist);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    dispatch(fetchWishlist());
  }, [dispatch, isAuthenticated, navigate]);

  const handleRemove = (productId: string) => {
    dispatch(removeWishlistItem(productId));
  };

  const handleAddToCart = (productId: string) => {
    dispatch(addItemToCart({ productId, quantity: 1 }));
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex justify-center items-center h-96 text-xl">
        Loading wishlist...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Your wishlist is empty</h1>
        <p className="text-gray-500 mb-8">
          Save items you love so you can find them later.
        </p>
        <Link
          to="/products"
          className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-orange-600"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 py-10">
      <h1 className="text-4xl font-bold mb-10">My Wishlist</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const product = item.product;

          return (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow overflow-hidden"
            >
              <Link to={`/product/${product._id}`}>
                <img
                  src={getPrimaryImage(product.images)}
                  alt={product.name}
                  className="w-full h-56 object-cover"
                />
              </Link>

              <div className="p-4">
                <Link to={`/product/${product._id}`}>
                  <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                </Link>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(getFinalPrice(product))}
                  </span>

                  {product.discountPrice && (
                    <span className="line-through text-gray-400 text-sm">
                      {formatCurrency(product.price)}
                    </span>
                  )}
                </div>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => handleAddToCart(product._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-orange-600 text-white py-2 rounded-lg"
                  >
                    <FaShoppingCart size={14} />
                    Add to Cart
                  </button>

                  <button
                    onClick={() => handleRemove(product._id)}
                    className="border rounded-lg px-4 hover:bg-gray-50"
                  >
                    <FaTrash className="text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;