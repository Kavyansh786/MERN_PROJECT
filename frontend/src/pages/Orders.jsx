import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getUserId } from '../utils/userUtils';

function StatusBadge({ status }) {
  let color = 'bg-[#D4AF37] text-[#4a2c2a]';
  if (status === 'Delivered') color = 'bg-green-200 text-green-900';
  else if (status === 'Pending') color = 'bg-yellow-100 text-yellow-900';
  else if (status === 'Cancelled') color = 'bg-red-200 text-red-900';
  return (
    <span className={`inline-block px-3 py-1 rounded-full font-semibold text-xs shadow-sm ${color}`}>{status}</span>
  );
}

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    // Get user from localStorage
    const userId = getUserId();

    if (!userId) {
      setError('Please login to view your orders');
      setLoading(false);
      return;
    }

    axios.get(`http://localhost:5000/api/orders/my?userId=${userId}`)
      .then((res) => {
        if (res.data.success) {
          setOrders(res.data.orders || []);
        } else {
          setError(res.data.message || 'Failed to fetch orders');
        }
      })
      .catch((err) => {
        console.error('Error fetching orders:', err);
        setError('Failed to fetch orders');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
        {/* Heading and Tagline at the very top */}
        <div className="w-full">
          <div className="text-center mb-4">
            <h2 className="text-6xl font-bold tracking-wide text-gray-800 drop-shadow-lg mb-4" style={{fontFamily: 'Georgia, serif'}}>
              Your Orders
            </h2>
            <p className="text-gray-600 text-xl font-light tracking-wide" style={{fontFamily: 'Arial, sans-serif'}}>
              Timeless Elegance, Crafted with Love
            </p>
          </div>
        </div>

      {loading && (
        <div className="text-center mb-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
          <p className="mt-2 text-[#fff6ee]/60">Loading your orders...</p>
        </div>
      )}

      {error && (
        <div className="text-[#f39c6b] text-center mb-4 bg-[#4a3b35] px-4 py-2 rounded shadow animate-fade-in font-semibold">{error}</div>
      )}

      {!loading && orders.length === 0 && !error && (
        <div className="text-center">
          <p className="text-[#fff6ee]/60 animate-fade-in mb-4">No orders found.</p>
          <p className="text-[#fff6ee]/40 text-sm">Start shopping to see your orders here!</p>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div className="space-y-8 max-w-3xl mx-auto w-full">
          {orders.map((order, idx) => (
            <div key={order._id} className={`p-6 border-2 border-[#f7c59f] rounded-3xl shadow-2xl bg-white/95 backdrop-blur-sm text-[#3e2d26] transition-all duration-300 group animate-slide-fade-in delay-${idx * 100} hover:-translate-y-2 hover:shadow-3xl hover:border-[#f39c6b] hover:ring-2 hover:ring-[#f7c59f]/40 relative overflow-hidden`}>
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#fdf8f6] via-white to-[#f7e1c7] opacity-80 group-hover:opacity-90 transition-opacity duration-300 rounded-3xl"></div>
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                  <div>
                    <p className="mb-1 text-lg"><strong className="text-[#a67c52]">Order ID:</strong> <span className="tracking-wider">#{order._id}</span></p>
                    <p className="mb-1 text-lg"><strong className="text-[#a67c52]">Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p className="mb-1 text-lg">
                      <strong className="text-[#a67c52]">Total:</strong> 
                      <span className="font-bold">₹{order.totalPrice?.toLocaleString() || '—'}</span>
                      {order.originalPrice && order.originalPrice > order.totalPrice && (
                        <span className="text-sm text-green-600 ml-2">
                          (Saved ₹{(order.originalPrice - order.totalPrice).toLocaleString()})
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={order.orderStatus} />
                    <div className="flex gap-2">
                      <button
                        className="mt-2 px-4 py-1 rounded-full bg-[#D4AF37] text-[#4a2c2a] font-bold shadow hover:bg-[#fff6ee] hover:text-[#bfa14a] transition text-sm border border-[#D4AF37]"
                        onClick={() => toggleExpand(order._id)}
                      >
                        {expanded[order._id] ? 'Hide Details' : 'View Details'}
                      </button>
                      <button
                        className="mt-2 px-4 py-1 rounded-full bg-[#7c5c36] text-white font-bold shadow hover:bg-[#5a3a1b] transition text-sm border border-[#7c5c36]"
                        onClick={() => navigate(`/orders/${order._id}`)}
                      >
                        Full Details
                      </button>
                    </div>
                  </div>
                </div>
                {expanded[order._id] && (
                  <div className="mt-4 bg-white/80 rounded-xl p-4 border border-[#D4AF37]/30 animate-fade-in">
                    <h3 className="font-serif text-xl text-[#D4AF37] mb-2">Order Items</h3>
                    <ul className="mb-3 space-y-2">
                      {order.orderItems?.map((item, idx) => (
                        <li key={item._id || idx} className="flex items-center gap-3">
                          <img src={item.product?.imageUrl} alt={item.product?.name} className="w-12 h-12 object-cover rounded shadow border border-[#D4AF37]/30" />
                          <div>
                            <p className="font-semibold text-[#3e2d26]">{item.product?.name}</p>
                            <p className="text-sm text-[#a67c52]">Qty: {item.quantity} &bull; ₹{item.product?.price?.toLocaleString()}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <h3 className="font-serif text-xl text-[#D4AF37] mb-2">Order Summary</h3>
                    <div className="text-[#3e2d26] text-sm space-y-1 mb-4">
                      {order.originalPrice && (
                        <div className="flex justify-between">
                          <span>Original Price:</span>
                          <span>₹{order.originalPrice.toLocaleString()}</span>
                        </div>
                      )}
                      {order.discountAmount && order.discountAmount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount ({order.couponCode}):</span>
                          <span>-₹{order.discountAmount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold border-t pt-1">
                        <span>Final Total:</span>
                        <span>₹{order.totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-serif text-xl text-[#D4AF37] mb-2">Shipping Address</h3>
                    <div className="text-[#3e2d26] text-sm">
                      {order.shippingAddress ? (
                        <>
                          <div>{order.shippingAddress.city} - {order.shippingAddress.postalCode}</div>
                          <div>{order.shippingAddress.country}</div>
                        </>
                      ) : (
                        <div>No address info</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
