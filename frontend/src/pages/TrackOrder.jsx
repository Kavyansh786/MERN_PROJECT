import React, { useState } from 'react';
import axios from 'axios';
import { getUserId } from '../utils/userUtils';

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [orderFound, setOrderFound] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState('');

  const handleTrackOrder = async () => {
    if (!orderNumber.trim()) {
      setError('Please enter an order ID');
      return;
    }

    setIsTracking(true);
    setError('');
    
    try {
      const userId = getUserId();
      const response = await axios.get(`http://localhost:5000/api/orders/${orderNumber}?userId=${userId}`);
      
      if (response.data.success) {
        const order = response.data.order;
        setOrderFound(true);
        setTrackingData({
          orderId: order._id,
          status: order.orderStatus,
          estimatedDelivery: getEstimatedDelivery(order.createdAt, order.orderStatus),
          trackingNumber: `TRK${order._id.slice(-8).toUpperCase()}`,
          order: order, // Store the full order data
          shippingAddress: order.shippingAddress,
          items: order.orderItems
        });
      } else {
        setError('Order not found');
        setOrderFound(false);
      }
    } catch (error) {
      console.error('Tracking error:', error);
      setError(error.response?.data?.message || 'Failed to track order');
      setOrderFound(false);
    } finally {
      setIsTracking(false);
    }
  };

  const getEstimatedDelivery = (createdAt, status) => {
    const orderDate = new Date(createdAt);
    const deliveryDate = new Date(orderDate);
    
    if (status === 'Delivered') {
      return 'Delivered';
    } else if (status === 'Cancelled') {
      return 'Cancelled';
    } else {
      deliveryDate.setDate(deliveryDate.getDate() + 3); // Add 3 days
      return deliveryDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
  };

  const trackingSteps = [
    {
      id: 1,
      title: "Order Confirmed",
      description: "Your order has been received and confirmed",
      date: "Dec 15, 2024 - 2:30 PM",
      completed: true,
      icon: "✓"
    },
    {
      id: 2,
      title: "Crafting in Progress",
      description: "Our artisans are carefully crafting your jewelry",
      date: "Dec 16, 2024 - 10:00 AM",
      completed: true,
      icon: "⭐"
    },
    {
      id: 3,
      title: "Quality Check",
      description: "Final quality inspection and packaging",
      date: "Dec 18, 2024 - 3:45 PM",
      completed: true,
      icon: "✓"
    },
    {
      id: 4,
      title: "Shipped",
      description: "Your order is on its way to you",
      date: "Dec 19, 2024 - 9:15 AM",
      completed: false,
      current: true,
      icon: "🚚"
    },
    {
      id: 5,
      title: "Delivered",
      description: "Package delivered to your address",
      date: "Expected: Dec 21, 2024",
      completed: false,
      icon: "📦"
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-between px-2 sm:px-6 overflow-hidden">
      {/* Background Image and Overlays */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/jj.jpg)' }}
        ></div>
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center flex-1 min-h-[70vh] pt-2 pb-10">
        {/* Heading and Tagline */}
        <div className="w-full">
          <div className="text-center mb-4">
            <h2 className="text-6xl font-bold tracking-wide text-gray-800 drop-shadow-lg mb-4" style={{fontFamily: 'Georgia, serif'}}>
              Track Your Order
            </h2>
            <p className="text-gray-600 text-xl font-light tracking-wide" style={{fontFamily: 'Arial, sans-serif'}}>
              Follow your precious jewelry's journey
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 w-full">
          {!orderFound ? (
            /* Order Search Section */
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">📦</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Track Your Order</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Enter your order number to see the latest updates on your precious jewelry
                </p>
              </div>

              <div className="max-w-md mx-auto bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-[#e0c3a0] p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Order Number</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                      <input
                        type="text"
                        placeholder="e.g., LJ-2024-001234"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        className="w-full pl-10 h-12 border-2 border-[#e0c3a0] rounded-xl focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 focus:outline-none"
                      />
                    </div>
                  </div>
                  {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                      {error}
                    </div>
                  )}
                  <button
                    onClick={handleTrackOrder}
                    disabled={!orderNumber || isTracking}
                    className="w-full h-12 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] hover:from-[#B8941F] hover:to-[#E6C200] text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl"
                  >
                    {isTracking ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Tracking...</span>
                      </div>
                    ) : (
                      "Track Order"
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-[#D4AF37] text-xl">⏰</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">Real-time Updates</h4>
                  <p className="text-sm text-gray-600">Get instant notifications about your order status</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-[#D4AF37] text-xl">📍</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">Precise Tracking</h4>
                  <p className="text-sm text-gray-600">Know exactly where your jewelry is at all times</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-[#D4AF37] text-xl">⭐</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">Premium Care</h4>
                  <p className="text-sm text-gray-600">Your precious items handled with utmost care</p>
                </div>
              </div>
            </div>
          ) : (
            /* Order Tracking Results */
            <div className="space-y-8 animate-in fade-in duration-700">
              {/* Order Header */}
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-[#e0c3a0] p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Order #{trackingData?.orderId}</h3>
                    <p className="text-base mt-1 text-gray-600">Placed on December 15, 2024</p>
                  </div>
                  <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    {trackingData?.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Estimated Delivery</h4>
                    <p className="text-2xl font-bold text-[#D4AF37]">{trackingData?.estimatedDelivery}</p>
                    <p className="text-sm text-gray-600">2-3 business days</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Shipping Address</h4>
                    {trackingData?.shippingAddress ? (
                      <p className="text-sm text-gray-600">
                        {trackingData.shippingAddress.fullName}
                        <br />
                        {trackingData.shippingAddress.phone}
                        <br />
                        {trackingData.shippingAddress.street}
                        <br />
                        {trackingData.shippingAddress.city}, {trackingData.shippingAddress.state} {trackingData.shippingAddress.postalCode}
                        <br />
                        {trackingData.shippingAddress.country}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">No shipping address available</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Tracking Number</h4>
                    <p className="text-sm font-mono bg-gray-100 px-3 py-2 rounded">{trackingData?.trackingNumber}</p>
                    <button className="text-xs bg-transparent border border-[#D4AF37] text-[#D4AF37] px-3 py-1 rounded hover:bg-[#D4AF37] hover:text-white transition-colors">
                      Copy to Clipboard
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-[#e0c3a0] p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-4">
                  {trackingData?.items?.map((item, index) => (
                    <div key={item._id || index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-[#f7e1c7] to-[#e0c3a0] rounded-lg">
                      <div className="w-16 h-16 rounded-lg overflow-hidden">
                        {item.product?.imageUrl ? (
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#D4AF37] to-[#FFD700] flex items-center justify-center">
                            <span className="text-2xl">💍</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.product?.name || item.name}</h4>
                        <p className="text-sm text-gray-600">{item.product?.description || 'Premium jewelry item'}</p>
                        <p className="text-sm text-gray-500">Product ID: {item.product?._id?.slice(-8) || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₹{item.product?.price?.toLocaleString() || item.price?.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tracking Timeline */}
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-[#e0c3a0] p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Order Timeline</h3>
                <p className="text-gray-600 mb-6">Track your order's journey from our atelier to your doorstep</p>
                <div className="space-y-6">
                  {trackingSteps.map((step, index) => (
                    <div key={step.id} className="relative">
                      {index < trackingSteps.length - 1 && (
                        <div
                          className={`absolute left-6 top-12 w-0.5 h-16 ${
                            step.completed ? "bg-gradient-to-b from-green-400 to-green-500" : "bg-gray-200"
                          }`}
                        />
                      )}
                      <div className="flex items-start space-x-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            step.completed
                              ? "bg-gradient-to-r from-green-400 to-green-500 text-white"
                              : step.current
                                ? "bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white animate-pulse"
                                : "bg-gray-200 text-gray-400"
                          }`}
                        >
                          <span className="text-lg">{step.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3">
                            <h4
                              className={`font-semibold ${
                                step.completed || step.current ? "text-gray-900" : "text-gray-500"
                              }`}
                            >
                              {step.title}
                            </h4>
                            {step.current && (
                              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-sm mt-1 ${
                              step.completed || step.current ? "text-gray-600" : "text-gray-400"
                            }`}
                          >
                            {step.description}
                          </p>
                          <p
                            className={`text-xs mt-2 ${
                              step.completed || step.current ? "text-gray-500" : "text-gray-400"
                            }`}
                          >
                            {step.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Support Section */}
              <div className="bg-gradient-to-r from-[#f7e1c7] to-[#e0c3a0] rounded-3xl p-6">
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Need Help?</h3>
                  <p className="text-gray-600">Our customer service team is here to assist you</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button className="flex items-center justify-center space-x-2 bg-transparent border border-[#D4AF37] text-[#D4AF37] px-4 py-2 rounded-xl hover:bg-[#D4AF37] hover:text-white transition-colors">
                      <span>📞</span>
                      <span>Call Support</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 bg-transparent border border-[#D4AF37] text-[#D4AF37] px-4 py-2 rounded-xl hover:bg-[#D4AF37] hover:text-white transition-colors">
                      <span>✉️</span>
                      <span>Email Us</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Track Another Order */}
              <div className="text-center">
                <button
                  onClick={() => {
                    setOrderFound(false);
                    setOrderNumber("");
                    setTrackingData(null);
                  }}
                  className="text-[#D4AF37] hover:text-[#B8941F] hover:bg-[#D4AF37]/10 px-4 py-2 rounded-xl transition-colors"
                >
                  Track Another Order
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 