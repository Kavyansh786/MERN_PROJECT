import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../components/Toast';
import Footer from '../components/Footer';
import axios from 'axios';
import { getUserId } from '../utils/userUtils';
import { buildApiUrl } from '../config/api';

// Load Razorpay script
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => resolve(null);
    document.body.appendChild(script);
  });
};

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [buyNowProduct, setBuyNowProduct] = useState(null);
  const [fromCart, setFromCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (location.state) {
      setSelectedAddress(location.state.selectedAddress);
      setBuyNowProduct(location.state.buyNowProduct);
      setFromCart(location.state.fromCart);
      
      // Get coupon information from location state
      if (location.state.couponData) {
        setCouponCode(location.state.couponData.code);
        setDiscount(location.state.discount || 0);
      }
    } else {
      showToast({ type: 'error', message: 'No address selected. Please go back to cart.' });
      navigate('/cart');
    }

    // Fallback: Get coupon information from localStorage if not in location state
    if (!location.state?.couponData) {
      const appliedCoupon = localStorage.getItem('appliedCoupon');
      if (appliedCoupon) {
        try {
          const couponData = JSON.parse(appliedCoupon);
          setCouponCode(couponData.code);
          setDiscount(couponData.discountAmount);
        } catch (error) {
          console.error('Error parsing coupon data:', error);
          localStorage.removeItem('appliedCoupon');
        }
      }
    }
  }, [location.state, navigate]);

  // Fetch cart items if coming from cart
  useEffect(() => {
    const fetchCartItems = async () => {
      const userId = getUserId();

      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(buildApiUrl(`/cart/${userId}`));
        setCartItems(response.data.items || []);
      } catch (error) {
        console.error('Failed to fetch cart items:', error);
        showToast({ type: 'error', message: 'Failed to load cart items.' });
      } finally {
        setLoading(false);
      }
    };

    if (fromCart) {
      fetchCartItems();
    } else {
      setLoading(false);
    }
  }, [fromCart]);

  // Calculate subtotal (before discount)
  const calculateSubtotal = () => {
    if (buyNowProduct) {
      return buyNowProduct.price * buyNowProduct.quantity;
    } else if (cartItems.length > 0) {
      return cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    }
    return 0;
  };

  // Calculate total amount (after discount)
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return Math.max(subtotal - discount, 0);
  };

  const handleRazorpayPayment = async () => {
    if (!selectedPaymentMethod) {
      showToast({ type: 'error', message: 'Please select a payment method' });
      return;
    }

    const total = calculateTotal();
    if (total <= 0) {
      showToast({ type: 'error', message: 'Invalid order total. Please check your cart.' });
      return;
    }

    if (selectedPaymentMethod === 'cod') {
      handlePaymentSuccess();
      return;
    }

    setProcessingPayment(true);
    try {
      const orderResponse = await axios.post(buildApiUrl('/payment/create-order'), {
        amount: calculateTotal(),
        currency: 'INR',
        receipt: `order_${Date.now()}`
      });

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message || 'Order creation failed');
      }



      // Load Razorpay for real payments
      const Razorpay = await loadRazorpay();
      if (!Razorpay) {
        showToast({ type: 'error', message: 'Failed to load payment gateway' });
        return;
      }

      const { order, key_id } = orderResponse.data;

      // Configure Razorpay options
      const options = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: "Auréa Jewelry",
        description: "Premium Jewelry Collection",
        image: "/ring.jpg", // Your logo
        order_id: order.id,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyResponse = await axios.post(buildApiUrl('/payment/verify-payment'), {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyResponse.data.success) {
              // Create order in database after successful payment
              await createOrderInDatabase(true); // Pass true for verified payment
              showToast({ type: 'success', message: 'Payment successful! Your order has been placed.' });
              navigate('/orders');
            } else {
              showToast({ type: 'error', message: 'Payment verification failed' });
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            showToast({ type: 'error', message: 'Payment verification failed' });
          }
        },
        prefill: {
          name: selectedAddress.fullName,
          email: selectedAddress.email,
          contact: selectedAddress.phone
        },
        notes: {
          address: `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`
        },
        theme: {
          color: "#D4AF37"
        }
      };

      // Open Razorpay modal
      const rzp = new Razorpay(options);
      rzp.open();
      rzp.on('payment.failed', function (response) {
        showToast({ type: 'error', message: 'Payment failed. Please try again.' });
      });

    } catch (error) {
      console.error('Payment error:', error);
      showToast({ type: 'error', message: 'Payment failed. Please try again.' });
    } finally {
      setProcessingPayment(false);
    }
  };

  const createOrderInDatabase = async (paymentVerified = false) => {
    try {
      const userId = getUserId();

      if (!userId) {
        throw new Error('User not logged in');
      }

      // Determine payment status based on payment method and verification
      let paymentStatus = 'Pending';
      if (selectedPaymentMethod === 'cod') {
        paymentStatus = 'Pending'; // COD remains pending until delivery
      } else if (selectedPaymentMethod === 'razorpay' && paymentVerified) {
        paymentStatus = 'Paid'; // Razorpay payment verified
      }

      // Prepare order data
      const orderData = {
        orderItems: buyNowProduct 
          ? [{ product: buyNowProduct._id, quantity: buyNowProduct.quantity }]
          : cartItems.map(item => ({ product: item.product._id, quantity: item.quantity })),
        shippingAddress: {
          fullName: selectedAddress.fullName,
          phone: selectedAddress.phone,
          email: selectedAddress.email,
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          postalCode: selectedAddress.pincode,
          country: 'India'
        },
        paymentMethod: selectedPaymentMethod,
        paymentStatus: paymentStatus, // Add payment status
        totalPrice: calculateTotal(), // Send final amount after discount
        originalPrice: calculateSubtotal(), // Send original subtotal
        discountAmount: discount, // Send discount amount
        couponCode: couponCode || null
      };

      const response = await axios.post(buildApiUrl('/orders'), {
        ...orderData,
        userId: userId
      });
      
      if (response.status === 201) {
        return response.data;
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order in database:', error);
      throw error;
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      await createOrderInDatabase(false); // COD is not pre-paid
      // Clear coupon from localStorage after successful order
      localStorage.removeItem('appliedCoupon');
      showToast({ type: 'success', message: 'Order placed successfully! You will receive a confirmation soon.' });
      navigate('/orders');
    } catch (error) {
      console.error('Error in payment success:', error);
      showToast({ type: 'error', message: 'Payment successful but order creation failed. Please contact support.' });
      navigate('/orders');
    }
  };

  const handleBackToAddress = () => {
    navigate('/address', { 
      state: { 
        buyNowProduct,
        fromCart,
        couponData: couponCode ? { code: couponCode, discount: discount } : null,
        discount,
        couponApplied: discount > 0
      }
    });
  };

  if (!selectedAddress) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between px-2 sm:px-6 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/jj.jpg)'
          }}
        ></div>
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center flex-1 min-h-[70vh] py-10">
        <div className="text-center mb-8 mt-8">
          {/* Main Heading */}
          <h2 className="text-6xl font-bold tracking-wide text-gray-800 drop-shadow-lg mb-4" style={{fontFamily: 'Georgia, serif'}}>
            Payment
          </h2>
          
          {/* Tagline */}
          <p className="text-gray-600 text-xl font-light tracking-wide" style={{fontFamily: 'Arial, sans-serif'}}>
            Secure & Seamless Transactions
          </p>
        </div>

        <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8 items-start justify-center mx-auto">
          {/* Payment Form */}
          <div className="flex-1">
            <div className="bg-white/95 rounded-2xl shadow-2xl p-8 border-2 border-[#e0c3a0]">
              <h3 className="text-2xl font-bold text-[#a67c52] mb-6">Payment Details</h3>
              
              {/* Delivery Address */}
              <div className="mb-6 p-4 bg-[#f7e1c7] rounded-xl border border-[#e0c3a0]">
                <h4 className="font-semibold text-[#3e2d26] mb-2">Delivery Address</h4>
                <p className="text-[#3e2d26]">{selectedAddress.fullName}</p>
                <p className="text-[#3e2d26]">{selectedAddress.phone}</p>
                <p className="text-[#3e2d26]">{selectedAddress.street}</p>
                <p className="text-[#3e2d26]">{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</p>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4">
                <h4 className="font-semibold text-[#3e2d26]">Select Payment Method</h4>
                
                <div className="space-y-3">
                  <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                    selectedPaymentMethod === 'cod' 
                      ? 'border-[#a67c52] bg-[#f7e1c7]' 
                      : 'border-[#e0c3a0] hover:border-[#a67c52]'
                  }`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cod" 
                      checked={selectedPaymentMethod === 'cod'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="text-[#a67c52]" 
                    />
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-[#a67c52]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="font-semibold text-[#3e2d26]">Cash on Delivery</span>
                    </div>
                  </label>
                  
                  <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                    selectedPaymentMethod === 'razorpay' 
                      ? 'border-[#a67c52] bg-[#f7e1c7]' 
                      : 'border-[#e0c3a0] hover:border-[#a67c52]'
                  }`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="razorpay" 
                      checked={selectedPaymentMethod === 'razorpay'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="text-[#a67c52]" 
                    />
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-[#a67c52]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span className="font-semibold text-[#3e2d26]">Pay Online (Cards, UPI, Net Banking)</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleRazorpayPayment}
                  disabled={processingPayment}
                  className="flex-1 py-4 bg-gradient-to-r from-[#a67c52] to-[#f7c59f] text-white text-xl font-bold rounded-xl shadow-lg hover:from-[#8d6a43] hover:to-[#e0c3a0] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processingPayment ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    `Pay ₹${calculateTotal().toLocaleString()}`
                  )}
                </button>
                <button
                  onClick={handleBackToAddress}
                  disabled={processingPayment}
                  className="flex-1 py-4 bg-gray-200 text-[#3e2d26] text-xl font-bold rounded-xl hover:bg-gray-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back to Address
                </button>
              </div>


            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-white/95 rounded-2xl shadow-2xl p-6 border-2 border-[#e0c3a0] sticky top-10">
              <h3 className="text-2xl font-bold text-[#a67c52] mb-4">Order Summary</h3>
              
              {loading ? (
                <div className="text-center text-[#3e2d26]">
                  <p>Loading order details...</p>
                </div>
              ) : buyNowProduct ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-[#f7e1c7] rounded-xl">
                    <img
                      src={buyNowProduct.imageUrl || '/placeholder.jpg'}
                      alt={buyNowProduct.name}
                      className="w-16 h-16 object-cover rounded-lg border-2 border-[#e0c3a0]"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#3e2d26] text-sm">{buyNowProduct.name}</h4>
                      <p className="text-[#7c5c36] font-bold">₹{buyNowProduct.price}</p>
                      <p className="text-[#3e2d26] text-sm">Qty: {buyNowProduct.quantity}</p>
                    </div>
                  </div>
                  <div className="border-t border-[#e0c3a0] pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>₹{calculateSubtotal().toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount ({couponCode})</span>
                        <span>-₹{discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t border-[#e0c3a0] pt-2">
                      <span>Total</span>
                      <span>₹{calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ) : fromCart && cartItems.length > 0 ? (
                <div className="space-y-4">
                  {/* Cart Items */}
                  <div className="text-sm text-[#3e2d26] mb-2">
                    <span className="font-semibold">{cartItems.length} item{cartItems.length > 1 ? 's' : ''}</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-3">
                    {cartItems.map(({ product, quantity }) => (
                      <div key={product._id} className="flex items-center gap-3 p-3 bg-[#f7e1c7] rounded-xl">
                        <img
                          src={product.imageUrl || '/placeholder.jpg'}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg border-2 border-[#e0c3a0]"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-[#3e2d26] text-sm">{product.name}</h4>
                          <p className="text-[#7c5c36] font-bold">₹{product.price}</p>
                          <p className="text-[#3e2d26] text-sm">Qty: {quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Order Summary */}
                  <div className="border-t border-[#e0c3a0] pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>₹{calculateSubtotal().toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount ({couponCode})</span>
                        <span>-₹{discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t border-[#e0c3a0] pt-2">
                      <span>Total</span>
                      <span>₹{calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-[#3e2d26]">
                  <p>No items to display</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full mt-10">
        <Footer />
      </div>
    </div>
  );
} 
