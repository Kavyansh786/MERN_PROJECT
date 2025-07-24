import { useState } from "react";
import { Moon, Sun, Bell, User, Search } from "lucide-react";

export default function Topbar() {
  const [theme, setTheme] = useState("light");
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow w-full">
      {/* Search Bar */}
      <div className="flex-1 max-w-xs">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
      </div>
      {/* Right Controls */}
      <div className="flex items-center space-x-4 ml-auto">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon className="w-5 h-5 text-gray-600" /> : <Sun className="w-5 h-5 text-yellow-500" />}
        </button>
        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition" aria-label="Notifications">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
        </button>
        {/* Profile */}
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center border-2 border-blue-600">
          <User className="w-5 h-5 text-white" />
        </div>
      </div>
    </header>
  );
}