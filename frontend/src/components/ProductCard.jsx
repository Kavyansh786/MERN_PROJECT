import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from './Toast';
import { getUserId } from '../utils/userUtils';

export default function ProductCard({ product, showNewBadge = false, viewMode = 'grid' }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userId = getUserId();

  // Check if product is already in wishlist on component mount
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!userId || !product._id) return;

      try {
        const response = await axios.get(`http://localhost:5000/api/users/wishlist?id=${userId}`);
        const wishlistItems = response.data;
        const isInWishlist = wishlistItems.some(item => item._id === product._id);
        setIsWishlisted(isInWishlist);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };

    checkWishlistStatus();
  }, [product._id, userId]);

  const handleAddToCart = async () => {
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

  const handleWishlist = async () => {
    if (!userId) {
      showToast({ type: 'error', message: 'Please login to add items to your wishlist.' });
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      
      if (isWishlisted) {
        // Remove from wishlist
        await axios.delete(`http://localhost:5000/api/users/wishlist/${userId}/${product._id}`);
        setIsWishlisted(false);
        showToast({ type: 'success', message: 'Removed from wishlist!' });
      } else {
        // Add to wishlist
        await axios.post(`http://localhost:5000/api/users/wishlist?id=${userId}`, {
          productId: product._id
        });
        setIsWishlisted(true);
        showToast({ type: 'success', message: 'Added to wishlist!' });
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      showToast({ type: 'error', message: 'Failed to update wishlist.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = () => {
    navigate(`/products/${product._id}`);
  };

  // Mock data for ratings only
  const rating = 4.2 + Math.random() * 0.8;
  const reviewCount = Math.floor(Math.random() * 200) + 50;

  if (viewMode === 'list') {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-[#e0c3a0] hover:shadow-2xl transition-all duration-300 overflow-hidden group">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="relative md:w-80 md:h-64 w-full h-64">
            <img
              src={product.imageUrl || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onClick={handleProductClick}
            />
            
            {/* Out of Stock Badge */}
            {product.available <= 0 && (
              <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg whitespace-nowrap">
                Out of Stock
              </div>
            )}

            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              disabled={isLoading}
              className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition-all duration-300 ${
                isWishlisted 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg 
                  className={`w-5 h-5 transition-all duration-300 ${isWishlisted ? 'fill-current' : 'fill-none'}`} 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  viewBox="0 0 24 24"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              )}
            </button>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <h3 
                className="text-2xl font-bold text-[#3e2d26] mb-2 cursor-pointer hover:text-[#D4AF37] transition-colors duration-200"
                onClick={handleProductClick}
              >
                {product.name}
              </h3>
              
              <p className="text-[#7c5c36] text-lg mb-4">
                {product.description || 'Elegant jewelry piece with intricate detailing'}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4" fill={i < Math.floor(rating) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-[#7c5c36]">({reviewCount})</span>
              </div>

              {/* Material & Category */}
              <div className="flex gap-4 text-sm text-[#7c5c36] mb-4">
                <span>Material: {product.material || 'Sterling Silver'}</span>
                <span>Category: {product.category || 'Necklace'}</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-[#D4AF37]">
                  ₹{product.price?.toLocaleString() || '0'}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-gray-500 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                disabled={isLoading || product.available <= 0}
                className={`flex-1 font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm ${
                  product.available <= 0 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-[#a67c52] to-[#7c5c36] text-white hover:from-[#8d6a43] hover:to-[#6b4a2a]'
                }`}
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                )}
                {isLoading ? 'Adding...' : product.available <= 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              
              <button className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:from-[#B8941F] hover:to-[#E6C200] transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Try On
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

    // Grid View (Original)
  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-[#e0c3a0] hover:border-[#D4AF37] transform hover:scale-105 hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={product.imageUrl || '/placeholder.jpg'}
          alt={product.name}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
          onClick={handleProductClick}
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
 
  
        {/* Out of Stock Badge */}
        {product.available <= 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg whitespace-nowrap">
            Out of Stock
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          disabled={isLoading}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition-all duration-300 ${
            isWishlisted 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg 
              className={`w-5 h-5 transition-all duration-300 ${isWishlisted ? 'fill-current' : 'fill-none'}`} 
              stroke="currentColor" 
              strokeWidth="2" 
              viewBox="0 0 24 24"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Product Info */}
        <div className="mb-4">
          <h3 
            className="text-lg font-bold text-[#3e2d26] mb-2 cursor-pointer hover:text-[#D4AF37] transition-colors duration-200"
            onClick={handleProductClick}
          >
            {product.name}
          </h3>
          
          <p className="text-[#7c5c36] text-sm mb-2">
            {product.description || 'Elegant jewelry piece with intricate detailing'}
          </p>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4" fill={i < Math.floor(rating) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <span className="text-sm text-[#7c5c36]">({reviewCount})</span>
          </div>

          {/* Material & Category */}
          <div className="text-xs text-[#7c5c36] mb-3">
            <span>Material: {product.material || 'Sterling Silver'}</span>
            <span className="mx-2">•</span>
            <span>Category: {product.category || 'Necklace'}</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-bold text-[#D4AF37]">
              ₹{product.price?.toLocaleString() || '0'}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 h-8">
          <button
            onClick={handleAddToCart}
            disabled={isLoading || product.available <= 0}
            className={`flex-1 font-bold py-2 px-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 text-xs ${
              product.available <= 0 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-[#a67c52] to-[#7c5c36] text-white hover:from-[#8d6a43] hover:to-[#6b4a2a]'
            }`}
          >
            {isLoading ? (
              <svg className="animate-spin h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            )}
            <span className="truncate">{isLoading ? 'Adding...' : product.available <= 0 ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
          
          <button className="w-20 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white font-bold py-2 px-3 rounded-lg shadow-lg hover:from-[#B8941F] hover:to-[#E6C200] transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-1 text-xs">
            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Try On</span>
          </button>
        </div>
      </div>
    </div>
  );
} 