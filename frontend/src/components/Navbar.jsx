import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  const handleProfileClick = () => {
    setShowMenu(prev => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setShowMenu(false);
    navigate('/login');
  };

  return (
    <nav className="bg-[#fdf8f6] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center gap-4">
        
        {/* Brand */}
        <Link to="/" className="text-2xl font-extrabold font-serif text-[#D4AF37] flex items-center gap-5">
          LUXEE
        </Link>

        {/* Search */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center w-full max-w-xl bg-white border border-[#e0c3a0] rounded-lg px-4 py-2 shadow-md">
            <svg className="w-5 h-5 text-[#a97c50] mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search necklaces, rings, gifts..."
              className="bg-transparent outline-none w-full text-[#3e2d26] placeholder-[#4a3b35] font-serif font-semibold text-base tracking-wide"
            />
          </div>
        </div>

        {/* Links & Icons */}
        <div className="flex items-center gap-8">
          <Link to="/shop" className="flex items-center text-[#D4AF37] hover:text-[#4a3b35] font-serif font-semibold tracking-wide text-lg transition duration-200 transform hover:-translate-y-1">
            Shop
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </Link>

          <Link to="/customize" className="text-[#D4AF37] hover:text-[#4a3b35] font-serif font-semibold tracking-wide text-lg transition duration-200 transform hover:-translate-y-1">Customize</Link>

          <Link to="/about" className="text-[#D4AF37] hover:text-[#4a3b35] font-serif font-semibold tracking-wide text-lg transition duration-200 transform hover:-translate-y-1">About</Link>

          {/* Wishlist Icon */}
          <Link to="/wishlist" className="ml-2 hover:text-[#D4AF37] transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" className="ml-2 hover:text-[#D4AF37] transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </Link>

          {/* ✅ Profile Icon with Dropdown */}
          <div className="relative">
            <button onClick={handleProfileClick} className="ml-2 hover:text-[#D4AF37] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 8-4 8-4s8 0 8 4" />
              </svg>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 bg-white text-[#3e2d26] shadow-lg rounded p-2 w-36 z-50">
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        navigate('/user/profile');
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      navigate('/login');
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                  >
                    Login
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
