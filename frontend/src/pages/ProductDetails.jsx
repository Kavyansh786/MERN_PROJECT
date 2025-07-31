import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useToast } from '../components/Toast';
import { getUserId } from '../utils/userUtils';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const userId = getUserId();
    
    if (!userId) {
      showToast({ type: 'error', message: 'Please login to add items to your cart.' });
      navigate('/login');
      return;
    }

    // Check if product is out of stock
    if (product.available <= 0) {
      showToast({ type: 'error', message: 'This product is out of stock.' });
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(
        'http://localhost:5000/api/cart',
        { 
          user: userId, 
          productId: product._id, 
          quantity: 1 
        }
      );
      showToast({ type: 'success', message: 'Added to cart successfully!' });
    } catch (error) {
      console.error('Add to cart error:', error);
      showToast({ type: 'error', message: 'Failed to add to cart.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return <div className="text-center mt-10 text-red-600">{error}</div>;
  }

  if (!product) {
    return <div className="text-center mt-10">Loading product...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative">
          <img
            src={product.imageUrl || product.image}
            alt={product.name}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
          
          {/* Out of Stock Badge */}
          {product.available <= 0 && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg whitespace-nowrap">
              Out of Stock
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-2xl font-bold text-[#D4AF37] mb-4">₹{product.price?.toLocaleString()}</p>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Stock Information */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Stock Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Available Stock:</span>
                <span className={`font-semibold ${product.available <= 0 ? 'text-red-600' : product.available < 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {product.available} units
                </span>
              </div>
              {product.available <= 0 && (
                <div className="text-red-600 text-sm">
                  This product is currently out of stock. Please check back later.
                </div>
              )}
              {product.available > 0 && product.available < 10 && (
                <div className="text-yellow-600 text-sm">
                  Only a few items left in stock!
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Product Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">SKU:</span>
                <span className="font-medium">{product.sku}</span>
              </div>
              {product.isRakhi && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Rakhi Type:</span>
                  <span className="font-medium capitalize">{product.rakhiType}</span>
                </div>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            disabled={isLoading || product.available <= 0}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
              product.available <= 0 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-[#a67c52] to-[#7c5c36] text-white hover:from-[#8d6a43] hover:to-[#6b4a2a] transform hover:scale-105'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding to Cart...
              </div>
            ) : product.available <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
