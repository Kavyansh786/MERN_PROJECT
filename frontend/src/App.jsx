import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import OtpVerification from './pages/OtpVerification';
import Profile from './pages/Profile';
import GoogleAuthSuccess from './pages/GoogleAuthSuccess';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import TrackOrder from './pages/TrackOrder';
import Wishlist from './pages/Wishlist';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivateRoute from './components/PrivateRoutes'
import './index.css';
import BridalCollection from './pages/BridalCollection';
import Address from './pages/Address';
import Payment from './pages/Payment';
import VirtualTryOnMain from './components/VirtualTryOn/VirtualTryOnMain';
import RakshaBandhan from './pages/RakshaBandhan';
import SeasonalPage from './pages/SeasonalPage';

// Shop by Category Pages
import Earrings from './pages/Earrings';
import Necklaces from './pages/Necklaces';
import Bracelets from './pages/Bracelets';
import Rings from './pages/Rings';

// Gifting Category Pages
import BirthdayGifts from './pages/BirthdayGifts';
import ZodiacJwellery from './pages/ZodiacJwellery';
import AnniversaryGifts from './pages/AnniversaryGifts';
import FestiveGifts from './pages/FestiveGifts';
import PersonalizedGifts from './pages/PersonalizedGifts';
import RingSizeGuide from './pages/RingSizeGuide';
import BangleSizeGuide from './pages/BangleSizeGuide';
import ScrollToTop from './components/ScrollToTop';
import Chatbot from './components/Chatbot';
import InstallationCheck from './components/VirtualTryOn/InstallationCheck';
import { VirtualTryOnProvider } from './contexts/VirtualTryOnContext';

export default function App() {
  return (
    <>
      <Navbar />
      <ScrollToTop />
      <Chatbot />
      {/* <InstallationCheck /> */}
      <VirtualTryOnProvider>
        <VirtualTryOnMain />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<OtpVerification />} />
          <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />
          <Route path="/user/profile" element={<Profile />} />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders/:orderId"
            element={
              <PrivateRoute>
                <OrderDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/track-order"
            element={
              <PrivateRoute>
                <TrackOrder />
              </PrivateRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <PrivateRoute>
                <Wishlist />
              </PrivateRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/bridal" element={<BridalCollection/>} />
          <Route path="/raksha-bandhan" element={<RakshaBandhan/>} />
          <Route path="/seasonal/:slug" element={<SeasonalPage/>} />
          
          {/* Shop by Category Routes */}
          <Route path="/earrings" element={<Earrings />} />
          <Route path="/necklaces" element={<Necklaces />} />
          <Route path="/bracelets" element={<Bracelets />} />
          <Route path="/rings" element={<Rings />} />
          
          {/* Gifting Category Routes */}
          <Route path="/birthday-gifts" element={<BirthdayGifts />} />
          <Route path="/zodiac-jewelry" element={<ZodiacJwellery />} />
          <Route path="/anniversary-gifts" element={<AnniversaryGifts />} />
          <Route path="/festive-gifts" element={<FestiveGifts />} />
          <Route path="/personalized-gifts" element={<PersonalizedGifts />} />
          
          {/* Size Guide Routes */}
          <Route path="/ring-size-guide" element={<RingSizeGuide />} />
          <Route path="/bangle-size-guide" element={<BangleSizeGuide />} />

          
          <Route
            path="/address"
            element={
              <PrivateRoute>
                <Address />
              </PrivateRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <PrivateRoute>
                <Payment />
              </PrivateRoute>
            }
          />
        </Routes>
      </VirtualTryOnProvider>
    </>
  );
}