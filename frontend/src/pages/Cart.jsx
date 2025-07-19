import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '../components/Toast';
import Footer from '../components/Footer';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const { showToast } = useToast();

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userId = storedUser?.user?.id;

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:5000/api/cart/${userId}`)
      .then((res) => {
        setCartItems(res.data.items || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch cart:', err);
        showToast({ type: 'error', message: 'Failed to fetch cart.' });
        setLoading(false);
      });
  }, [userId]);

  const handleRemove = async (productId) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/cart/${userId}/remove/${productId}`
      );
      setCartItems(res.data.cart.items);
      showToast({ type: 'success', message: 'Item removed from cart.' });
    } catch (err) {
      console.error('Remove error:', err);
      showToast({ type: 'error', message: 'Failed to remove item.' });
    }
  };

  const handleQuantityChange = async (productId, delta) => {
    const updatedItem = cartItems.find((item) => item.product._id === productId);
    const newQuantity = updatedItem.quantity + delta;
    if (newQuantity < 1) return;

    try {
      const res = await axios.put(
        `http://localhost:5000/api/cart/${userId}/update`,
        { productId, quantity: newQuantity }
      );

      setCartItems(res.data.cart.items);
    } catch (err) {
      console.error('Update error:', err);
      showToast({ type: 'error', message: 'Failed to update quantity.' });
    }
  };

  // Calculate subtotal and total after discount
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );
  const total = Math.max(subtotal - discount, 0);

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
    showToast({ type: 'info', message: 'Checkout coming soon!' });
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
      <div className="p-10 text-center text-[#3e2d26]">
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between px-2 sm:px-6 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img src="/cart-bg.jpg" alt="Cart background" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />
      </div>
      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center flex-1 min-h-[70vh] py-10">
        <h2 className="text-5xl font-extrabold mb-8 text-center tracking-wide text-[#a67c52]">Your Cart</h2>

        <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-8 items-center justify-center mx-auto">
          {/* Cart Items */}
          <div className="flex-1 space-y-6">
            {cartItems.length === 0 ? (
              <p className="text-center text-[#3e2d26]/60 text-lg bg-white/60 rounded-xl py-10 shadow-inner">Your cart is empty.</p>
            ) : (
              cartItems.map(({ product, quantity }) => (
                <div
                  key={product._id}
                  className="flex flex-col sm:flex-row items-center bg-gradient-to-br from-[#fff8f1] to-[#f7e1c7] rounded-2xl shadow-xl p-3 sm:p-2 border border-[#e0c3a0] hover:shadow-2xl hover:scale-[1.015] transition-all duration-300 gap-2 sm:gap-4"
                >
                  <img
                    src={product.imageUrl || '/placeholder.jpg'}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg mr-0 sm:mr-4 mb-3 sm:mb-0 border-2 border-[#f7c59f] shadow-sm"
                  />
                  <div className="flex-1 text-[#3e2d26] flex flex-col gap-1">
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight truncate text-[#a67c52]">{product.name}</h3>
                    <p className="text-base sm:text-lg font-semibold text-[#7c5c36]">₹{product.price}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => handleQuantityChange(product._id, -1)}
                        className="px-2 py-1 bg-[#f7c59f] rounded-md text-[#3e2d26] font-bold text-lg shadow hover:bg-[#e0c3a0]"
                      >
                        -
                      </button>
                      <span className="font-semibold text-base sm:text-lg w-6 text-center">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(product._id, 1)}
                        className="px-2 py-1 bg-[#f7c59f] rounded-md text-[#3e2d26] font-bold text-lg shadow hover:bg-[#e0c3a0]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(product._id)}
                    aria-label="Remove item"
                    className="mt-2 sm:mt-0 sm:ml-4 px-3 py-1.5 bg-gradient-to-r from-[#f7c59f] to-[#a67c52] text-[#3e2d26] rounded-full shadow hover:from-[#e0c3a0] hover:to-[#8d6a43] font-semibold text-sm flex items-center gap-1 border border-[#e0c3a0] transition-colors duration-200"
                    title="Remove from cart"
                  >
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                    </svg>
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Summary & Coupon */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-white/95 rounded-2xl shadow-2xl p-8 border-2 border-[#e0c3a0] flex flex-col gap-6 sticky top-10">
              <div>
                <h3 className="text-2xl font-bold text-[#a67c52] mb-2 tracking-wide">Order Summary</h3>
                <div className="flex justify-between text-lg mb-1">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-lg mb-1">
                  <span>Discount</span>
                  <span className="text-green-600">-₹{discount}</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t border-[#e0c3a0] pt-3 mt-3">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              {/* Coupon Area */}
              <div className="flex flex-col gap-2">
                <label htmlFor="coupon" className="font-medium text-[#a67c52]">Have a coupon?</label>
                <div className="flex gap-2">
                  <input
                    id="coupon"
                    type="text"
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-[#e0c3a0] focus:outline-none focus:ring-2 focus:ring-[#f7c59f] bg-[#fdf6ee] text-[#3e2d26] shadow"
                    placeholder="Enter coupon code (e.g. JEWEL10)"
                    disabled={couponApplied}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className={`px-4 py-2 rounded-lg font-semibold shadow transition-colors duration-200 ${couponApplied ? 'bg-green-400 text-white cursor-not-allowed' : 'bg-[#f7c59f] text-[#3e2d26] hover:bg-[#e0c3a0]'}`}
                    disabled={couponApplied}
                  >
                    {couponApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-[#a67c52] to-[#f7c59f] text-white text-2xl font-extrabold shadow-lg hover:from-[#8d6a43] hover:to-[#e0c3a0] transition-colors duration-200 tracking-wide"
              >
                Checkout
              </button>
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
