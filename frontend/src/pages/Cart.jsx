import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaRegHeart, FaTimes } from 'react-icons/fa';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');
  const [promo, setPromo] = useState('');
  const [saving, setSaving] = useState([]);
  // For demo, you can add a tax calculation
  const TAX_RATE = 0.08;

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      setError('Please log in to view your cart.');
      return;
    }
    setUserId(storedUser._id);

    axios
      .get(`http://localhost:5000/api/cart?userId=${storedUser._id}`)
      .then(res => setCart(res.data))
      .catch(err => {
        setError('Failed to load cart');
      });
  }, []);

  const handleRemoveItem = (productId) => {
    axios
      .delete(`http://localhost:5000/api/cart/${productId}?userId=${userId}`)
      .then(res => setCart(res.data))
      .catch(() => alert('Failed to remove item'));
  };

  const handleClearCart = () => {
    axios
      .delete(`http://localhost:5000/api/cart?userId=${userId}`)
      .then(() => setCart({ items: [], user: userId }))
      .catch(() => alert('Failed to clear cart'));
  };

  const handleQuantity = (productId, delta) => {
    const item = cart.items.find(i => i.product._id === productId);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    axios
      .put(`http://localhost:5000/api/cart/${productId}?userId=${userId}`, { quantity: newQty })
      .then(res => setCart(res.data))
      .catch(() => alert('Failed to update quantity'));
  };

  const handleSaveForLater = (productId) => {
    setSaving([...saving, productId]);
    setTimeout(() => {
      setSaving(saving => saving.filter(id => id !== productId));
      alert('Saved for later (demo only)');
    }, 800);
  };

  if (error) {
    return <div className="text-center mt-10 text-red-600">{error}</div>;
  }
  if (!cart) {
    return <div className="text-center mt-10">Loading cart...</div>;
  }

  const subtotal = (cart.items || []).reduce((sum, item) => {
    if (!item?.product) return sum;
    return sum + (item.product.price || 0) * (item.quantity || 0);
  }, 0);
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbeee6] to-[#f5e3d3] p-4 md:p-8">
      <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
        {/* Cart Items */}
        <div className="flex-1 space-y-8">
          <h1 className="text-3xl font-bold mb-6 text-brown-700">Shopping Cart</h1>
          {cart.items.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          ) : (
            <AnimatePresence>
              {cart.items.map((item, idx) =>
                item?.product ? (
                  <motion.div
                    key={item.product._id || idx}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    layout
                    className="bg-white/80 rounded-2xl shadow-lg p-6 flex gap-6 items-center relative"
                  >
                    {/* Sale badge (demo: show if price > 2000) */}
                    {item.product.price > 2000 && (
                      <span className="absolute top-4 left-4 bg-red-500 text-white px-4 py-1 rounded-full font-bold shadow">
                        Sale
                      </span>
                    )}
                    {/* Image */}
                    <div className="w-28 h-28 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                      <img
                        src={item.product.imageUrl || item.product.image || '/placeholder.jpg'}
                        alt={item.product.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-brown-700">{item.product.name}</h2>
                        <div className="flex items-center ml-2">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className="text-yellow-400" />
                          ))}
                          <span className="ml-2 text-gray-500 text-sm">
                            (124 reviews)
                          </span>
                        </div>
                      </div>
                      <div className="text-brown-600 mt-2">
                        <div>Metal: {item.product.metal || "Gold"}</div>
                        {item.product.size && <div>Size: {item.product.size}</div>}
                      </div>
                      <div className="mt-2">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                          In Stock
                        </span>
                      </div>
                      {/* Quantity and Save for Later */}
                      <div className="flex items-center gap-6 mt-4">
                        <div className="flex items-center border rounded-lg px-2">
                          <button
                            className="px-2 py-1 text-xl"
                            onClick={() => handleQuantity(item.product._id, -1)}
                          >−</button>
                          <span className="px-3">{item.quantity}</span>
                          <button
                            className="px-2 py-1 text-xl"
                            onClick={() => handleQuantity(item.product._id, 1)}
                          >+</button>
                        </div>
                        <button
                          className={`flex items-center gap-1 text-brown-600 hover:text-brown-800 transition ${saving.includes(item.product._id) ? "opacity-50" : ""}`}
                          onClick={() => handleSaveForLater(item.product._id)}
                          disabled={saving.includes(item.product._id)}
                        >
                          <FaRegHeart /> Save for Later
                        </button>
                      </div>
                    </div>
                    {/* Price and Remove */}
                    <div className="flex flex-col items-end gap-2">
                      {item.product.oldPrice && (
                        <span className="line-through text-gray-400 text-lg">
                          ₹{item.product.oldPrice.toLocaleString()}
                        </span>
                      )}
                      <span className="text-2xl font-bold text-brown-700">
                        ₹{item.product.price.toLocaleString()}
                      </span>
                      <button
                        className="text-gray-400 hover:text-red-500 transition"
                        onClick={() => handleRemoveItem(item.product._id)}
                      >
                        <FaTimes size={22} />
                      </button>
                    </div>
                  </motion.div>
                ) : null
              )}
            </AnimatePresence>
          )}
        </div>
        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-96 bg-white/80 rounded-2xl shadow-lg p-8 h-fit"
        >
          <h2 className="text-2xl font-bold text-brown-700 mb-6">Order Summary</h2>
          <input
            type="text"
            placeholder="Enter promo code"
            value={promo}
            onChange={e => setPromo(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 mb-4"
          />
          <button className="w-full bg-brown-700 text-white py-2 rounded-lg mb-6 hover:bg-brown-800 transition">
            Apply
          </button>
          <div className="space-y-2 text-brown-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{tax.toLocaleString()}</span>
            </div>
          </div>
          <div className="border-t my-4"></div>
          <div className="flex justify-between text-2xl font-bold text-brown-800">
            <span>Total</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
          <button className="w-full mt-6 bg-brown-700 text-black py-3 rounded-full text-lg font-bold flex items-center justify-center gap-2 hover:bg-brown-800 transition">
            <span>🔒</span> Secure Checkout
          </button>
          <div className="flex justify-between mt-4 text-xs text-brown-500">
            <span>Secure Payment</span>
            <span>Free Returns</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-brown-500">
            <span>💳</span> 256-bit SSL encryption
          </div>
          <button
            className="w-full mt-4 px-6 py-2 bg-gray-200 text-brown-700 rounded hover:bg-gray-300 transition"
            onClick={handleClearCart}
          >
            Clear Cart
          </button>
        </motion.div>
      </div>
    </div>
  );
}