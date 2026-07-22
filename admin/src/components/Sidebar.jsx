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
  MessageSquare,
  Calendar,
  Upload,
  Settings
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Products", icon: Package, path: "/products" },
  { label: "Bulk Upload", icon: Upload, path: "/bulk-upload" },
  { label: "Orders", icon: ShoppingCart, path: "/orders" },
  { label: "Users", icon: UsersIcon, path: "/users" },
  { label: "Reviews", icon: Star, path: "/reviews" },
  { label: "Inventory", icon: Boxes, path: "/inventory" },
  { label: "Coupons", icon: Ticket, path: "/coupons" },
  { label: "Reports", icon: BarChart2, path: "/reports" },
  { label: "Chatbot Training", icon: MessageSquare, path: "/chatbot-training" },
  { label: "Seasonal Pages", icon: Calendar, path: "/seasonal-pages" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar() {
  const location = useLocation();
  
  console.log('Current location:', location.pathname);
  
  return (
    <aside className="w-64 bg-white py-6 px-4 space-y-8 border-r border-gray-200 flex flex-col fixed inset-y-0 left-0 z-20">
      <div>
        <h1 className="text-2xl font-bold text-gold tracking-wide">Admin Panel</h1>
        <p className="text-xs text-gray-500 font-medium">Auréa</p>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                           (item.path === "/" && location.pathname === "/") ||
                           (item.path !== "/" && location.pathname.startsWith(item.path));
            return (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className={`flex items-center w-full space-x-3 px-4 py-3 rounded-xl font-medium text-base transition-all duration-200 ${
                    isActive
                      ? "bg-gold text-white shadow scale-105"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gold"
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
    </aside>
  );
}