import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';

export default function FestiveGifts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');





  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/products');
        // Filter products that belong to the festive gifts page
        const festiveGiftsProducts = response.data.filter(product => product.categoryPage === 'festive-gifts');
        setProducts(festiveGiftsProducts);
        setFilteredProducts(festiveGiftsProducts);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch festive gifts:', err);
        setError('Failed to load festive gifts collection.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
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
  }, [products, searchTerm, sortBy]);



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
            <p className="mt-4 text-rose-800 text-lg">Loading Festive Gifts Collection...</p>
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
        <h1 className="text-4xl md:text-5xl font-extrabold font-serif text-[#3e2d26] mb-2 text-left">Festive Gifts Collection</h1>
        <p className="text-lg md:text-xl text-[#8D6E63] mb-6 text-left max-w-2xl">Celebrate every festival with our special collection of festive jewelry gifts. From traditional celebrations to modern festivities, find the perfect piece to mark every special occasion.</p>
      </section>

      {/* Search and Sort Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#8D6E63]" />
          </div>
          <input
            type="text"
            placeholder="Search festive gifts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-[#D4AF37] rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-[#3e2d26] bg-white placeholder-[#8D6E63]"
          />
        </div>
        
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
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

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🎊</div>
                <p className="text-gray-500 text-lg mb-2">No festive gifts found</p>
                <p className="text-gray-400">Try adjusting your search terms</p>
              </div>
            ) : (
              filteredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}