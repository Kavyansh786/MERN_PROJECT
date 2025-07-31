import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('featured');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter states
  const [priceRange, setPriceRange] = useState([1000, 500000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  // Filter options
  const categories = ['Necklaces', 'Bracelets', 'Rings', 'Earrings', 'Anklets'];
  const materials = ['Sterling Silver', '18K Gold Plated', 'Rose Gold', 'White Gold', 'Platinum', 'Freshwater Pearl'];

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/products')
      .then(res => {
        // Exclude products with isRakhi true
        const nonRakhiProducts = res.data.filter(product => !product.isRakhi);
        setProducts(nonRakhiProducts);
        setFilteredProducts(nonRakhiProducts);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

  // Apply filters and search
  useEffect(() => {
    console.log('Filtering products:', {
      totalProducts: products.length,
      searchTerm,
      selectedCategories,
      selectedMaterials,
      priceRange
    });

    // Log all products to see their structure
    if (products.length > 0) {
      console.log('Sample product:', products[0]);
    }

    // Apply filters to products
    let filtered = products;
    
    if (products.length > 0) {
      filtered = products.filter(product => {
        // Search filter
        const matchesSearch = searchTerm === '' || 
                             product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             product.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Category filter - be more flexible
        const matchesCategory = selectedCategories.length === 0 || 
                               selectedCategories.some(cat => {
                                 const productCat = product.category?.toLowerCase() || '';
                                 const filterCat = cat.toLowerCase();
                                 return productCat.includes(filterCat) || filterCat.includes(productCat);
                               });
        
        // Material filter - be more flexible
        const matchesMaterial = selectedMaterials.length === 0 || 
                               selectedMaterials.some(mat => {
                                 const productMat = product.material?.toLowerCase() || '';
                                 const filterMat = mat.toLowerCase();
                                 return productMat.includes(filterMat) || filterMat.includes(productMat);
                               });
        
        // Price filter - handle missing price
        const productPrice = product.price || 0;
        const matchesPrice = productPrice >= priceRange[0] && productPrice <= priceRange[1];
        
        const matches = matchesSearch && matchesCategory && matchesMaterial && matchesPrice;
        
        if (!matches) {
          console.log('Product filtered out:', product.name, {
            productCategory: product.category,
            productMaterial: product.material,
            productPrice: product.price,
            matchesSearch,
            matchesCategory,
            matchesMaterial,
            matchesPrice
          });
        }
        
        return matches;
      });
    }

    console.log('Filtered products count:', filtered.length);

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'name':
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default: // featured - keep original order
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategories, selectedMaterials, priceRange, sortBy]);

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleMaterialToggle = (material) => {
    setSelectedMaterials(prev => 
      prev.includes(material) 
        ? prev.filter(m => m !== material)
        : [...prev, material]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setPriceRange([1000, 500000]);
    setSelectedCategories([]);
    setSelectedMaterials([]);
    setSortBy('featured');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf8f6] via-[#f7e1c7] to-[#e0c3a0]">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-[#D4AF37] border-t-transparent mx-auto mb-6"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-2 border-[#FFD700] opacity-20"></div>
          </div>
          <p className="text-[#3e2d26] text-xl font-semibold">Loading products...</p>
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
              Discover our exquisite handcrafted pieces
            </h1>
            <p className="text-[#7c5c36] text-lg font-medium">
              Find the perfect jewelry to complement your style
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-2 border-[#e0c3a0] sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                <h2 className="text-xl font-bold text-[#a67c52]">Filters</h2>
              </div>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search jewelry..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[#e0c3a0] focus:outline-none focus:ring-2 focus:ring-[#f7c59f] bg-white/80 backdrop-blur-sm text-[#3e2d26] shadow-lg"
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#7c5c36]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold text-[#a67c52] mb-3">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-[#7c5c36]">
                    <span>₹{priceRange[0].toLocaleString()}</span>
                    <span>₹{priceRange[1].toLocaleString()}</span>
                  </div>
                  <div className="relative h-2 bg-[#e0c3a0] rounded-lg">
                    <div 
                      className="absolute h-full bg-[#D4AF37] rounded-lg"
                      style={{
                        left: `${((priceRange[0] - 1000) / (500000 - 1000)) * 100}%`,
                        right: `${100 - ((priceRange[1] - 1000) / (500000 - 1000)) * 100}%`
                      }}
                    ></div>
                    <input
                      type="range"
                      min="1000"
                      max="500000"
                      value={priceRange[0]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setPriceRange([value, Math.max(value, priceRange[1])]);
                      }}
                      className="absolute w-full h-full opacity-0 cursor-pointer"
                    />
                    <input
                      type="range"
                      min="1000"
                      max="500000"
                      value={priceRange[1]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setPriceRange([Math.min(priceRange[0], value), value]);
                      }}
                      className="absolute w-full h-full opacity-0 cursor-pointer"
                    />
                    <div 
                      className="absolute w-4 h-4 bg-[#D4AF37] rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-y-1"
                      style={{
                        left: `${((priceRange[0] - 1000) / (500000 - 1000)) * 100}%`,
                        transform: 'translateX(-50%) translateY(-50%)'
                      }}
                    ></div>
                    <div 
                      className="absolute w-4 h-4 bg-[#D4AF37] rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-y-1"
                      style={{
                        left: `${((priceRange[1] - 1000) / (500000 - 1000)) * 100}%`,
                        transform: 'translateX(-50%) translateY(-50%)'
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-semibold text-[#a67c52] mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center gap-3 cursor-pointer hover:bg-[#f7e1c7]/50 rounded-lg p-2 transition-colors duration-200">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="w-4 h-4 text-[#D4AF37] border-[#e0c3a0] rounded focus:ring-[#f7c59f]"
                      />
                      <span className="text-[#7c5c36]">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Materials */}
              <div className="mb-6">
                <h3 className="font-semibold text-[#a67c52] mb-3">Materials</h3>
                <div className="space-y-2">
                  {materials.map((material) => (
                    <label key={material} className="flex items-center gap-3 cursor-pointer hover:bg-[#f7e1c7]/50 rounded-lg p-2 transition-colors duration-200">
                      <input
                        type="checkbox"
                        checked={selectedMaterials.includes(material)}
                        onChange={() => handleMaterialToggle(material)}
                        className="w-4 h-4 text-[#D4AF37] border-[#e0c3a0] rounded focus:ring-[#f7c59f]"
                      />
                      <span className="text-[#7c5c36]">{material}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear All Filters */}
              <button
                onClick={clearAllFilters}
                className="w-full py-3 px-4 border-2 border-[#e0c3a0] text-[#a67c52] rounded-xl font-semibold hover:bg-[#f7e1c7] transition-colors duration-200"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 border-2 border-[#e0c3a0] shadow-lg">
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <span className="text-[#7c5c36] font-medium">
                  {filteredProducts.length} products found
                </span>
                
                {/* Active Filters Indicator */}
                {(searchTerm || selectedCategories.length > 0 || selectedMaterials.length > 0 || priceRange[0] > 1000 || priceRange[1] < 500000) && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#D4AF37] font-semibold">Active Filters:</span>
                    <div className="flex flex-wrap gap-1">
                      {searchTerm && (
                        <span className="bg-[#D4AF37] text-white text-xs px-2 py-1 rounded-full">
                          Search: "{searchTerm}"
                        </span>
                      )}
                      {selectedCategories.map(cat => (
                        <span key={cat} className="bg-[#a67c52] text-white text-xs px-2 py-1 rounded-full">
                          {cat}
                        </span>
                      ))}
                      {selectedMaterials.map(mat => (
                        <span key={mat} className="bg-[#7c5c36] text-white text-xs px-2 py-1 rounded-full">
                          {mat}
                        </span>
                      ))}
                      {(priceRange[0] > 1000 || priceRange[1] < 500000) && (
                        <span className="bg-[#D4AF37] text-white text-xs px-2 py-1 rounded-full">
                          ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                {/* View Toggle */}
                <div className="flex bg-[#f7e1c7] rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-[#a67c52] text-white shadow-lg' 
                        : 'text-[#7c5c36] hover:bg-[#e0c3a0]'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-[#a67c52] text-white shadow-lg' 
                        : 'text-[#7c5c36] hover:bg-[#e0c3a0]'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-[#7c5c36] font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border-2 border-[#e0c3a0] rounded-lg bg-white/80 backdrop-blur-sm text-[#3e2d26] focus:outline-none focus:ring-2 focus:ring-[#f7c59f] shadow-lg"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {/* Products Grid/List */}
            {error && (
              <div className="text-center text-red-600 mb-4 bg-red-50 p-4 rounded-lg">{error}</div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="text-center bg-white/95 backdrop-blur-sm rounded-2xl py-16 shadow-xl border-2 border-[#e0c3a0]">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-[#a67c52] mb-2">No products found</h3>
                <p className="text-[#7c5c36] mb-6">Try adjusting your filters or search terms</p>
                <button 
                  onClick={clearAllFilters}
                  className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white px-6 py-3 rounded-xl font-bold hover:from-[#B8941F] hover:to-[#E6C200] transition-all duration-300"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product._id} 
                    product={product} 
                    showNewBadge={false}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
