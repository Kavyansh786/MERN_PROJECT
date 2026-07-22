import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Filter, Search, Eye } from 'lucide-react';
import ProductCard from './ProductCard';
import { useToast } from './Toast';
import { getUserId } from '../utils/userUtils';
import axios from '../api/axios';

const ProductCategoryPage = ({
  pageTitle,
  pageDescription,
  categories,
  categoryPage,
  defaultCategory = 'all'
}) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('featured');
  const [wishlist, setWishlist] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);

  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/products');
        const filtered = response.data.filter(product => product.categoryPage === categoryPage);
        setProducts(filtered);
        setFilteredProducts(filtered);
        setError(null);
      } catch (err) {
        console.error(`Failed to fetch ${categoryPage}:`, err);
        setError(`Failed to load ${pageTitle}.`);
        showToast({
          type: 'error',
          message: `Failed to load ${pageTitle}. Please try again later.`,
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    fetchWishlist();
  }, [categoryPage]);

  const fetchWishlist = async () => {
    const userId = getUserId();
    if (!userId) return;
    
    try {
      const response = await axios.get(`/wishlist/${userId}`);
      setWishlist(response.data.items.map(item => item.product._id));
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    let filtered = [...products];
    
    // Apply search term filter
    if (term) {
      filtered = filtered.filter(
        product => 
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term)
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Apply price range filter
    filtered = filtered.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Apply sorting
    filtered = sortProducts(filtered, sortBy);
    
    setFilteredProducts(filtered);
  };

  const sortProducts = (items, sortOption) => {
    const sorted = [...items];
    switch (sortOption) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default: // 'featured'
        return sorted.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }
  };

  const handleAddToWishlist = async (productId) => {
    const userId = getUserId();
    if (!userId) {
      showToast({
        type: 'info',
        message: 'Please login to add items to wishlist',
        duration: 3000,
      });
      navigate('/login');
      return;
    }

    try {
      if (wishlist.includes(productId)) {
        await axios.delete(`/wishlist/${userId}/${productId}`);
        setWishlist(wishlist.filter(id => id !== productId));
        showToast({
          type: 'success',
          message: 'Removed from wishlist',
          duration: 2000,
        });
      } else {
        await axios.post(`/wishlist/${userId}`, { productId });
        setWishlist([...wishlist, productId]);
        showToast({
          type: 'success',
          message: 'Added to wishlist',
          duration: 2000,
        });
      }
    } catch (err) {
      console.error('Error updating wishlist:', err);
      showToast({
        type: 'error',
        message: 'Failed to update wishlist',
        duration: 3000,
      });
    }
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setShowQuickView(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8962e] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#f8f3e6] to-[#f5e9d0] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#3e2d26] mb-4">
            {pageTitle}
          </h1>
          <p className="text-lg text-[#7c5c36] max-w-3xl mx-auto">
            {pageDescription}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          {/* Category Tabs */}
          <div className="flex-1 overflow-x-auto pb-2">
            <div className="flex space-x-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                    selectedCategory === category.id
                      ? 'bg-[#D4AF37] text-white'
                      : 'bg-white text-[#3e2d26] hover:bg-gray-100'
                  } border border-[#e0c3a0] shadow-sm`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Sort */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-[#D4AF37] focus:border-[#D4AF37] block w-full sm:w-64"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
              <option value="rating">Top Rated</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isInWishlist={wishlist.includes(product._id)}
                onWishlistToggle={handleAddToWishlist}
                onQuickView={() => handleQuickView(product)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {showQuickView && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Quick View Content */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{selectedProduct.name}</h3>
                <button
                  onClick={() => setShowQuickView(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedProduct.images?.[0] || '/placeholder-image.jpg'}
                    alt={selectedProduct.name}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#3e2d26] mb-2">
                    ₹{selectedProduct.price?.toLocaleString()}
                    {selectedProduct.originalPrice && (
                      <span className="ml-2 text-lg text-gray-500 line-through">
                        ₹{selectedProduct.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </p>
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= Math.floor(selectedProduct.rating || 0)
                              ? 'fill-current'
                              : 'fill-none'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      ({selectedProduct.reviews || 0} reviews)
                    </span>
                  </div>
                  <p className="text-gray-700 mb-6">{selectedProduct.description}</p>
                  <div className="space-y-4">
                    <button
                      onClick={() => {
                        // Add to cart logic here
                        showToast({
                          type: 'success',
                          message: 'Added to cart',
                          duration: 2000,
                        });
                      }}
                      className="w-full bg-[#D4AF37] text-white py-3 px-6 rounded-md hover:bg-[#b8962e] transition-colors flex items-center justify-center"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => {
                        handleAddToWishlist(selectedProduct._id);
                        setShowQuickView(false);
                      }}
                      className="w-full border border-[#D4AF37] text-[#3e2d26] py-3 px-6 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                      <Heart
                        className={`h-5 w-5 mr-2 ${
                          wishlist.includes(selectedProduct._id) ? 'fill-current text-red-500' : ''
                        }`}
                      />
                      {wishlist.includes(selectedProduct._id)
                        ? 'Remove from Wishlist'
                        : 'Add to Wishlist'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCategoryPage;
