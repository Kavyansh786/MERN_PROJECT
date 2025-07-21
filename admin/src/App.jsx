import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Topbar from "./components/Topbar";

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <Topbar />
          <main className="flex-1 bg-[#fff6ee] p-8">
            <Routes>
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/products" element={<Products />} />
              <Route path="/admin/orders" element={<Orders />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="*" element={<Navigate to="/admin" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
} 