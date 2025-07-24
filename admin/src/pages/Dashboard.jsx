import { useEffect, useState } from "react";
import api from "../api/axios";
import { DollarSign, ShoppingCart, Users as UsersIcon, TrendingUp, TrendingDown, ChevronDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { parseISO, format } from "date-fns";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("7days");
  const [chartGranularity, setChartGranularity] = useState("monthly");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          api.get("/products"),
          api.get("/orders"),
          api.get("/users"),
        ]);
        const products = productsRes.data;
        const ordersFetched = ordersRes.data.orders || ordersRes.data;
        const users = usersRes.data;

        setOrders(ordersFetched);

        setStats({
          totalProducts: products.length,
          totalOrders: ordersFetched.length,
          totalUsers: users.length,
          totalRevenue: ordersFetched.reduce((sum, order) => sum + (order.totalPrice || 0), 0),
        });
        setRecentOrders(ordersFetched.slice(-3).reverse());
      } catch (err) {
        // handle error
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    // Aggregate orders by month or day based on chartGranularity
    let groupFormat = chartGranularity === "daily" ? "dd MMM yyyy" : "MMM yyyy";
    const groupedMap = {};
    orders.forEach(order => {
      const date = order.createdAt ? parseISO(order.createdAt) : new Date();
      const key = format(date, groupFormat);
      if (!groupedMap[key]) {
        groupedMap[key] = { sales: 0, revenue: 0 };
      }
      groupedMap[key].sales += 1;
      groupedMap[key].revenue += order.totalPrice || 0;
    });
    const salesData = Object.entries(groupedMap)
      .map(([name, values]) => ({ name, ...values }))
      .sort((a, b) => new Date(a.name) - new Date(b.name));
    setSalesData(salesData);
  }, [orders, chartGranularity]);

  const statusBadge = (status) => {
    if (!status) return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-400">No Status</span>;
    let color = "bg-gray-200 text-gray-700";
    if (status === "Delivered") color = "bg-green-100 text-green-700";
    else if (status === "Processing") color = "bg-orange-100 text-orange-700";
    else if (status === "Shipped") color = "bg-blue-100 text-blue-700";
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>{status}</span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h2 className="text-4xl font-bold text-gray-900">Dashboard</h2>
        <div className="flex gap-2 items-center">
          <select
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="appearance-none border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white shadow pr-8"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
          </select>
          <select
            value={chartGranularity}
            onChange={e => setChartGranularity(e.target.value)}
            className="appearance-none border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white shadow pr-8"
          >
            <option value="monthly">Monthly</option>
            <option value="daily">Daily</option>
          </select>
        </div>
      </div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Sales */}
        <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-semibold">Total Sales</p>
            <p className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
            <div className="flex items-center text-green-600 text-sm mt-1 font-semibold">
              <TrendingUp className="w-4 h-4 mr-1" />+20.1% from last month
            </div>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        {/* Total Orders */}
        <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-semibold">Total Orders</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
            <div className="flex items-center text-green-600 text-sm mt-1 font-semibold">
              <TrendingUp className="w-4 h-4 mr-1" />+15.3% from last month
            </div>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <ShoppingCart className="w-6 h-6 text-green-600" />
          </div>
        </div>
        {/* Total Users */}
        <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-semibold">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            <div className="flex items-center text-green-600 text-sm mt-1 font-semibold">
              <TrendingUp className="w-4 h-4 mr-1" />+8.2% from last month
            </div>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <UsersIcon className="w-6 h-6 text-purple-600" />
          </div>
        </div>
        {/* Revenue */}
        <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-semibold">Revenue</p>
            <p className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
            <div className="flex items-center text-red-600 text-sm mt-1 font-semibold">
              <TrendingDown className="w-4 h-4 mr-1" />-2.4% from last month
            </div>
          </div>
          <div className="p-3 bg-orange-100 rounded-full">
            <TrendingDown className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>
      {/* Sales Overview & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Sales Overview Chart */}
        <div className="bg-white rounded-xl shadow p-6 col-span-2 flex flex-col">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Sales Overview</h3>
          <p className="text-gray-500 mb-4">{chartGranularity === "daily" ? "Daily" : "Monthly"} sales and revenue data</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Recent Orders</h3>
          <p className="text-gray-500 mb-4">Latest customer orders</p>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order._id || order.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-gray-900">#{order._id ? order._id.slice(-5) : order.id}</p>
                  <p className="text-sm text-gray-600">{order.user?.name || order.customer || 'Guest'}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-gray-900">
                    ₹{order.totalPrice}
                  </span>
                  {statusBadge(order.orderStatus)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
