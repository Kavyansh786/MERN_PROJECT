import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaWhatsapp, FaPhoneAlt, FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaLinkedin } from 'react-icons/fa';
import { useToast } from './Toast';

export default function Footer() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleContactClick = (type) => {
    switch (type) {
      case 'phone':
        window.open('tel:+912262300916', '_blank');
        break;
      case 'whatsapp':
        window.open('https://wa.me/919167780916', '_blank');
        break;
      case 'email':
        window.open('mailto:support@aurea.com', '_blank');
        break;
      default:
        break;
    }
  };

  const handlePolicyClick = (policy) => {
    // For now, show toast for policies that don't have dedicated pages
    showToast({ 
      type: 'info', 
      message: `${policy} page will be available soon!` 
    });
  };

  const handleQuickLinkClick = (page) => {
    navigate(page);
  };

  const handleSizeGuideClick = (type) => {
    if (type === 'Ring') {
      navigate('/ring-size-guide');
    } else if (type === 'Bangle') {
      navigate('/bangle-size-guide');
    }
  };

  const handleAppointmentClick = () => {
    showToast({ 
      type: 'info', 
      message: 'Appointment booking will be available soon!' 
    });
  };

  const handleCustomJewelryClick = () => {
    navigate('/customize');
    showToast({ 
      type: 'info', 
      message: 'Custom jewelry feature coming soon!' 
    });
  };

  const handleTrackOrderClick = () => {
    navigate('/track-order');
  };

  const handleSocialClick = (platform) => {
    const socialLinks = {
      facebook: 'https://facebook.com/aurea',
      instagram: 'https://instagram.com/aurea',
      twitter: 'https://twitter.com/aurea',
      youtube: 'https://youtube.com/aurea',
      linkedin: 'https://linkedin.com/company/aurea'
    };
    
    window.open(socialLinks[platform], '_blank');
  };

  return (
    <>
      {/* Feature Bar */}
      <div className="w-full bg-[#3e2d26] py-8 flex flex-col items-center">
        <div className="max-w-7xl w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4">
          {/* Secure Payment */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-[#6b4a2a] rounded-full w-14 h-14 flex items-center justify-center mb-2">
              {/* Shield Icon */}
              <svg className="w-7 h-7 text-[#e0c3a0]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 3L4 7v5c0 5.25 4.5 9.25 8 10 3.5-.75 8-4.75 8-10V7l-8-4z" />
                <path d="M9.5 12.5l2 2 3-3" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div className="font-bold text-white text-lg">Secure Payment</div>
              <div className="text-[#e0c3a0] text-sm">100% Protected</div>
            </div>
          </div>
          {/* Free Shipping */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-[#6b4a2a] rounded-full w-14 h-14 flex items-center justify-center mb-2">
              {/* Truck Icon */}
              <svg className="w-7 h-7 text-[#e0c3a0]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="1" y="7" width="15" height="10" rx="2" />
                <path d="M16 11h3l3 3v3a2 2 0 0 1-2 2h-1" />
                <circle cx="5.5" cy="17.5" r="1.5" />
                <circle cx="18.5" cy="17.5" r="1.5" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-white text-lg">Free Shipping</div>
              <div className="text-[#e0c3a0] text-sm">Orders above ₹2000</div>
            </div>
          </div>
          {/* Easy Returns */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-[#6b4a2a] rounded-full w-14 h-14 flex items-center justify-center mb-2">
              {/* Circular Arrow Icon for Easy Returns */}
              <svg className="w-7 h-7 text-[#e0c3a0]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 5v4a1 1 0 0 1-1 1H7" />
                <path d="M21 12a9 9 0 1 1-9-9" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-white text-lg">Easy Returns</div>
              <div className="text-[#e0c3a0] text-sm">30-day policy</div>
            </div>
          </div>
          {/* Certified Quality */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-[#6b4a2a] rounded-full w-14 h-14 flex items-center justify-center mb-2">
              {/* Award/Badge Icon */}
              <svg className="w-7 h-7 text-[#e0c3a0]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="6" />
                <path d="M8.5 14l-2.5 7 6-3 6 3-2.5-7" />
                <circle cx="12" cy="8" r="2" fill="#D4AF37" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-white text-lg">Certified Quality</div>
              <div className="text-[#e0c3a0] text-sm">Hallmarked jewelry</div>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-gradient-to-b from-[#fdf8f6] to-[#f7f4ec] py-12 px-4 border-t-2 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-[#3e2d26]">
            
            {/* Company Info */}
            <div className="lg:col-span-1">
              <h3 className="text-2xl font-bold text-[#D4AF37] mb-4">Auréa</h3>
              <p className="text-sm text-[#7c5c36] mb-4">
                Timeless elegance meets modern luxury. Discover our handcrafted jewelry collection.
              </p>
              <div className="flex space-x-4">
                <button 
                  onClick={() => handleSocialClick('facebook')}
                  className="text-[#D4AF37] hover:text-[#FFD700] transition-colors"
                >
                  <FaFacebook size={20} />
                </button>
                <button 
                  onClick={() => handleSocialClick('instagram')}
                  className="text-[#D4AF37] hover:text-[#FFD700] transition-colors"
                >
                  <FaInstagram size={20} />
                </button>
                <button 
                  onClick={() => handleSocialClick('twitter')}
                  className="text-[#D4AF37] hover:text-[#FFD700] transition-colors"
                >
                  <FaTwitter size={20} />
                </button>
                <button 
                  onClick={() => handleSocialClick('youtube')}
                  className="text-[#D4AF37] hover:text-[#FFD700] transition-colors"
                >
                  <FaYoutube size={20} />
                </button>
                <button 
                  onClick={() => handleSocialClick('linkedin')}
                  className="text-[#D4AF37] hover:text-[#FFD700] transition-colors"
                >
                  <FaLinkedin size={20} />
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-[#D4AF37] mb-4 border-b border-[#e0c3a0] pb-2">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-[#7c5c36] hover:text-[#D4AF37] transition-colors">Home</Link></li>
                <li><Link to="/shop" className="text-[#7c5c36] hover:text-[#D4AF37] transition-colors">Shop All</Link></li>
                <li><Link to="/about" className="text-[#7c5c36] hover:text-[#D4AF37] transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="text-[#7c5c36] hover:text-[#D4AF37] transition-colors">Contact</Link></li>
                <li><Link to="/anniversary-gifts" className="text-[#7c5c36] hover:text-[#D4AF37] transition-colors">Anniversary Gifts</Link></li>
                <li><Link to="/festive-gifts" className="text-[#7c5c36] hover:text-[#D4AF37] transition-colors">Festive Gifts</Link></li>
                <li><Link to="/zodiac-jewelry" className="text-[#7c5c36] hover:text-[#D4AF37] transition-colors">Zodiac Jewelry</Link></li>
                <li>
                  <button 
                    onClick={() => handleQuickLinkClick('/wishlist')}
                    className="text-[#7c5c36] hover:text-[#D4AF37] transition-colors"
                  >
                    Wishlist
                  </button>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="font-semibold text-[#D4AF37] mb-4 border-b border-[#e0c3a0] pb-2">Customer Service</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button 
                    onClick={() => handleContactClick('phone')}
                    className="flex items-center gap-2 text-[#7c5c36] hover:text-[#D4AF37] transition-colors"
                  >
                    <FaPhoneAlt size={14} />
                    <span>+91 22 62300916</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleContactClick('whatsapp')}
                    className="flex items-center gap-2 text-[#7c5c36] hover:text-[#D4AF37] transition-colors"
                  >
                    <FaWhatsapp size={14} />
                    <span>+91 9167780916</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleContactClick('email')}
                    className="text-[#7c5c36] hover:text-[#D4AF37] transition-colors"
                  >
                    support@aurea.com
                  </button>
                </li>
                <li>
                  <button 
                    onClick={handleTrackOrderClick}
                    className="text-[#7c5c36] hover:text-[#D4AF37] transition-colors"
                  >
                    Track My Order
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleQuickLinkClick('/orders')}
                    className="text-[#7c5c36] hover:text-[#D4AF37] transition-colors"
                  >
                    My Orders
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleQuickLinkClick('/user/profile')}
                    className="text-[#7c5c36] hover:text-[#D4AF37] transition-colors"
                  >
                    My Account
                  </button>
                </li>
              </ul>
            </div>

            {/* Help & Policies */}
            <div>
              <h4 className="font-semibold text-[#D4AF37] mb-4 border-b border-[#e0c3a0] pb-2">Help & Policies</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button 
                    onClick={() => handleSizeGuideClick('Ring')}
                    className="text-[#7c5c36] hover:text-[#D4AF37] transition-colors"
                  >
                    Ring Size Guide
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleSizeGuideClick('Bangle')}
                    className="text-[#7c5c36] hover:text-[#D4AF37] transition-colors"
                  >
                    Bangle Size Guide
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handlePolicyClick('Refund')}
                    className="text-[#7c5c36] hover:text-[#D4AF37] transition-colors"
                  >
                    Refund Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handlePolicyClick('Shipping')}
                    className="text-[#7c5c36] hover:text-[#D4AF37] transition-colors"
                  >
                    Shipping Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={handleAppointmentClick}
                    className="text-[#7c5c36] hover:text-[#D4AF37] transition-colors"
                  >
                    Book Appointment
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-8 pt-8 border-t border-[#e0c3a0]">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-[#7c5c36]">
              <div className="mb-4 md:mb-0">
                <p>&copy; 2024 Auréa. All rights reserved.</p>
              </div>
              <div className="flex space-x-6">
                <button 
                  onClick={() => handlePolicyClick('Privacy')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Privacy Policy
                </button>
                <button 
                  onClick={() => handlePolicyClick('Terms')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Terms of Service
                </button>
                <button 
                  onClick={() => handleQuickLinkClick('/personalized-gifts')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Personalized Gifts
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
} 