import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaShoppingBag,
  FaBoxOpen,
  FaUsers,
  FaRupeeSign,
  FaExclamationTriangle,
  FaClock,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  getDashboardSummary,
  getRevenueChart,
  getRecentOrders,
  getTopProducts,
} from "../services/stats.service";
import { Order } from "../types/order";
import { Product } from "../types/product";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDate, getPrimaryImage } from "../utils/helpers";

interface Summary {
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  totalRevenue: number;
  lowStockProducts: number;
}

interface RevenuePoint {
  _id: string;
  total: number;
  orders: number;
}

const statusColors: Record<string, string> = {
  Pending: "bg-gray-100 text-gray-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Packed: "bg-purple-100 text-purple-700",
  Shipped: "bg-indigo-100 text-indigo-700",
  "Out For Delivery": "bg-yellow-100 text-yellow-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const Dashboard = () => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [revenue, setRevenue] = useState<RevenuePoint[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [summaryRes, revenueRes, ordersRes, productsRes] =
        await Promise.all([
          getDashboardSummary(),
          getRevenueChart(),
          getRecentOrders(),
          getTopProducts(),
        ]);

      setSummary(summaryRes.summary);
      setRevenue(revenueRes.revenue);
      setRecentOrders(ordersRes.orders);
      setTopProducts(productsRes.products);
    } catch (error) {
      console.error("Failed to load dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !summary) {
    return (
      <div className="grid grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-gray-200 animate-pulse" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Total Revenue",
      value: formatCurrency(summary.totalRevenue),
      icon: <FaRupeeSign size={22} />,
      color: "bg-green-500",
    },
    {
      label: "Total Orders",
      value: summary.totalOrders,
      icon: <FaShoppingBag size={22} />,
      color: "bg-blue-500",
    },
    {
      label: "Total Products",
      value: summary.totalProducts,
      icon: <FaBoxOpen size={22} />,
      color: "bg-purple-500",
    },
    {
      label: "Total Customers",
      value: summary.totalCustomers,
      icon: <FaUsers size={22} />,
      color: "bg-orange-500",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl shadow p-6 flex items-center gap-4"
          >
            <div className={`${card.color} text-white p-4 rounded-lg`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {(summary.pendingOrders > 0 || summary.lowStockProducts > 0) && (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {summary.pendingOrders > 0 && (
            <Link
              to="/orders"
              className="flex items-center gap-4 bg-yellow-50 border border-yellow-200 rounded-xl p-5 hover:bg-yellow-100 transition"
            >
              <FaClock className="text-yellow-600" size={24} />
              <div>
                <p className="font-semibold text-yellow-800">
                  {summary.pendingOrders} orders need attention
                </p>
                <p className="text-sm text-yellow-700">
                  Orders that are not yet delivered or cancelled
                </p>
              </div>
            </Link>
          )}

          {summary.lowStockProducts > 0 && (
            <Link
              to="/products"
              className="flex items-center gap-4 bg-red-50 border border-red-200 rounded-xl p-5 hover:bg-red-100 transition"
            >
              <FaExclamationTriangle className="text-red-600" size={24} />
              <div>
                <p className="font-semibold text-red-800">
                  {summary.lowStockProducts} products low on stock
                </p>
                <p className="text-sm text-red-700">
                  5 or fewer units remaining
                </p>
              </div>
            </Link>
          )}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-5">Revenue — Last 7 Days</h2>

          {revenue.length === 0 ? (
            <p className="text-gray-400 text-center py-16">
              No orders in the last 7 days
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="_id"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })
                  }
                  fontSize={12}
                />
                <YAxis fontSize={12} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  }
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#F85606"
                  strokeWidth={3}
                  dot={{ fill: "#F85606", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-5">Top Selling Products</h2>

          {topProducts.length === 0 ? (
            <p className="text-gray-400 text-center py-16">
              No sales data yet
            </p>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product) => (
                <div key={product._id} className="flex items-center gap-3">
                  <img
                    src={getPrimaryImage(product.images)}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.sold} sold
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">Recent Orders</h2>
          <Link to="/orders" className="text-primary text-sm font-medium">
            View All
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-gray-400 text-center py-10">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b last:border-0">
                    <td className="py-3">
                      <Link
                        to={`/orders/${order._id}`}
                        className="font-medium text-primary"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3">
                      {typeof order.user === "string" ? "—" : order.user.name}
                    </td>
                    <td className="py-3 text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3 font-medium">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="py-3">
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

export default Dashboard;