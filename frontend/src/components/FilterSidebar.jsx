import React from 'react';

export default function FilterSidebar({
  searchTerm,
  setSearchTerm,
  priceRange,
  setPriceRange,
  categories,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  showFilters,
  setShowFilters,
  minPrice = 0,
  maxPrice = 100000
}) {
  const clearAllFilters = () => {
    setSearchTerm('');
    setPriceRange([minPrice, maxPrice]);
    setSelectedCategory('all');
    setSortBy('featured');
  };

  return (
    <>
      {/* Desktop Filter Toggle */}
      <div className="hidden lg:block mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-white border border-[#D4AF37] text-[#3e2d26] font-semibold rounded-lg px-4 py-3 flex items-center gap-2 hover:bg-[#f7e1c7] transition-all"
        >
          <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full bg-white border border-[#D4AF37] text-[#3e2d26] font-semibold rounded-lg px-4 py-3 flex items-center justify-center gap-2 hover:bg-[#f7e1c7] transition-all"
        >
          <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Filter Sidebar */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
        showFilters 
          ? 'lg:w-80 flex-shrink-0 opacity-100 block' 
          : 'lg:w-0 lg:opacity-0 hidden lg:block'
      }`}>
        <div className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-2 border-[#e0c3a0] sticky top-8 transition-all duration-300 ${
          showFilters ? 'transform translate-x-0' : 'lg:transform lg:-translate-x-full'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              <h2 className="text-xl font-bold text-[#a67c52]">Filters</h2>
            </div>
            <button
              onClick={clearAllFilters}
              className="text-sm text-[#D4AF37] hover:text-[#B8941F] font-medium"
            >
              Clear All
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
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
                    left: `${((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100}%`,
                    right: `${100 - ((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100}%`
                  }}
                ></div>
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange[0]}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setPriceRange([value, Math.max(value, priceRange[1])]);
                  }}
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                />
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
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
                    left: `${((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100}%`,
                    transform: 'translateX(-50%) translateY(-50%)'
                  }}
                ></div>
                <div 
                  className="absolute w-4 h-4 bg-[#D4AF37] rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-y-1"
                  style={{
                    left: `${((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100}%`,
                    transform: 'translateX(-50%) translateY(-50%)'
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Categories */}
          {categories && categories.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-[#a67c52] mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label 
                    key={category.id} 
                    className="flex items-center gap-3 cursor-pointer hover:bg-[#f7e1c7]/50 rounded-lg p-2 transition-colors duration-200"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === category.id}
                      onChange={() => setSelectedCategory(category.id)}
                      className="w-4 h-4 text-[#D4AF37] border-[#e0c3a0] focus:ring-[#f7c59f]"
                    />
                    <span className="text-[#7c5c36] flex items-center gap-2">
                      {category.icon && <span>{category.icon}</span>}
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Sort By */}
          <div className="mb-6">
            <h3 className="font-semibold text-[#a67c52] mb-3">Sort By</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-[#e0c3a0] focus:outline-none focus:ring-2 focus:ring-[#f7c59f] bg-white/80 backdrop-blur-sm text-[#3e2d26] shadow-lg"
            >
              <option value="featured">Featured</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
}
