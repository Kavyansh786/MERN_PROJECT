import { useState } from "react";
import { Search, Bell, Moon, Sun, User } from "lucide-react";

export default function Topbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-20">
      {/* Search Bar */}
      <div className="flex items-center w-1/3 max-w-xs">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode((d) => !d)}
          className="p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
        </button>
        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition" aria-label="Notifications">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
        </button>
        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile((s) => !s)}
            className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition"
            aria-label="Profile"
          >
            <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center border-2 border-[#D4AF37]">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-800 hidden md:inline">Admin</span>
          </button>
          {showProfile && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-30">
              <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</button>
              <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 