import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useToast } from '../components/Toast';
import { getUserId } from '../utils/userUtils';
import { Heart, ShoppingCart, Star, Filter, Search, Eye } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import Footer from '../components/Footer';

export default function PersonalizedGifts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('featured');
  const [wishlist, setWishlist] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);

  const navigate = useNavigate();
  const { showToast } = useToast();

  // Personalized gifts sub-categories
  const categories = [
    { id: 'all', name: 'All Personalized Gifts', icon: '🎁' },
    { id: 'name', name: 'Name Jewelry', icon: '📝' },
    { id: 'initial', name: 'Initial Jewelry', icon: '🔤' },
    { id: 'birthstone', name: 'Birthstone', icon: '💎' },
    { id: 'custom', name: 'Custom Design', icon: '✨' },
    { id: 'engraved', name: 'Engraved', icon: '🔨' },
    { id: 'photo', name: 'Photo Jewelry', icon: '📸' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/products');
        // Filter products that belong to the personalized gifts page
        const personalizedGiftsProducts = response.data.filter(product => product.categoryPage === 'personalized-gifts');
        setProducts(personalizedGiftsProducts);
        setFilteredProducts(personalizedGiftsProducts);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch personalized gifts:', err);
        setError('Failed to load personalized gifts collection.');
        showToast({
          type: 'error',
          message: 'Failed to load personalized gifts collection.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [showToast]);

  // Filter and sort products
  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort products
    switch (sortBy) {
      case 'priceLow':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        // Featured - keep original order
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  const handleAddToCart = async (productId) => {
    const userId = getUserId();
    if (!userId) {
      showToast({
        type: 'error',
        message: 'Please login to add items to your cart.'
      });
      navigate('/login');
      return;
    }

    try {
      await axios.post('/cart', {
        user: userId,
        productId,
        quantity: 1,
      });
      showToast({
        type: 'success',
        message: 'Added to cart!'
      });
    } catch (error) {
      console.error('Add to cart error:', error);
      showToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to add to cart.'
      });
    }
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
    
    const isInWishlist = wishlist.includes(productId);
    showToast({
      type: isInWishlist ? 'info' : 'success',
      message: isInWishlist ? 'Removed from wishlist' : 'Added to wishlist!'
    });
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setShowQuickView(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
            <p className="mt-4 text-rose-800 text-lg">Loading Personalized Gifts Collection...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f6]">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-[#e0c3a0] py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-extrabold tracking-wide text-[#D4AF37] drop-shadow-lg mb-4">
              Personalized Gifts Collection
            </h1>
            <p className="text-[#7c5c36] text-lg font-medium">
              Create something truly special with our personalized jewelry collection
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            minPrice={0}
            maxPrice={100000}
          />

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-[#7c5c36]">
                <span className="font-medium">{filteredProducts.length}</span> products found
              </div>
              <div className="flex gap-2 items-center">
                {/* Grid/List Toggle */}
                <button className="border border-[#D4AF37] bg-[#D4AF37] text-white rounded-lg px-3 py-2 flex items-center focus:outline-none">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                  </svg>
                </button>
                <button className="border border-[#D4AF37] text-[#3e2d26] rounded-lg px-3 py-2 flex items-center focus:outline-none bg-white hover:bg-[#f7e1c7] transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="4"/>
                    <rect x="3" y="10" width="18" height="4"/>
                    <rect x="3" y="16" width="18" height="4"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Products Grid - Fixed 3-column layout to maintain original card size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🎁</div>
                  <p className="text-gray-500 text-lg mb-2">No personalized gifts found</p>
                  <p className="text-gray-400">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                filteredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
