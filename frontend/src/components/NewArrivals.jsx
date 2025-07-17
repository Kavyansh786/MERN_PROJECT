import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => {
        console.error('Failed to fetch new arrivals:', err);
        alert('Failed to load new arrivals.');
      });
  }, []);

  const handleAddToCart = async (productId) => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      alert('Please login to add items to your cart.');
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/cart',
        { productId, quantity: 1 },
        { params: { userId: storedUser._id } }
      );
      alert('Added to cart!');
    } catch (error) {
      console.error('Add to cart error:', error);
      alert('Failed to add to cart.');
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf8f6] text-[#4a2c2a] px-6 py-10 mt-16">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold">New Arrivals</h2>
        <p className="text-[#7b5d58] text-lg mt-2">Fresh designs that capture the latest trends</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-transform duration-300 hover:scale-105 hover:-translate-y-2 overflow-hidden"
          >
            <div className="relative">
              <img
                src={product.imageUrl || '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-[240px] object-cover"
              />
              <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                ✨ New
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>

              {/* Optional Rating if available */}
              <div className="flex items-center gap-1 text-yellow-500 mt-1">
                {'★'.repeat(4)}{'☆'}
                <span className="text-[#7b5d58] text-sm ml-2">(4.0)</span>
              </div>

              <p className="text-xl font-bold mt-2">₹{product.price.toLocaleString()}</p>

              <button
                onClick={() => handleAddToCart(product._id)}
                className="mt-6 flex items-center justify-center gap-2 bg-[#3e2d26] text-[#fff6ee] font-bold py-2 px-4 rounded-xl shadow-lg hover:bg-[#6b3e26] transition-all duration-300 w-3/4 mx-auto text-base border border-[#e5d5c6]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
