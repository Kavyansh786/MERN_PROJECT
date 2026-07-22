import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import Reviews from "./pages/Reviews";
import Inventory from "./pages/Inventory";
import Coupons from "./pages/Coupons";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import ChatbotTraining from "./components/ChatbotTraining";
import SeasonalPage from "./components/SeasonalPage";
import BulkUpload from "./components/BulkUpload";


function OrderDetails() {
  return <div className="p-8">Order Details Page (to be implemented)</div>;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route - Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes - Admin Panel */}
          <Route path="/*" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100 flex">
                <Sidebar />
                <div className="flex-1 flex flex-col ml-64">
                  <Topbar />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/orders/:id" element={<OrderDetails />} />
                      <Route path="/users" element={<Users/>}/>
                      <Route path="/reviews" element={<Reviews/>}/>
                      <Route path="/inventory" element={<Inventory/>}/>
                      <Route path="/coupons" element={<Coupons/>}/>
                      <Route path="/reports" element={<Reports/>}/>
                      <Route path="/chatbot-training" element={<ChatbotTraining/>}/>
                      <Route path="/seasonal-pages" element={<SeasonalPage/>}/>
                      <Route path="/bulk-upload" element={<BulkUpload/>}/>
                      <Route path="/settings" element={<Settings/>}/>
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
} 