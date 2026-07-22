import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import axios from 'axios';
import { buildApiUrl } from '../config/api';

export default function Navbar() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [activeSeasonalPage, setActiveSeasonalPage] = useState(null);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);
  const searchRef = useRef(null);
  const searchDropdownRef = useRef(null);

  // Load user data on component mount and listen for changes
  useEffect(() => {
    const loadUser = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    
    loadUser();
    
    // Listen for storage changes (when user logs in/out from different tabs)
    window.addEventListener('storage', loadUser);
    
    // Listen for custom event to refresh user data (same tab)
    const handleUserUpdate = () => {
      loadUser();
    };
    window.addEventListener('userUpdated', handleUserUpdate);
    
    return () => {
      window.removeEventListener('storage', loadUser);
      window.removeEventListener('userUpdated', handleUserUpdate);
    };
  }, []);

  // Fetch active seasonal page
  useEffect(() => {
    const fetchActiveSeasonalPage = async () => {
      try {
        const response = await axios.get(buildApiUrl('/seasonal-page/active'));
        if (response.data.success && response.data.data) {
          setActiveSeasonalPage(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching active seasonal page:', error);
        setActiveSeasonalPage(null);
      }
    };

    fetchActiveSeasonalPage();
  }, []);

  // Search functionality
  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(buildApiUrl(`/products/search?q=${encodeURIComponent(query)}`));
      setSearchResults(response.data);
      setShowSearchDropdown(response.data.length > 0);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setShowSearchDropdown(false);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search result click
  const handleSearchResultClick = (productId) => {
    setSearchQuery('');
    setShowSearchDropdown(false);
    navigate(`/products/${productId}`);
  };

  // Handle click outside search dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target) &&
          searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleProfileClick = () => {
    setShowMenu(prev => !prev);
  };

  const handleMouseEnter = () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowMenu(true);
  };

  const handleMouseLeave = () => {
    // Small delay to prevent flickering when moving between button and dropdown
    timeoutRef.current = setTimeout(() => {
      setShowMenu(false);
    }, 150);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Dispatch custom event to update navbar immediately
    window.dispatchEvent(new Event('userUpdated'));
    
    showToast({
      type: 'success',
      message: 'Logged out successfully!',
      duration: 3000,
    });
    setShowMenu(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col items-center justify-center gap-3">
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6">
          {/* Brand */}
          <Link to="/" className="text-2xl font-extrabold font-serif text-[#D4AF37] flex items-center gap-3">
            Auréa
          </Link>

          {/* Search */}
          <div className="flex-1 flex justify-center max-w-lg mx-4 relative">
            <div className="flex items-center w-full bg-white border border-[#e0c3a0] rounded-lg px-3 py-2 shadow-md" ref={searchRef}>
              <svg className="w-5 h-5 text-[#a97c50] mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search necklaces, rings, gifts..."
                className="bg-transparent outline-none w-full text-[#3e2d26] placeholder-[#4a3b35] font-serif font-semibold text-base tracking-wide"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery && setShowSearchDropdown(searchResults.length > 0)}
              />
              {isSearching && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#D4AF37] ml-2"></div>
              )}
            </div>
            
            {/* Search Dropdown */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div 
                ref={searchDropdownRef}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#e0c3a0] rounded-lg shadow-2xl z-50 max-h-80 overflow-hidden"
              >
                <div className="py-2">
                  <div className="px-4 py-2 text-sm text-[#7c5c36] font-medium border-b border-[#e0c3a0]">
                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {searchResults.slice(0, 4).map((product) => (
                      <div
                        key={product._id}
                        onClick={() => handleSearchResultClick(product._id)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#f7e1c7] cursor-pointer transition-colors border-b border-[#f0f0f0] last:border-b-0"
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-lg border border-[#e0c3a0] overflow-hidden flex items-center justify-center">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl.startsWith('http') ? 
                                product.imageUrl : 
                                `/${product.imageUrl}`}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Simple fallback - just hide the broken image and show icon
                                e.target.style.display = 'none';
                                const iconDiv = document.createElement('div');
                                iconDiv.innerHTML = `
                                  <svg class="w-8 h-8 text-[#D4AF37]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z"/>
                                  </svg>
                                `;
                                e.target.parentElement.appendChild(iconDiv);
                              }}
                              loading="lazy"
                            />
                          ) : (
                            <svg className="w-8 h-8 text-[#D4AF37]" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z"/>
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-[#3e2d26] text-sm truncate">
                            {product.name}
                          </h4>
                          <p className="text-[#7c5c36] text-xs truncate">
                            {product.category} • ₹{product.price?.toLocaleString()}
                          </p>
                        </div>
                        <svg className="w-4 h-4 text-[#a97c50]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    ))}
                    {searchResults.length > 4 && (
                      <div className="px-4 py-2 text-center text-sm text-[#7c5c36] bg-[#f9f9f9] border-t border-[#e0c3a0]">
                        +{searchResults.length - 4} more results
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Links & Icons */}
          <div className="flex items-center gap-6 justify-center w-full md:w-auto mt-3 md:mt-0">
            <Link to="/shop" className="flex items-center text-[#D4AF37] hover:text-[#4a3b35] font-serif font-semibold tracking-wide text-lg transition duration-200 transform hover:-translate-y-1 px-3 py-2">
              Shop
          
            </Link>

{activeSeasonalPage && (
              <Link 
                to={`/seasonal/${activeSeasonalPage.slug}`} 
                className="font-semibold px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 text-base"
                style={{
                  background: `linear-gradient(to right, ${activeSeasonalPage.colors.primary}20, ${activeSeasonalPage.colors.secondary}20)`,
                  color: activeSeasonalPage.colors.text,
                  borderColor: activeSeasonalPage.colors.primary
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = `linear-gradient(to right, ${activeSeasonalPage.colors.primary}30, ${activeSeasonalPage.colors.secondary}30)`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = `linear-gradient(to right, ${activeSeasonalPage.colors.primary}20, ${activeSeasonalPage.colors.secondary}20)`;
                }}
              >
                <span>{activeSeasonalPage.title}</span>
                <span className="text-lg">✨</span>
              </Link>
            )}

            <Link to="/about" className="text-[#D4AF37] hover:text-[#4a3b35] font-serif font-semibold tracking-wide text-lg transition duration-200 transform hover:-translate-y-1 px-3 py-2">About</Link>

            {/* Wishlist Icon */}
            <Link to="/wishlist" className="hover:text-[#D4AF37] transition-colors p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </Link>

            {/* Cart Icon */}
            <Link to="/cart" className="hover:text-[#D4AF37] transition-colors p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </Link>

            {/* Profile Icon with Beautiful Dropdown */}
            <div 
              className="relative flex items-center" 
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className="hover:text-[#D4AF37] transition-all duration-300 transform hover:scale-110 focus:outline-none p-2"
                aria-label="User menu"
              >
                <div className="relative">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 8-4 8-4s8 0 8 4" />
                  </svg>
                  {user && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#D4AF37] rounded-full border-2 border-white"></div>
                  )}
                </div>
              </button>

              {/* Beautiful Dropdown Menu */}
              {showMenu && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 max-w-sm bg-white/95 backdrop-blur-sm border border-[#e0c3a0] rounded-2xl shadow-2xl z-50 overflow-hidden transform transition-all duration-300 ease-out px-1">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-[#f7e1c7] to-[#e0c3a0] px-4 py-3 border-b border-[#e0c3a0]">
                    {user ? (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#a67c52] rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#3e2d26] text-sm truncate">
                            {user.name || user.email?.split('@')[0] || 'User'}
                          </p>
                          <p className="text-[#7c5c36] text-xs truncate">
                            {user.email || 'user@example.com'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#a67c52] rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 20c0-4 8-4 8-4s8 0 8 4" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#3e2d26] text-sm truncate">Guest User</p>
                          <p className="text-[#7c5c36] text-xs truncate">Please login to continue</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    {user ? (
                      <>
                        {/* My Profile */}
                        <button
                          onClick={() => {
                            navigate('/user/profile');
                            setShowMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#f7e1c7] transition-all duration-200 group"
                        >
                          <svg className="w-5 h-5 text-[#a67c52] group-hover:text-[#D4AF37] transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="font-medium text-[#3e2d26] group-hover:text-[#D4AF37] transition-colors">My Profile</span>
                        </button>

                        {/* My Orders */}
                        <button
                          onClick={() => {
                            navigate('/orders');
                            setShowMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#f7e1c7] transition-all duration-200 group"
                        >
                          <svg className="w-5 h-5 text-[#a67c52] group-hover:text-[#D4AF37] transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="font-medium text-[#3e2d26] group-hover:text-[#D4AF37] transition-colors">My Orders</span>
                        </button>

                        {/* Track Order */}
                        <button
                          onClick={() => {
                            navigate('/track-order');
                            setShowMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#f7e1c7] transition-all duration-200 group"
                        >
                          <svg className="w-5 h-5 text-[#a67c52] group-hover:text-[#D4AF37] transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.447 2.224A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                          </svg>
                          <span className="font-medium text-[#3e2d26] group-hover:text-[#D4AF37] transition-colors">Track Order</span>
                        </button>

                        {/* Wishlist */}
                        <button
                          onClick={() => {
                            navigate('/wishlist');
                            setShowMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#f7e1c7] transition-all duration-200 group"
                        >
                          <svg className="w-5 h-5 text-[#a67c52] group-hover:text-[#D4AF37] transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                          </svg>
                          <span className="font-medium text-[#3e2d26] group-hover:text-[#D4AF37] transition-colors">Wishlist</span>
                        </button>

                        {/* Divider */}
                        <div className="border-t border-[#e0c3a0] my-2"></div>

                        {/* Logout */}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 transition-all duration-200 group"
                        >
                          <svg className="w-5 h-5 text-red-500 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span className="font-medium text-red-600 group-hover:text-red-700 transition-colors">Logout</span>
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Login */}
                        <button
                          onClick={() => {
                            navigate('/login');
                            setShowMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#f7e1c7] transition-all duration-200 group"
                        >
                          <svg className="w-5 h-5 text-[#a67c52] group-hover:text-[#D4AF37] transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          <span className="font-medium text-[#3e2d26] group-hover:text-[#D4AF37] transition-colors">Login</span>
                        </button>

                        {/* Register */}
                        <button
                          onClick={() => {
                            navigate('/register');
                            setShowMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#f7e1c7] transition-all duration-200 group"
                        >
                          <svg className="w-5 h-5 text-[#a67c52] group-hover:text-[#D4AF37] transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                          <span className="font-medium text-[#3e2d26] group-hover:text-[#D4AF37] transition-colors">Register</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
