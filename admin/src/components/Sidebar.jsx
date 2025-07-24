import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users as UsersIcon,
  Star,
  Boxes,
  Ticket,
  BarChart2,
  Settings
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Products", icon: Package, path: "/admin/products" },
  { label: "Orders", icon: ShoppingCart, path: "/admin/orders" },
  { label: "Users", icon: UsersIcon, path: "/admin/users" },
  { label: "Reviews", icon: Star, path: "/admin/reviews" },
  { label: "Inventory", icon: Boxes, path: "/admin/inventory" },
  { label: "Coupons", icon: Ticket, path: "/admin/coupons" },
  { label: "Reports", icon: BarChart2, path: "/admin/reports" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

export default function Sidebar({ active = "Dashboard" }) {
  return (
    <aside className="w-64 bg-white py-6 px-4 space-y-8 border-r border-gray-200 flex flex-col fixed inset-y-0 left-0 z-20">
      <div>
        <h1 className="text-2xl font-bold text-gold tracking-wide">Admin Panel</h1>
        <p className="text-xs text-gray-500 font-medium">Jewelry Store</p>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.label === active;
            return (
              <li key={item.label}>
                <a
                  href={item.path}
                  className={`flex items-center w-full space-x-3 px-4 py-3 rounded-xl font-medium text-base transition-all duration-200 ${
                    isActive
                      ? "bg-gold text-white shadow scale-105"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gold"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}