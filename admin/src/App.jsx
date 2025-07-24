import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import Reviews from "./pages/Reviews";


function OrderDetails() {
  return <div className="p-8">Order Details Page (to be implemented)</div>;
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-64">
          <Topbar />
          <main className="flex-1">
            <Routes>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/products" element={<Products />} />
              <Route path="/admin/orders" element={<Orders />} />
              <Route path="/admin/orders/:id" element={<OrderDetails />} />
              <Route path="/admin/users" element={<Users/>}/>
              <Route path="/admin/reviews" element={<Reviews/>}/>
              <Route path="*" element={<Navigate to="/admin" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
} 