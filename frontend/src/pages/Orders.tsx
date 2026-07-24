import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getMyOrders, cancelOrder } from "../services/order.service";
import { Order, OrderStatus } from "../types/order";
import { formatCurrency } from "../utils/formatCurrency";
import { useAppSelector } from "../hooks/useAuth";

const statusColors: Record<OrderStatus, string> = {
  Pending: "bg-gray-100 text-gray-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Packed: "bg-purple-100 text-purple-700",
  Shipped: "bg-indigo-100 text-indigo-700",
  "Out For Delivery": "bg-yellow-100 text-yellow-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const Orders = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    loadOrders();
  }, [isAuthenticated, navigate]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await getMyOrders();
      setOrders(res.orders);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId: string) => {
    try {
      setCancellingId(orderId);
      await cancelOrder(orderId);
      await loadOrders();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  const canCancel = (status: OrderStatus) =>
    status !== "Delivered" && status !== "Cancelled";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-xl">
        Loading orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">No orders yet</h1>
        <p className="text-gray-500 mb-8">
          When you place an order, it will show up here.
        </p>
        <Link
          to="/products"
          className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-orange-600"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <h1 className="text-4xl font-bold mb-10">My Orders</h1>

      {error && (
        <p className="text-red-500 text-sm mb-5">{error}</p>
      )}

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-xl shadow p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-semibold">{order.orderNumber}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Placed On</p>
                <p className="font-semibold">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-semibold">
                  {formatCurrency(order.totalAmount)}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold h-fit ${
                  statusColors[order.orderStatus]
                }`}
              >
                {order.orderStatus}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-5">
              <Link
                to={`/orders/${order._id}`}
                className="border border-gray-300 hover:bg-gray-50 px-5 py-2 rounded-lg text-sm"
              >
                View Details
              </Link>

              {canCancel(order.orderStatus) && (
                <button
                  onClick={() => handleCancel(order._id)}
                  disabled={cancellingId === order._id}
                  className="border border-red-300 text-red-600 hover:bg-red-50 px-5 py-2 rounded-lg text-sm disabled:opacity-50"
                >
                  {cancellingId === order._id ? "Cancelling..." : "Cancel Order"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;