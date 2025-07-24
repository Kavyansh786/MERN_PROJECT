import { useEffect, useState } from "react";
import {
  Eye,
  Download,
  Filter,
  Search,
} from "lucide-react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

const statusList = ["Pending", "Processing", "Shipped", "Delivered"];
const statusColors = {
  Pending: "text-blue-500",
  Processing: "text-yellow-600",
  Shipped: "text-green-600",
  Delivered: "text-gray-700",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders");
      setOrders(res.data.orders || []);
    } catch (error) {
      // handle error
    }
    setLoading(false);
  };

  // Status counts for summary
  const statusCounts = orders.reduce(
    (acc, order) => {
      const status = (order.orderStatus || order.status || "Pending").toLowerCase();
      if (status === "pending") acc.Pending++;
      else if (status === "processing") acc.Processing++;
      else if (status === "shipped") acc.Shipped++;
      else if (status === "delivered") acc.Delivered++;
      return acc;
    },
    { Pending: 0, Processing: 0, Shipped: 0, Delivered: 0 }
  );

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      !statusFilter ||
      (order.orderStatus || order.status || "Pending").toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toISOString().slice(0, 10);
  };

  const handleExport = () => {
    const data = orders.map(order => ({
      "Order ID": order._id,
      "Customer": order.user?.name || "Guest",
      "Amount (₹)": order.totalPrice,
      "Status": order.orderStatus || order.status || "Pending",
      "Date": formatDate(order.createdAt),
      "Items": order.items?.length || 0,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, "orders.xlsx");
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}`, { orderStatus: newStatus });
      fetchOrders();
    } catch (error) {
      // handle error
    }
  };

  // Helper to download a single order as CSV
  const handleDownloadOrder = (order) => {
    const data = [
      {
        "Order ID": order._id,
        "Customer": order.user?.name || "Guest",
        "Amount (₹)": order.totalPrice,
        "Status": order.orderStatus || order.status || "Pending",
        "Date": formatDate(order.createdAt),
        "Items": order.items?.length || 0,
      },
    ];
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Order");
    XLSX.writeFile(wb, `order-${order._id}.csv`, { bookType: "csv" });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-4xl font-bold text-gray-900">Orders</h1>
        <div className="flex gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white shadow hover:bg-gray-100"
            onClick={handleExport}
          >
            <Download className="w-5 h-5" /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white shadow hover:bg-gray-100">
            <Filter className="w-5 h-5" /> Filter
          </button>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-600">{statusCounts.Pending}</span>
          <span className="text-gray-600 mt-2">Pending</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-yellow-600">{statusCounts.Processing}</span>
          <span className="text-gray-600 mt-2">Processing</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-green-600">{statusCounts.Shipped}</span>
          <span className="text-gray-600 mt-2">Shipped</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-gray-800">{statusCounts.Delivered.toLocaleString()}</span>
          <span className="text-gray-600 mt-2">Delivered</span>
        </div>
      </div>

      {/* Search and Status Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white shadow w-full md:w-56"
        >
          <option value="">All Status</option>
          {statusList.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="text-gray-500 text-sm border-b">
              <th className="p-4 text-left font-semibold">Order ID</th>
              <th className="p-4 text-left font-semibold">Customer</th>
              <th className="p-4 text-left font-semibold">Amount</th>
              <th className="p-4 text-left font-semibold">Status</th>
              <th className="p-4 text-left font-semibold">Date</th>
              <th className="p-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">#{order._id?.slice(-5)}</td>
                <td className="p-4">{order.user?.name || "Guest"}</td>
                <td className="p-4 font-semibold text-gray-900">₹{order.totalPrice?.toLocaleString()}</td>
                <td className="p-4">
                  <select
                    value={order.orderStatus || order.status || "Pending"}
                    onChange={e => handleStatusChange(order._id, e.target.value)}
                    className={`px-3 py-1 rounded-lg border text-sm font-semibold ${statusColors[order.orderStatus || order.status || "Pending"] || "text-gray-700"}`}
                  >
                    {statusList.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td className="p-4">{formatDate(order.createdAt)}</td>
                <td className="p-4 flex gap-2">
                  <Link to={`/admin/orders/${order._id}`} className="p-2 rounded hover:bg-gray-100" title="View">
                    <Eye className="w-5 h-5 text-gray-600" />
                  </Link>
                  <button
                    className="p-2 rounded hover:bg-gray-100"
                    title="Download"
                    onClick={() => handleDownloadOrder(order)}
                  >
                    <Download className="w-5 h-5 text-gray-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



