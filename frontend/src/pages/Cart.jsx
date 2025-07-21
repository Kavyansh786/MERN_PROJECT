import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../components/Toast';
import Footer from '../components/Footer';

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [savedItems, setSavedItems] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [removingItem, setRemovingItem] = useState(null);
  const { showToast } = useToast();

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userId = storedUser?.user?.id || storedUser?._id;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:5000/api/cart/${userId}`)
      .then((res) => {
        setCartItems(res.data.items || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch cart:', err);
        // Fallback to localStorage
        try {
          const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
          setCartItems(localCart);
        } catch (localError) {
          console.error('LocalStorage error:', localError);
          setCartItems([]);
        }
        showToast({ type: 'error', message: 'Failed to fetch cart from server, using local data.' });
        setLoading(false);
      });
  }, [userId]);

  // Mock recommendations - replace with actual API call
  useEffect(() => {
    if (cartItems.length > 0) {
      // Simulate recommendations based on cart items
      setRecommendations([
        {
          _id: 'rec1',
          name: 'Matching Earrings',
          price: 2500,
          imageUrl: '/ear.png',
          category: 'Earrings'
        },
        {
          _id: 'rec2', 
          name: 'Complementary Ring',
          price: 1800,
          imageUrl: '/gring.png',
          category: 'Rings'
        }
      ]);
    }
  }, [cartItems]);

  const handleRemove = async (productId) => {
    setRemovingItem(productId);
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/cart/${userId}/remove/${productId}`
      );
      setCartItems(res.data.cart.items);
      showToast({ type: 'success', message: 'Item removed from cart.' });
    } catch (err) {
      console.error('Remove error:', err);
      // Fallback to localStorage
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const updatedCart = localCart.filter(item => item._id !== productId);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      showToast({ type: 'success', message: 'Item removed from cart (local).' });
    } finally {
      setRemovingItem(null);
    }
  };

  const handleQuantityChange = async (productId, delta) => {
    const updatedItem = cartItems.find((item) => {
      const product = item.product || item;
      return product._id === productId;
    });
    
    const quantity = updatedItem.quantity || (updatedItem.product ? updatedItem.product.quantity : 1);
    const newQuantity = quantity + delta;
    if (newQuantity < 1) return;

    try {
      const res = await axios.put(
        `http://localhost:5000/api/cart/${userId}/update`,
        { productId, quantity: newQuantity }
      );

      setCartItems(res.data.cart.items);
    } catch (err) {
      console.error('Update error:', err);
      // Fallback to localStorage
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const updatedCart = localCart.map(item => {
        if (item._id === productId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      showToast({ type: 'success', message: 'Quantity updated (local).' });
    }
  };

  const handleSaveForLater = (item) => {
    setSavedItems(prev => [...prev, item]);
    handleRemove(item.product._id);
    showToast({ type: 'success', message: 'Item saved for later!' });
  };

  const handleMoveToCart = (item) => {
    setSavedItems(prev => prev.filter(saved => saved.product._id !== item.product._id));
    // Add back to cart logic here
    showToast({ type: 'success', message: 'Item moved to cart!' });
  };

  // Calculate subtotal and total after discount
  const subtotal = cartItems.reduce(
    (sum, item) => {
      const product = item.product || item;
      const quantity = item.quantity || 1;
      return sum + quantity * product.price;
    },
    0
  );
  const total = Math.max(subtotal - discount, 0);

  // Calculate progress for free shipping
  const freeShippingThreshold = 5000;
  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);

  // Placeholder coupon logic
  const handleApplyCoupon = () => {
    if (couponApplied) {
      showToast({ type: 'info', message: 'Coupon already applied.' });
      return;
    }
    if (coupon.trim().toLowerCase() === 'JEWEL10'.toLowerCase()) {
      const discountValue = Math.round(subtotal * 0.1);
      setDiscount(discountValue);
      setCouponApplied(true);
      showToast({ type: 'success', message: 'Coupon applied! 10% off.' });
    } else {
      setDiscount(0);
      setCouponApplied(false);
      showToast({ type: 'error', message: 'Invalid coupon code.' });
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showToast({ type: 'error', message: 'Your cart is empty!' });
      return;
    }
    
    if (!userId) {
      showToast({ type: 'error', message: 'Please login to continue!' });
      navigate('/login');
      return;
    }
    
    navigate('/address');
  };

  if (!userId) {
    return (
      <div className="p-10 text-center text-[#3e2d26]">
        <p>Please log in to view your cart.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf8f6] via-[#f7e1c7] to-[#e0c3a0]">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-[#D4AF37] border-t-transparent mx-auto mb-6"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-2 border-[#FFD700] opacity-20"></div>
          </div>
          <p className="text-[#3e2d26] text-xl font-semibold">Loading your cart...</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
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
            Auréa Cart
          </h2>
          
          {/* Tagline */}
          <p className="text-gray-600 text-xl font-light tracking-wide" style={{fontFamily: 'Arial, sans-serif'}}>
            Timeless Elegance, Crafted with Love
          </p>
        </div>

        <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-start justify-center mx-auto">
          {/* Cart Items */}
          <div className="flex-1 space-y-6">
            {cartItems.length === 0 ? (
              <div className="text-center bg-white/95 backdrop-blur-sm rounded-3xl py-20 shadow-2xl border-2 border-[#e0c3a0] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#fdf8f6] to-[#f7e1c7] opacity-50"></div>
                <div className="relative z-10">
                  <div className="text-8xl mb-6 animate-bounce">🛒</div>
                  <h3 className="text-3xl font-bold text-[#a67c52] mb-4 bg-gradient-to-r from-[#a67c52] to-[#7c5c36] bg-clip-text text-transparent">
                    Your cart is empty
                  </h3>
                  <p className="text-[#7c5c36] mb-8 text-lg">Add some beautiful jewelry to get started!</p>
                  <button 
                    onClick={() => navigate('/shop')}
                    className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white px-10 py-4 rounded-2xl font-bold hover:from-[#B8941F] hover:to-[#E6C200] transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                  >
                    Start Shopping
                  </button>
                </div>
              </div>
            ) : (
              cartItems.map((item) => {
                // Handle both backend API structure { product, quantity } and localStorage structure { _id, name, price, etc., quantity }
                const product = item.product || item;
                const quantity = item.quantity || 1;
                
                return (
                  <div
                    key={product._id}
                    className={`flex flex-col sm:flex-row items-center bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border-2 border-[#e0c3a0] hover:shadow-3xl hover:scale-[1.02] transition-all duration-500 gap-4 relative overflow-hidden group ${
                      removingItem === product._id ? 'opacity-50 scale-95' : ''
                    }`}
                  >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#fdf8f6] via-white to-[#f7e1c7] opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10 flex flex-col sm:flex-row items-center w-full gap-4">
                    <div className="relative">
                      <img
                        src={product.imageUrl || '/placeholder.jpg'}
                        alt={product.name}
                        className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-2xl border-2 border-[#f7c59f] shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                      />
                      
                    </div>
                    
                    <div className="flex-1 text-[#3e2d26] flex flex-col gap-2">
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#a67c52] group-hover:text-[#7c5c36] transition-colors duration-300">
                        {product.name}
                      </h3>
                      <p className="text-lg sm:text-xl font-semibold text-[#7c5c36] bg-gradient-to-r from-[#7c5c36] to-[#a67c52] bg-clip-text text-transparent">
                        ₹{product.price.toLocaleString()}
                      </p>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-[#e0c3a0]">
                          <button
                            onClick={() => handleQuantityChange(product._id, -1)}
                            className="w-8 h-8 bg-gradient-to-r from-[#f7c59f] to-[#e0c3a0] rounded-lg text-[#3e2d26] font-bold text-lg shadow hover:from-[#e0c3a0] hover:to-[#d4b08a] transition-all duration-200 transform hover:scale-110"
                          >
                            -
                          </button>
                          <span className="font-bold text-lg w-8 text-center mx-2">{quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(product._id, 1)}
                            className="w-8 h-8 bg-gradient-to-r from-[#f7c59f] to-[#e0c3a0] rounded-lg text-[#3e2d26] font-bold text-lg shadow hover:from-[#e0c3a0] hover:to-[#d4b08a] transition-all duration-200 transform hover:scale-110"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleRemove(product._id)}
                      aria-label="Remove item"
                      className="px-4 py-2 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-2xl shadow-lg hover:from-red-500 hover:to-red-700 font-semibold text-sm flex items-center gap-2 border transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                      title="Remove from cart"
                      disabled={removingItem === product._id}
                    >
                      {removingItem === product._id ? (
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              );
            })
            )}

            {/* Saved for Later */}
            {savedItems.length > 0 && (
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-[#e0c3a0] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#f8f4f0] to-[#f0e6d9] opacity-80"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-[#a67c52] mb-6 bg-gradient-to-r from-[#a67c52] to-[#7c5c36] bg-clip-text text-transparent">
                    Saved for Later
                  </h3>
                  <div className="space-y-4">
                    {savedItems.map(({ product, quantity }) => (
                      <div key={product._id} className="flex items-center bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-[#e0c3a0] hover:shadow-lg transition-all duration-300">
                        <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-xl mr-4 shadow-md" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-[#a67c52]">{product.name}</h4>
                          <p className="text-[#7c5c36]">₹{product.price.toLocaleString()}</p>
                        </div>
                        <button
                          onClick={() => handleMoveToCart({ product, quantity })}
                          className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white rounded-xl font-semibold hover:from-[#B8941F] hover:to-[#E6C200] transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          Move to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-[#e0c3a0] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#f8f4f0] to-[#f0e6d9] opacity-80"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-[#a67c52] mb-6 bg-gradient-to-r from-[#a67c52] to-[#7c5c36] bg-clip-text text-transparent">
                    You might also like
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {recommendations.map((product) => (
                      <div key={product._id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#e0c3a0] hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover rounded-xl mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300" />
                        <h4 className="font-semibold text-[#a67c52] mb-2 text-lg">{product.name}</h4>
                        <p className="text-[#7c5c36] mb-4 text-lg font-semibold">₹{product.price.toLocaleString()}</p>
                        <button className="w-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white py-3 rounded-xl font-semibold hover:from-[#B8941F] hover:to-[#E6C200] transition-all duration-300 transform hover:scale-105 shadow-lg">
                          Add to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Summary & Coupon */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-[#e0c3a0] flex flex-col gap-6 sticky top-10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#fdf8f6] to-[#f7e1c7] opacity-80"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-[#a67c52] mb-6 tracking-wide bg-gradient-to-r from-[#a67c52] to-[#7c5c36] bg-clip-text text-transparent">
                  Order Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-lg bg-white/60 backdrop-blur-sm rounded-xl p-3">
                    <span className="font-medium">Subtotal ({cartItems.length} items)</span>
                    <span className="font-bold">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg bg-white/60 backdrop-blur-sm rounded-xl p-3">
                    <span className="font-medium">Discount</span>
                    <span className="text-green-600 font-bold">-₹{discount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg bg-white/60 backdrop-blur-sm rounded-xl p-3">
                    <span className="font-medium">Shipping</span>
                    <span className={`font-bold ${remainingForFreeShipping > 0 ? 'text-[#7c5c36]' : 'text-green-600'}`}>
                      {remainingForFreeShipping > 0 ? '₹200' : 'FREE'}
                    </span>
                  </div>
                  <div className="border-t-2 border-[#e0c3a0] pt-4 bg-gradient-to-r from-[#f7e1c7] to-[#e0c3a0] rounded-xl p-4">
                    <div className="flex justify-between text-2xl font-bold">
                      <span>Total</span>
                      <span>₹{(total + (remainingForFreeShipping > 0 ? 200 : 0)).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-[#7c5c36] mt-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Estimated delivery: 3-5 business days
                    </p>
                  </div>
                </div>
              </div>

              {/* Coupon Area */}
              <div className="flex flex-col gap-3 relative z-10">
                <label htmlFor="coupon" className="font-semibold text-[#a67c52] text-lg">Have a coupon?</label>
                <div className="flex gap-3">
                  <input
                    id="coupon"
                    type="text"
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-[#e0c3a0] focus:outline-none focus:ring-2 focus:ring-[#f7c59f] bg-white/80 backdrop-blur-sm text-[#3e2d26] shadow-lg transition-all duration-300"
                    placeholder="Enter coupon code (e.g. JEWEL10)"
                    disabled={couponApplied}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 ${
                      couponApplied 
                        ? 'bg-green-400 text-white cursor-not-allowed' 
                        : 'bg-gradient-to-r from-[#f7c59f] to-[#e0c3a0] text-[#3e2d26] hover:from-[#e0c3a0] hover:to-[#d4b08a]'
                    }`}
                    disabled={couponApplied}
                  >
                    {couponApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
                className={`w-full mt-6 py-5 rounded-2xl text-2xl font-extrabold shadow-2xl transition-all duration-500 tracking-wide relative overflow-hidden ${
                  cartItems.length === 0
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#a67c52] to-[#f7c59f] text-white hover:from-[#8d6a43] hover:to-[#e0c3a0] transform hover:scale-105 hover:shadow-3xl'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative z-10">
                  {cartItems.length === 0 ? 'Cart Empty' : 'Proceed to Checkout'}
                </span>
              </button>

              {/* Security Badge */}
              <div className="text-center pt-6 border-t-2 border-[#e0c3a0] relative z-10">
                <div className="flex items-center justify-center gap-3 text-sm text-[#7c5c36] bg-white/60 backdrop-blur-sm rounded-xl p-3">
                  <svg className="w-6 h-6 text-green-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="font-semibold">Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
