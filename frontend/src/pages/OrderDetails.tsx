import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import { getOrderById, cancelOrder } from "../services/order.service";
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

const statusSteps: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out For Delivery",
  "Delivered",
];

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/orders/${id}` } });
      return;
    }
    if (id) loadOrder(id);
  }, [id, isAuthenticated, navigate]);

  const loadOrder = async (orderId: string) => {
    try {
      setLoading(true);
      setError("");
      const res = await getOrderById(orderId);
      setOrder(res.order);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!order) return;
    try {
      setCancelling(true);
      await cancelOrder(order._id);
      await loadOrder(order._id);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  const canCancel = (status: OrderStatus) =>
    status !== "Delivered" && status !== "Cancelled";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-xl">
        Loading order...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">
          {error || "Order not found"}
        </h1>
        <Link to="/orders" className="text-primary underline">
          Back to My Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = statusSteps.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === "Cancelled";

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <Link to="/orders" className="text-primary text-sm underline">
        ← Back to My Orders
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mt-5 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Order {order.orderNumber}</h1>
          <p className="text-gray-500 mt-1">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold h-fit ${statusColors[order.orderStatus]}`}
        >
          {order.orderStatus}
        </span>
      </div>

      {/* Status Tracker */}
      {!isCancelled && (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex items-center">
            {statusSteps.map((step, index) => (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      index <= currentStepIndex
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-xs mt-2 text-center w-20">{step}</span>
                </div>

                {index < statusSteps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-1 ${
                      index < currentStepIndex ? "bg-primary" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {order.trackingId && (
            <p className="text-sm text-gray-500 mt-6">
              Tracking ID: <span className="font-semibold">{order.trackingId}</span>
            </p>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Items + Shipping */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Items</h2>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
            <p className="font-medium">{order.shippingAddress.fullName}</p>
            <p className="text-gray-600 text-sm mt-1">
              {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
              {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
            <p className="text-gray-600 text-sm mt-1">
              {order.shippingAddress.phone}
            </p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-xl shadow p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Payment Summary</h2>

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

          <div className="flex justify-between text-lg font-bold mb-4">
            <span>Total</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>

          <p className="text-sm text-gray-500">
            {order.paymentMethod} · {order.paymentStatus}
          </p>

          {canCancel(order.orderStatus) && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="w-full mt-6 border border-red-300 text-red-600 hover:bg-red-50 py-2 rounded-lg text-sm disabled:opacity-50"
            >
              {cancelling ? "Cancelling..." : "Cancel Order"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;