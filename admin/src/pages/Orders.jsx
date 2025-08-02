import React, { useEffect, useState } from 'react';
import { Eye, Download, X, FileSpreadsheet } from 'lucide-react';
import api from '../api/axios';
import * as XLSX from 'xlsx';

const statusList = ["Processing", "Shipped", "Delivered", "Cancelled"];
const statusColors = {
  Processing: "bg-yellow-100 text-yellow-800",
  Shipped: "bg-blue-100 text-blue-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders');
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}`, { orderStatus: newStatus });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const openCancelModal = (order) => {
    setOrderToCancel(order);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setOrderToCancel(null);
  };

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;

    setCancelling(true);
    try {
      const response = await api.put(`/orders/${orderToCancel._id}/cancel?admin=true`);
      if (response.data.success) {
        fetchOrders();
        closeCancelModal();
      } else {
        alert(response.data.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const exportToExcel = () => {
    const exportData = orders.map(order => ({
      'Order ID': order._id,
      'Customer Name': order.user?.name || 'Guest',
      'Customer Email': order.user?.email || 'N/A',
      'Total Amount': order.totalPrice,
      'Original Amount': order.originalPrice || order.totalPrice,
      'Discount': order.discountAmount || 0,
      'Coupon Code': order.couponCode || 'N/A',
      'Status': order.orderStatus,
      'Payment Method': order.paymentMethod || 'N/A',
      'Payment Status': order.paymentStatus || 'N/A',
      'Order Date': new Date(order.createdAt).toLocaleDateString(),
      'Items Count': order.orderItems?.length || 0,
      'Items': order.orderItems?.map(item => `${item.product?.name || 'Unknown'} (Qty: ${item.quantity})`).join('; ') || 'N/A'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    
    const fileName = `orders_export_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      processing: orders.filter(o => o.orderStatus === 'Processing').length,
      shipped: orders.filter(o => o.orderStatus === 'Shipped').length,
      delivered: orders.filter(o => o.orderStatus === 'Delivered').length,
      cancelled: orders.filter(o => o.orderStatus === 'Cancelled').length,
      totalRevenue: orders.filter(o => o.orderStatus !== 'Cancelled').reduce((sum, o) => sum + (o.totalPrice || 0), 0)
    };
    return stats;
  };



  if (loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  const stats = getOrderStats();

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-4xl font-bold text-gray-900">Orders Management</h1>
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <FileSpreadsheet className="w-5 h-5" />
          Export to Excel
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium text-gray-500">Processing</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.processing}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium text-gray-500">Shipped</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.shipped}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium text-gray-500">Delivered</h3>
          <p className="text-3xl font-bold text-green-600">{stats.delivered}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium text-gray-500">Cancelled</h3>
          <p className="text-3xl font-bold text-red-600">{stats.cancelled}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">₹{stats.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Orders Cards */}
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-xl shadow p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">#{order._id?.slice(-8)}</h3>
                  <StatusBadge status={order.orderStatus} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Customer:</span> {order.user?.name || order.user?.email || "Guest"}
                  </div>
                  <div>
                    <span className="font-medium">Amount:</span> ₹{order.totalPrice?.toLocaleString()}
                    {order.originalPrice && order.originalPrice > order.totalPrice && (
                      <span className="text-green-600 ml-2">
                        (₹{order.discountAmount?.toLocaleString()} off)
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Items:</span> {order.orderItems?.length || 0} item(s)
                  </div>
                  <div>
                    <span className="font-medium">Payment:</span> {order.paymentMethod || 'N/A'}
                  </div>
                  {order.couponCode && (
                    <div>
                      <span className="font-medium">Coupon:</span> {order.couponCode}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <select
                  value={order.orderStatus || "Processing"}
                  onChange={e => handleStatusChange(order._id, e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statusList.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50" title="View Details">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  {/* Cancel button - only show for orders that can be cancelled */}
                  {(order.orderStatus === "Processing" || order.orderStatus === "Shipped") && (
                    <button
                      className="p-2 rounded-lg border border-red-300 hover:bg-red-50"
                      title="Cancel Order"
                      onClick={() => openCancelModal(order)}
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cancel Order Confirmation Modal */}
      {showCancelModal && orderToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Order</h3>
              <p className="text-gray-600 mb-2">
                Are you sure you want to cancel order <strong>#{orderToCancel._id?.slice(-8)}</strong>?
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Customer: {orderToCancel.user?.name || orderToCancel.user?.email || 'Guest'} • Amount: ₹{orderToCancel.totalPrice?.toLocaleString()}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={closeCancelModal}
                  disabled={cancelling}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
