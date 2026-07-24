import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../hooks/useAuth";
import { fetchOrderById, changeOrderStatus, clearOrderError } from "../store/orderSlice";
import { OrderStatus } from "../types/order";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDate } from "../utils/helpers";

const statusColors: Record<OrderStatus, string> = {
  Pending: "bg-gray-100 text-gray-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Packed: "bg-purple-100 text-purple-700",
  Shipped: "bg-indigo-100 text-indigo-700",
  "Out For Delivery": "bg-yellow-100 text-yellow-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const allStatuses: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out For Delivery",
  "Delivered",
  "Cancelled",
];

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { selectedOrder: order, loading, updating, error } = useAppSelector(
    (state) => state.orders
  );

  const [pendingStatus, setPendingStatus] = useState<OrderStatus | "">("");

  useEffect(() => {
    if (id) dispatch(fetchOrderById(id));
    return () => {
      dispatch(clearOrderError());
    };
  }, [id, dispatch]);

  const handleStatusChange = (status: OrderStatus) => {
    setPendingStatus(status);
  };

  const confirmStatusChange = () => {
    if (!order || !pendingStatus) return;

    dispatch(
      changeOrderStatus({ orderId: order._id, status: pendingStatus })
    );
    setPendingStatus("");
  };

  if (loading || !order) {
    return (
      <div className="max-w-4xl space-y-4">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  const customer = typeof order.user === "string" ? null : order.user;

  return (
    <div className="max-w-5xl">
      <Link to="/orders" className="text-primary text-sm underline">
        ← Back to Orders
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mt-5 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Order {order.orderNumber}</h1>
          <p className="text-gray-500 mt-1">
            Placed on {formatDate(order.createdAt)} · Invoice #{order.invoiceNumber}
          </p>
        </div>

        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold h-fit ${statusColors[order.orderStatus]}`}
        >
          {order.orderStatus}
        </span>
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-6 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </p>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Items + Address */}
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
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Customer & Shipping</h2>

            {customer && (
              <div className="mb-4 pb-4 border-b">
                <p className="font-medium">{customer.name}</p>
                <p className="text-sm text-gray-500">{customer.email}</p>
                {customer.phone && (
                  <p className="text-sm text-gray-500">{customer.phone}</p>
                )}
              </div>
            )}

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

        {/* Status Update + Payment */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Update Status</h2>

            <select
              value={pendingStatus || order.orderStatus}
              onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
              className="w-full border rounded-lg p-3 outline-none bg-white mb-4"
            >
              {allStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <button
              onClick={confirmStatusChange}
              disabled={
                updating ||
                !pendingStatus ||
                pendingStatus === order.orderStatus
              }
              className="w-full bg-primary hover:bg-orange-600 text-white py-3 rounded-lg disabled:bg-gray-300"
            >
              {updating ? "Updating..." : "Update Status"}
            </button>

            {order.trackingId && (
              <p className="text-sm text-gray-500 mt-4">
                Tracking ID: <span className="font-semibold">{order.trackingId}</span>
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-6">
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

            <div className="flex justify-between text-lg font-bold mb-3">
              <span>Total</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>

            <p className="text-sm text-gray-500">
              {order.paymentMethod} · {order.paymentStatus}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;