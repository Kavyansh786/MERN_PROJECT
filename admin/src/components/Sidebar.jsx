import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users as UsersIcon,
  Star,
  Boxes,
  Ticket,
  BarChart2,
  Settings,
  LogOut,
  ExternalLink
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/products", icon: Package, label: "Products" },
    { path: "/admin/orders", icon: ShoppingCart, label: "Orders" },
    { path: "/admin/users", icon: UsersIcon, label: "Users" },
    { path: "/admin/reviews", icon: Star, label: "Reviews" },
    { path: "/admin/inventory", icon: Boxes, label: "Inventory" },
    { path: "/admin/coupons", icon: Ticket, label: "Coupons" },
    { path: "/admin/reports", icon: BarChart2, label: "Reports" },
    { path: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-[#fff6ee] via-white to-[#fef3e2] border-l-8 border-[#D4AF37] shadow-lg font-sans relative">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-xl flex items-center justify-center shadow-md">
            <Package className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#D4AF37] tracking-wide">Admin Panel</h1>
            <p className="text-xs text-gray-500 font-medium">Jewelry Store</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-base ${
                    isActive
                      ? "bg-[#D4AF37] text-white shadow-lg transform scale-105"
                      : "text-gray-700 hover:bg-[#fff6ee] hover:text-[#D4AF37] hover:shadow-md"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-100 bg-gradient-to-t from-[#fff6ee] to-white">
        <a 
          href="/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center space-x-3 px-4 py-3 text-[#D4AF37] hover:bg-[#fff6ee] rounded-xl transition-all duration-200 w-full font-semibold hover:shadow-md"
        >
          <ExternalLink className="w-5 h-5" />
          <span>View Store</span>
        </a>
        <button className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-[#fff6ee] rounded-xl transition-all duration-200 w-full mt-2 hover:shadow-md">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
} 