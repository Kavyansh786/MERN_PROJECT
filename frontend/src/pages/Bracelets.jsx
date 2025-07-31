import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useToast } from '../components/Toast';
import { getUserId } from '../utils/userUtils';
import { Heart, ShoppingCart, Star, Filter, Search, Eye } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function Bracelets() {
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

  // Bracelets sub-categories
  const categories = [
    { id: 'all', name: 'All Bracelets', icon: '💫' },
    { id: 'bangles', name: 'Bangles', icon: '🔶' },
    { id: 'cuffs', name: 'Cuffs', icon: '💎' },
    { id: 'chains', name: 'Chain Bracelets', icon: '⛓️' },
    { id: 'charm', name: 'Charm Bracelets', icon: '✨' },
    { id: 'tennis', name: 'Tennis Bracelets', icon: '💍' },
    { id: 'traditional', name: 'Traditional', icon: '🏺' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/products');
        // Filter products that belong to the bracelets page
        const braceletsProducts = response.data.filter(product => product.categoryPage === 'bracelets');
        setProducts(braceletsProducts);
        setFilteredProducts(braceletsProducts);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch bracelets:', err);
        setError('Failed to load bracelets collection.');
        showToast({
          type: 'error',
          message: 'Failed to load bracelets collection.'
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
      await axios.post('http://localhost:5000/api/cart', {
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
            <p className="mt-4 text-rose-800 text-lg">Loading Bracelets Collection...</p>
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
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-10 pb-2">
        <h1 className="text-4xl md:text-5xl font-extrabold font-serif text-[#3e2d26] mb-2 text-left">Bracelets Collection</h1>
        <p className="text-lg md:text-xl text-[#8D6E63] mb-6 text-left max-w-2xl">Discover our stunning collection of bracelets — from elegant bangles to statement cuffs. Perfect for every occasion and style.</p>
      </section>

      {/* Filter/Sort Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex gap-2 items-center">
          <button className="border border-[#D4AF37] text-[#3e2d26] font-semibold rounded-lg px-5 py-2.5 bg-white hover:bg-[#f7e1c7] transition-all flex items-center gap-2">
            <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            Filters
          </button>
        </div>
        <div className="flex gap-2 items-center">
          {/* Grid/List Toggle (Grid active) */}
          <button className="border border-[#D4AF37] bg-[#D4AF37] text-white rounded-lg px-3 py-2 flex items-center focus:outline-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          </button>
          <button className="border border-[#D4AF37] text-[#3e2d26] rounded-lg px-3 py-2 flex items-center focus:outline-none bg-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="4"/><rect x="3" y="10" width="18" height="4"/><rect x="3" y="16" width="18" height="4"/></svg>
          </button>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[#8D6E63] font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-[#D4AF37] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-[#3e2d26] bg-white"
          >
            <option value="featured">Featured</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">💫</div>
              <p className="text-gray-500 text-lg mb-2">No bracelets available yet</p>
              <p className="text-gray-400">Products will be added soon!</p>
            </div>
          ) : (
            filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>
      </div>
    </div>
  );
} 