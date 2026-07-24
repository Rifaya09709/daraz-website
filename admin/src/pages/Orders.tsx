import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../hooks/useAuth";
import { fetchAllOrders } from "../store/orderSlice";
import { Order, OrderStatus } from "../types/order";
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

const statusFilters: (OrderStatus | "All")[] = [
  "All",
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out For Delivery",
  "Delivered",
  "Cancelled",
];

const Orders = () => {
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector((state) => state.orders);

  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "All" || order.orderStatus === statusFilter;

    const matchesSearch =
      !search.trim() ||
      order.orderNumber.toLowerCase().includes(search.trim().toLowerCase()) ||
      (typeof order.user !== "string" &&
        order.user.name.toLowerCase().includes(search.trim().toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Orders</h1>

      <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by order number or customer name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-lg p-3 outline-none"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "All")}
          className="border rounded-lg p-3 outline-none bg-white md:w-56"
        >
          {statusFilters.map((status) => (
            <option key={status} value={status}>
              {status === "All" ? "All Statuses" : status}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </p>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-500">
                  <th className="px-6 py-4 font-medium">Order</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Items</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Payment</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order: Order) => (
                  <tr key={order._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link
                        to={`/orders/${order._id}`}
                        className="font-medium text-primary"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      {typeof order.user === "string" ? "—" : order.user.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {order.items.length} item(s)
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {order.paymentMethod}
                      <span
                        className={`ml-2 text-xs ${
                          order.paymentStatus === "Paid"
                            ? "text-green-600"
                            : order.paymentStatus === "Failed"
                            ? "text-red-500"
                            : "text-gray-400"
                        }`}
                      >
                        ({order.paymentStatus})
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          statusColors[order.orderStatus]
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;