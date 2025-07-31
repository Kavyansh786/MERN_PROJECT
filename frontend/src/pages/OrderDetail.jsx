import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useToast } from '../components/Toast';
import { getUserId } from '../utils/userUtils';

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const userId = getUserId();

        if (!userId) {
          setError('Please login to view order details');
          setLoading(false);
          return;
        }

        const response = await axios.get(`/orders/${orderId}?userId=${userId}`);
        
        if (response.data.success) {
          setOrder(response.data.order);
        } else {
          setError('Failed to fetch order details');
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError(err.response?.data?.message || 'Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderTimeline = (order) => {
    const timeline = [
      {
        status: 'Order Placed',
        date: order.createdAt,
        completed: true,
        icon: '📋'
      },
      {
        status: 'Processing',
        date: order.createdAt,
        completed: order.orderStatus !== 'Cancelled',
        icon: '⚙️'
      },
      {
        status: 'Shipped',
        date: order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered' ? order.updatedAt : null,
        completed: order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered',
        icon: '📦'
      },
      {
        status: 'Delivered',
        date: order.orderStatus === 'Delivered' ? order.updatedAt : null,
        completed: order.orderStatus === 'Delivered',
        icon: '✅'
      }
    ];

    if (order.orderStatus === 'Cancelled') {
      timeline.push({
        status: 'Cancelled',
        date: order.updatedAt,
        completed: true,
        icon: '❌'
      });
    }

    return timeline;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf8f6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#D4AF37] mx-auto mb-4"></div>
          <p className="text-[#7c5c36] text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fdf8f6] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <button
            onClick={() => navigate('/orders')}
            className="bg-[#D4AF37] text-white px-6 py-3 rounded-lg hover:bg-[#B8941F] transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#fdf8f6] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#7c5c36] text-lg mb-4">Order not found</div>
          <button
            onClick={() => navigate('/orders')}
            className="bg-[#D4AF37] text-white px-6 py-3 rounded-lg hover:bg-[#B8941F] transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f6] py-10 px-4 print:bg-white print:py-0 print:px-0">
      <div className="max-w-4xl mx-auto print:max-w-none">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-[#e0c3a0] p-8 mb-8 print:shadow-none print:border print:rounded-none print:mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 print:flex-row">
            <div>
              <h1 className="text-3xl font-bold text-[#3e2d26] mb-2">Order Details</h1>
              <p className="text-[#7c5c36]">Order #{order._id}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 print:hidden">
              <button
                onClick={() => navigate('/orders')}
                className="bg-[#7c5c36] text-white px-6 py-3 rounded-lg hover:bg-[#5a3a1b] transition-colors"
              >
                Back to Orders
              </button>
            </div>
          </div>

          {/* Order Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-[#f7e1c7] rounded-xl p-4 border border-[#e0c3a0]">
              <h3 className="font-semibold text-[#3e2d26] mb-2">Order Status</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus}
              </span>
            </div>
            <div className="bg-[#f7e1c7] rounded-xl p-4 border border-[#e0c3a0]">
              <h3 className="font-semibold text-[#3e2d26] mb-2">Payment Status</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                {order.paymentStatus}
              </span>
            </div>
            <div className="bg-[#f7e1c7] rounded-xl p-4 border border-[#e0c3a0]">
              <h3 className="font-semibold text-[#3e2d26] mb-2">Order Date</h3>
              <p className="text-[#7c5c36]">{formatDate(order.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-[#e0c3a0] p-8 mb-8 print:shadow-none print:border print:rounded-none print:mb-4">
          <h2 className="text-2xl font-bold text-[#3e2d26] mb-6">Order Timeline</h2>
          <div className="space-y-4">
            {getOrderTimeline(order).map((step, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                  step.completed 
                    ? 'bg-[#D4AF37] text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${
                    step.completed ? 'text-[#3e2d26]' : 'text-gray-400'
                  }`}>
                    {step.status}
                  </h3>
                  {step.date && (
                    <p className="text-sm text-[#7c5c36]">
                      {formatDate(step.date)}
                    </p>
                  )}
                </div>
                {index < getOrderTimeline(order).length - 1 && (
                  <div className={`w-0.5 h-8 ${
                    step.completed ? 'bg-[#D4AF37]' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-[#e0c3a0] p-8 mb-8 print:shadow-none print:border print:rounded-none print:mb-4">
          <h2 className="text-2xl font-bold text-[#3e2d26] mb-6">Order Items</h2>
          <div className="space-y-6">
            {order.orderItems.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-4 p-4 bg-[#fdf8f6] rounded-xl border border-[#e0c3a0] print:bg-white print:border print:rounded-none">
                <div className="flex-shrink-0">
                  <img
                    src={item.product?.imageUrl || '/ring.jpg'}
                    alt={item.product?.name || 'Product'}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#3e2d26] text-lg mb-2">
                    {item.product?.name || 'Product Name'}
                  </h3>
                  <p className="text-[#7c5c36] mb-2">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-[#D4AF37] font-bold text-lg">
                    {formatPrice(item.product?.price || 0)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[#D4AF37] font-bold text-lg">
                    {formatPrice((item.product?.price || 0) * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-[#e0c3a0] p-8 mb-8 print:shadow-none print:border print:rounded-none print:mb-4">
          <h2 className="text-2xl font-bold text-[#3e2d26] mb-6">Shipping Address</h2>
          <div className="bg-[#f7e1c7] rounded-xl p-4 border border-[#e0c3a0] print:bg-white print:border print:rounded-none">
            <p className="text-[#3e2d26]">{order.shippingAddress?.city}</p>
            <p className="text-[#3e2d26]">{order.shippingAddress?.postalCode}</p>
            <p className="text-[#3e2d26]">{order.shippingAddress?.country}</p>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-[#e0c3a0] p-8 mb-8 print:shadow-none print:border print:rounded-none print:mb-4">
          <h2 className="text-2xl font-bold text-[#3e2d26] mb-6">Payment Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#f7e1c7] rounded-xl p-4 border border-[#e0c3a0] print:bg-white print:border print:rounded-none">
              <h3 className="font-semibold text-[#3e2d26] mb-2">Payment Method</h3>
              <p className="text-[#7c5c36] capitalize">{order.paymentMethod}</p>
            </div>
            {order.couponCode && (
              <div className="bg-[#f7e1c7] rounded-xl p-4 border border-[#e0c3a0] print:bg-white print:border print:rounded-none">
                <h3 className="font-semibold text-[#3e2d26] mb-2">Coupon Applied</h3>
                <p className="text-[#7c5c36]">{order.couponCode}</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-[#e0c3a0] p-8 print:shadow-none print:border print:rounded-none">
          <h2 className="text-2xl font-bold text-[#3e2d26] mb-6">Order Summary</h2>
          <div className="space-y-4">
            {order.originalPrice && order.originalPrice !== order.totalPrice && (
              <div className="flex justify-between items-center">
                <span className="text-[#7c5c36]">Original Price:</span>
                <span className="text-[#7c5c36] line-through">{formatPrice(order.originalPrice)}</span>
              </div>
            )}
            {order.discountAmount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-[#7c5c36]">Discount:</span>
                <span className="text-green-600 font-semibold">-{formatPrice(order.discountAmount)}</span>
              </div>
            )}
            <div className="border-t border-[#e0c3a0] pt-4">
              <div className="flex justify-between items-center">
                <span className="text-[#3e2d26] font-bold text-xl">Total:</span>
                <span className="text-[#D4AF37] font-bold text-2xl">{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-[#e0c3a0] p-8 mt-8 print:hidden">
          <h2 className="text-2xl font-bold text-[#3e2d26] mb-6">Actions</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/orders')}
              className="flex-1 bg-[#7c5c36] text-white px-6 py-3 rounded-lg hover:bg-[#5a3a1b] transition-colors font-semibold"
            >
              Back to Orders
            </button>
            {order.orderStatus === 'Delivered' && (
              <button
                onClick={() => navigate('/contact')}
                className="flex-1 bg-[#D4AF37] text-[#3e2d26] px-6 py-3 rounded-lg hover:bg-[#B8941F] transition-colors font-semibold"
              >
                Contact Support
              </button>
            )}
            {order.orderStatus === 'Processing' && (
              <button
                onClick={() => navigate('/contact')}
                className="flex-1 bg-[#D4AF37] text-[#3e2d26] px-6 py-3 rounded-lg hover:bg-[#B8941F] transition-colors font-semibold"
              >
                Cancel Order
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="flex-1 bg-[#a67c52] text-white px-6 py-3 rounded-lg hover:bg-[#8D6E63] transition-colors font-semibold"
            >
              Print Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 