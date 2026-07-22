import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserId } from '../utils/userUtils';
import { useToast } from '../components/Toast';
import Footer from '../components/Footer';

function StatusBadge({ status }) {
  let color = 'bg-[#D4AF37] text-[#4a2c2a]';
  if (status === 'Delivered') color = 'bg-green-200 text-green-900';
  else if (status === 'Pending') color = 'bg-yellow-100 text-yellow-900';
  else if (status === 'Cancelled') color = 'bg-red-200 text-red-900';
  return (
    <span className={`inline-block px-3 py-1 rounded-full font-semibold text-xs shadow-sm ${color}`}>{status}</span>
  );
}

export default function OrderDetail() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { showToast } = useToast();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const userId = getUserId();

    if (!userId) {
      setError('Please login to view order details');
      setLoading(false);
      navigate('/login');
      return;
    }

    axios.get(`http://localhost:5000/api/orders/${orderId}?userId=${userId}`)
      .then((res) => {
        if (res.data.success) {
          setOrder(res.data.order);
        } else {
          setError(res.data.message || 'Failed to fetch order details');
        }
      })
      .catch((err) => {
        console.error('Error fetching order details:', err);
        setError('Failed to fetch order details');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [orderId, navigate]);

  const handleCancelOrder = async () => {
    setCancelling(true);
    const userId = getUserId();

    try {
      const response = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/cancel?userId=${userId}`
      );

      if (response.data.success) {
        // Update the order state with the cancelled order
        setOrder(response.data.order);
        setShowCancelModal(false);
        setError('');
        // Show success toast
        showToast({
          type: 'success',
          message: 'Order cancellation successful! Refund will be transferred in 2-3 business days.'
        });
      } else {
        setError(response.data.message || 'Failed to cancel order');
        showToast({
          type: 'error',
          message: response.data.message || 'Failed to cancel order'
        });
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      setError(err.response?.data?.message || 'Failed to cancel order');
      showToast({
        type: 'error',
        message: err.response?.data?.message || 'Failed to cancel order'
      });
    } finally {
      setCancelling(false);
      setShowCancelModal(false);
    }
  };

  const openCancelModal = () => {
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex flex-col justify-between px-2 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/jj.jpg)' }}></div>
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 w-full flex flex-col items-center justify-center flex-1 min-h-[70vh] pt-2 pb-10">
          <div className="text-center mb-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
            <p className="mt-2 text-[#fff6ee]/60">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen flex flex-col justify-between px-2 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/jj.jpg)' }}></div>
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 w-full flex flex-col items-center justify-center flex-1 min-h-[70vh] pt-2 pb-10">
          <div className="text-[#f39c6b] text-center mb-4 bg-[#4a3b35] px-4 py-2 rounded shadow animate-fade-in font-semibold">{error}</div>
          <button
            onClick={() => navigate('/orders')}
            className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] hover:from-[#B8941F] hover:to-[#E6C200] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="relative min-h-screen flex flex-col justify-between px-2 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/jj.jpg)' }}></div>
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 w-full flex flex-col items-center justify-center flex-1 min-h-[70vh] pt-2 pb-10">
          <div className="text-center">
            <p className="text-[#fff6ee]/60 animate-fade-in mb-4">Order not found.</p>
            <button
              onClick={() => navigate('/orders')}
              className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] hover:from-[#B8941F] hover:to-[#E6C200] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between px-2 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/jj.jpg)' }}></div>
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center justify-center flex-1 min-h-[70vh] pt-2 pb-10">
        <div className="w-full">
          <div className="text-center mb-4">
            <h2 className="text-6xl font-bold tracking-wide text-gray-800 drop-shadow-lg mb-4" style={{fontFamily: 'Georgia, serif'}}>
              Order Details
            </h2>
            <p className="text-gray-600 text-xl font-light tracking-wide" style={{fontFamily: 'Arial, sans-serif'}}>
              Order #{order._id}
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto w-full">
          <div className="p-6 border-2 border-[#f7c59f] rounded-3xl shadow-2xl bg-white/95 backdrop-blur-sm text-[#3e2d26] transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#fdf8f6] via-white to-[#f7e1c7] opacity-80 transition-opacity duration-300 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
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
                  {/* Cancel Order Button - only show if order can be cancelled */}
                  {(order.orderStatus === 'Processing' || order.orderStatus === 'Shipped') && (
                    <button
                      onClick={openCancelModal}
                      disabled={cancelling}
                      className="px-4 py-1 rounded-full bg-red-500 text-white font-bold shadow hover:bg-red-600 transition text-sm border border-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel Order
                    </button>
                  )}
                  <button
                    onClick={() => navigate('/orders')}
                    className="mt-2 px-4 py-1 rounded-full bg-[#D4AF37] text-[#4a2c2a] font-bold shadow hover:bg-[#fff6ee] hover:text-[#bfa14a] transition text-sm border border-[#D4AF37]"
                  >
                    Back to Orders
                  </button>
                </div>
              </div>

              <div className="bg-white/80 rounded-xl p-4 border border-[#D4AF37]/30 animate-fade-in">
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

                {/* Shipping Address Section */}
                {order.shippingAddress && (
                  <>
                    <h3 className="font-serif text-xl text-[#D4AF37] mb-2 mt-4">Shipping Address</h3>
                    <div className="text-[#3e2d26] text-sm space-y-1 mb-4 bg-[#fff6ee]/50 p-3 rounded-lg border border-[#D4AF37]/20">
                      <div><strong>Name:</strong> {order.shippingAddress.fullName}</div>
                      <div><strong>Phone:</strong> {order.shippingAddress.phone}</div>
                      <div><strong>Email:</strong> {order.shippingAddress.email}</div>
                      <div><strong>Address:</strong> {order.shippingAddress.street}</div>
                      <div><strong>City:</strong> {order.shippingAddress.city}, {order.shippingAddress.state}</div>
                      <div><strong>Postal Code:</strong> {order.shippingAddress.postalCode}</div>
                      <div><strong>Country:</strong> {order.shippingAddress.country}</div>
                    </div>
                  </>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Order</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this order? This action cannot be undone.
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
      <Footer />
    </div>
  );
} 