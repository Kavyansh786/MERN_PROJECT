import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useToast } from '../components/Toast';
import { getUserId } from '../utils/userUtils';

export default function RakshaBandhan() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [addingToCart, setAddingToCart] = useState({});
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    fetchRakhiProducts();
  }, []);

  const fetchRakhiProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      
      // Handle different response structures
      let allProducts = [];
      if (response.data.success && response.data.products) {
        allProducts = response.data.products;
      } else if (Array.isArray(response.data)) {
        allProducts = response.data;
      } else {
        console.error('Unexpected API response structure:', response.data);
        return;
      }
      
      // Filter only rakhi products using the differentiator
      const rakhiProducts = allProducts.filter(product => 
        product.isRakhi === true || product.category === 'rakhi'
      );
      
      setProducts(rakhiProducts);
    } catch (error) {
      console.error('Error fetching rakhi products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All Rakhis' },
    { id: 'traditional', name: 'Traditional Rakhis' },
    { id: 'designer', name: 'Designer Rakhis' },
    { id: 'premium', name: 'Premium Rakhis' }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.rakhiType === selectedCategory);

  const handleAddToCart = async (product) => {
    try {
      setAddingToCart(prev => ({ ...prev, [product._id]: true }));
      
      const userId = getUserId();
      if (!userId) {
        showToast({ type: 'error', message: 'Please login to add items to cart' });
        navigate('/login');
        return;
      }

      // Add to cart using backend API
      const response = await axios.post('http://localhost:5000/api/cart', {
        user: userId,
        productId: product._id,
        quantity: 1
      });

      if (response.data.success) {
        // Also store in localStorage for consistency
        try {
          const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
          const existingItemIndex = existingCart.findIndex(item => item._id === product._id);
          
          if (existingItemIndex > -1) {
            existingCart[existingItemIndex].quantity += 1;
          } else {
            existingCart.push({
              _id: product._id,
              name: product.name,
              price: product.price,
              imageUrl: product.imageUrl,
              quantity: 1
            });
          }
          
          localStorage.setItem('cart', JSON.stringify(existingCart));
        } catch (localError) {
          console.error('LocalStorage error:', localError);
        }
        
        // Show success message
        showToast({ type: 'success', message: 'Rakhi added to cart successfully!' });
      } else {
        showToast({ type: 'error', message: 'Error adding to cart. Please try again.' });
      }
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      
      // Fallback to localStorage if API fails
      try {
        const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItemIndex = existingCart.findIndex(item => item._id === product._id);
        
        if (existingItemIndex > -1) {
          existingCart[existingItemIndex].quantity += 1;
        } else {
          existingCart.push({
            _id: product._id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: 1
          });
        }
        
        localStorage.setItem('cart', JSON.stringify(existingCart));
        showToast({ type: 'success', message: 'Rakhi added to cart successfully! (Local storage)' });
      } catch (localError) {
        showToast({ type: 'error', message: 'Error adding to cart. Please try again.' });
      }
    } finally {
      setAddingToCart(prev => ({ ...prev, [product._id]: false }));
    }
  };

  const handleBuyNow = (product) => {
    navigate('/address', { 
      state: { 
        buyNowProduct: { ...product, quantity: 1 },
        fromCart: false
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-red-600 text-lg">Loading Raksha Bandhan Collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-red-100">
      {/* Hero Section */}
      <div className="relative py-20 px-6 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dc2626' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl font-bold text-red-800 mb-6 drop-shadow-lg" style={{fontFamily: 'Georgia, serif'}}>
            Raksha Bandhan
          </h1>
          
          {/* Subtitle */}
          <p className="text-2xl md:text-3xl text-red-600 mb-8 font-medium">
            Celebrate the Bond of Siblings
          </p>
          
          {/* Description */}
          <p className="text-lg text-red-700 max-w-3xl mx-auto leading-relaxed">
            Discover our exclusive collection of beautiful rakhis that celebrate the sacred bond between brothers and sisters. 
            From traditional designs to premium designer rakhis, find the perfect piece to express your love this Raksha Bandhan.
          </p>

          {/* Decorative Elements */}
          <div className="flex items-center justify-center gap-8 mt-12">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
            <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-red-600 text-white shadow-lg scale-105'
                    : 'bg-white text-red-600 border-2 border-red-200 hover:border-red-400 hover:bg-red-50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-red-400 text-6xl mb-4">💝</div>
              <h3 className="text-2xl font-bold text-red-700 mb-4">No Rakhis Found</h3>
              <p className="text-red-600">We're preparing our exclusive rakhi collection. Please check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {filteredProducts.map((product) => (
                <div
                  key={product._id || product.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden aspect-square">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Product Info */}
                  <div className="p-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    
                    {/* Material */}
                    <p className="text-sm text-gray-500 mb-3">
                      Material: {product.material}
                    </p>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">({product.reviews})</span>
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-2xl font-bold text-red-600">
                        ₹{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-gray-400 line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 mt-6">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={addingToCart[product._id]}
                        className="w-full py-4 px-6 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base"
                      >
                        {addingToCart[product._id] ? (
                          <>
                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Adding to Cart...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <circle cx="9" cy="21" r="1" />
                              <circle cx="20" cy="21" r="1" />
                              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleBuyNow(product)}
                        className="w-full py-4 px-6 bg-white border-2 border-red-500 text-red-500 font-semibold rounded-xl hover:bg-red-50 transition-all duration-300 text-base"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Make This Raksha Bandhan Special
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Choose from our exclusive rakhi collection and make your sibling feel truly special this Raksha Bandhan
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-white text-red-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-red-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Explore All Collections
          </button>
        </div>
      </div>
    </div>
  );
} 