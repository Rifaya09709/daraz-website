import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

import { Order } from "../types/order";
import { formatCurrency } from "../utils/formatCurrency";

interface LocationState {
  order?: Order;
}

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const order = (location.state as LocationState)?.order;

  useEffect(() => {
    // Guard against direct URL access without an order in state
    if (!order) {
      navigate("/orders");
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <div className="max-w-2xl mx-auto px-5 py-16 text-center">
      <FaCheckCircle className="text-green-500 mx-auto" size={72} />

      <h1 className="text-3xl font-bold mt-6">Order Placed Successfully!</h1>
      <p className="text-gray-500 mt-3">
        Thank you for shopping with us. We'll notify you once your order ships.
      </p>

      <div className="bg-white rounded-xl shadow p-6 mt-10 text-left">
        <div className="flex justify-between border-b pb-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="font-semibold">{order.orderNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Tracking ID</p>
            <p className="font-semibold">{order.trackingId}</p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <hr className="my-4" />

        <div className="flex justify-between text-sm mb-2">
          <span>Subtotal</span>
          <span>{formatCurrency(order.subtotal)}</span>
        </div>

        {order.discount > 0 && (
          <div className="flex justify-between text-sm mb-2 text-green-600">
            <span>Discount</span>
            <span>-{formatCurrency(order.discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm mb-2">
          <span>Delivery</span>
          <span>
            {order.shippingCharge === 0
              ? "FREE"
              : formatCurrency(order.shippingCharge)}
          </span>
        </div>

        <hr className="my-4" />

        <div className="flex justify-between text-lg font-bold mb-2">
          <span>Total</span>
          <span>{formatCurrency(order.totalAmount)}</span>
        </div>

        <p className="text-sm text-gray-500 mt-3">
          Payment: {order.paymentMethod} ({order.paymentStatus})
        </p>
      </div>

      <div className="flex justify-center gap-4 mt-10">
        <Link
          to="/orders"
          className="bg-primary hover:bg-orange-600 text-white px-8 py-3 rounded-lg"
        >
          View My Orders
        </Link>

        <Link
          to="/products"
          className="border border-gray-300 hover:bg-gray-50 px-8 py-3 rounded-lg"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;