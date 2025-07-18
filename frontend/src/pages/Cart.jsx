import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '../components/Toast';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userId = storedUser?._id;

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:5000/api/cart`, { params: { userId } })
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
      await axios.delete(`http://localhost:5000/api/cart`, {
        params: { userId, productId },
      });
      setCartItems((prev) => prev.filter((item) => item.product._id !== productId));
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
      await axios.put(`http://localhost:5000/api/cart`, {
        userId,
        productId,
        quantity: newQuantity,
      });

      setCartItems((prev) =>
        prev.map((item) =>
          item.product._id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      console.error('Update error:', err);
      showToast({ type: 'error', message: 'Failed to update quantity.' });
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

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
    <div className="bg-[#fdf8f6] min-h-screen px-6 py-10">
      <h2 className="text-3xl font-bold mb-6 text-[#3e2d26] text-center">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-[#3e2d26]/60">Your cart is empty.</p>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {cartItems.map(({ product, quantity }) => (
            <div
              key={product._id}
              className="flex flex-col sm:flex-row items-center bg-[#fff6ee] rounded-2xl shadow-md p-4 border border-[#e0c3a0]"
            >
              <img
                src={product.imageUrl || '/placeholder.jpg'}
                alt={product.name}
                className="w-32 h-32 object-cover rounded-xl mr-4"
              />
              <div className="flex-1 text-[#3e2d26]">
                <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
                <p className="mb-1">₹{product.price}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => handleQuantityChange(product._id, -1)}
                    className="px-3 py-1 bg-[#f7c59f] rounded-lg text-[#3e2d26] font-bold"
                  >
                    -
                  </button>
                  <span className="font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(product._id, 1)}
                    className="px-3 py-1 bg-[#f7c59f] rounded-lg text-[#3e2d26] font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => handleRemove(product._id)}
                className="mt-4 sm:mt-0 sm:ml-4 px-4 py-2 bg-red-400 text-white rounded-lg shadow hover:bg-red-500"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="text-right text-xl font-bold text-[#3e2d26] pt-4 border-t border-[#e0c3a0]">
            Total: ₹{total}
          </div>
        </div>
      )}
    </div>
  );
}
