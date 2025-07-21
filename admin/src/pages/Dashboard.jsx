import { useEffect, useState } from "react";
import {
  Package,
  ShoppingCart,
  Users as UsersIcon,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Clock,
  User
} from "lucide-react";
import api from "../api/axios";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const productsRes = await api.get("/products");
      const productsCount = productsRes.data.products?.length || 0;
      const ordersRes = await api.get("/orders");
      const orders = ordersRes.data.orders || [];
      const ordersCount = orders.length;
      const revenue = orders.reduce((total, order) => total + (order.totalAmount || 0), 0);
      const usersRes = await api.get("/users");
      const usersCount = usersRes.data.users?.length || 0;
      setStats({
        totalProducts: productsCount,
        totalOrders: ordersCount,
        totalUsers: usersCount,
        totalRevenue: revenue
      });
      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans p-8">
      {/* Topbar */}
      <div className="flex items-center justify-end mb-6">
        <div className="flex items-center space-x-3 bg-white/80 px-4 py-2 rounded-full shadow border">
          <User className="w-6 h-6 text-[#D4AF37]" />
          <span className="font-semibold text-gray-800">Admin</span>
          <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37] bg-[#D4AF37] flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black tracking-wide mb-2">Dashboard</h1>
        <p className="text-[#D4AF37] font-medium">Overview of your jewelry store</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-[#fff6ee] hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Products</p>
              <p className="text-2xl font-bold text-black">{stats.totalProducts}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-[#fff6ee] hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-black">{stats.totalOrders}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-[#fff6ee] hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
              <p className="text-2xl font-bold text-black">{stats.totalUsers}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <UsersIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-[#fff6ee] hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-black">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-md border border-[#fff6ee] mb-8">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-black">Recent Orders</h2>
        </div>
        <div className="p-6">
          {recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No orders yet</p>
              <p className="text-gray-400 text-sm mt-2">Orders will appear here once customers start shopping</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-[#fff6ee] hover:bg-[#fbeedb] transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-black">Order #{order._id?.slice(-8)}</p>
                      <p className="text-sm text-gray-600">
                        {order.user?.name || "Guest"} • ₹{order.totalAmount}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status || "Pending"}
                    </span>
                    <button className="p-2 text-gray-400 hover:text-[#D4AF37] transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions & Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-[#fff6ee]">
          <h3 className="text-lg font-semibold text-black mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-[#D4AF37] text-white py-3 px-4 rounded-lg hover:bg-[#B8860B] transition-colors font-semibold">
              Add New Product
            </button>
            <button className="w-full bg-[#fff6ee] text-[#D4AF37] py-3 px-4 rounded-lg hover:bg-[#fbeedb] transition-colors font-semibold border border-[#D4AF37]">
              View All Orders
            </button>
            <button className="w-full bg-[#fff6ee] text-[#D4AF37] py-3 px-4 rounded-lg hover:bg-[#fbeedb] transition-colors font-semibold border border-[#D4AF37]">
              Manage Users
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-[#fff6ee]">
          <h3 className="text-lg font-semibold text-black mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-gray-700">New order received</p>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm text-gray-700">Product updated</p>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <p className="text-sm text-gray-700">New user registered</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-[#fff6ee]">
          <h3 className="text-lg font-semibold text-black mb-4">Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Sales Growth</span>
                <span className="text-green-600 font-semibold">+12%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Orders</span>
                <span className="text-blue-600 font-semibold">+8%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
