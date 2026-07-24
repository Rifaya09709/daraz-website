
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../hooks/useAuth";
import {
  fetchCart,
  updateCartItem,
  deleteCartItem,
  applyCartCoupon,
} from "../store/cartSlice";
import { formatCurrency } from "../utils/formatCurrency";

const Cart = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { items, subtotal, discount, couponCode, loading, error } =
    useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [coupon, setCoupon] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    dispatch(fetchCart());
  }, [dispatch, isAuthenticated, navigate]);

  const handleIncrease = (productId: string, currentQty: number) => {
    dispatch(updateCartItem({ productId, quantity: currentQty + 1 }));
  };

  const handleDecrease = (productId: string, currentQty: number) => {
    if (currentQty > 1) {
      dispatch(updateCartItem({ productId, quantity: currentQty - 1 }));
    }
  };

  const handleRemove = (productId: string) => {
    dispatch(deleteCartItem(productId));
  };

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) return;
    setApplyingCoupon(true);
    await dispatch(applyCartCoupon(coupon.trim()));
    setApplyingCoupon(false);
  };

  const delivery = subtotal - discount > 5000 ? 0 : 99;
  const total = subtotal - discount + delivery;

  if (loading && items.length === 0) {
    return (
      <div className="flex justify-center items-center h-96 text-xl">
        Loading cart...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">
          Looks like you haven't added anything yet.
        </p>
        <Link
          to="/products"
          className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-orange-600"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 py-10">
      <h1 className="text-4xl font-bold mb-10">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-5">
          {items.map((item) => (
            <div
              key={item.product}
              className="bg-white rounded-xl shadow p-5 flex gap-5"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-32 h-32 rounded-lg object-cover"
              />

              <div className="flex-1">
                <h2 className="text-xl font-semibold">{item.name}</h2>

                <p className="text-primary text-2xl mt-2">
                  {formatCurrency(item.price)}
                </p>

                <div className="flex items-center gap-4 mt-5">
                  <button
                    onClick={() => handleDecrease(item.product, item.quantity)}
                    className="bg-gray-200 w-10 h-10 rounded"
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => handleIncrease(item.product, item.quantity)}
                    className="bg-gray-200 w-10 h-10 rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              <button onClick={() => handleRemove(item.product)}>
                <FaTrash className="text-red-500 text-xl" />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow p-6 h-fit">
          <h2 className="text-2xl font-bold mb-5">Order Summary</h2>

          {/* Coupon */}
          <div className="mb-5">
            {couponCode ? (
              <div className="flex justify-between items-center bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm">
                <span>Coupon "{couponCode}" applied</span>
              </div>
            ) : (
              <div className="flex">
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="w-full border rounded-l-lg p-2 outline-none text-sm"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={applyingCoupon}
                  className="bg-primary text-white px-4 rounded-r-lg text-sm"
                >
                  Apply
                </button>
              </div>
            )}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <div className="flex justify-between mb-3">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between mb-3 text-green-600">
              <span>Discount</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}

          <div className="flex justify-between mb-3">
            <span>Delivery</span>
            <span>{delivery === 0 ? "FREE" : formatCurrency(delivery)}</span>
          </div>

          <hr className="my-5" />

          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>

          <Link
            to="/checkout"
            className="block mt-8 text-center bg-primary hover:bg-orange-600 text-white py-3 rounded-lg"
          >
            Proceed To Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
