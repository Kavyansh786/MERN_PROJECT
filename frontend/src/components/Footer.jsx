import React from 'react';
import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#f7f4ec] py-10 px-4 border-t border-[#f3ede2]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 text-[#2d1a0c] text-sm">
        {/* Get To Know Us */}
        <div>
          <h3 className="font-semibold mb-2 border-b border-[#d6d1c4] pb-1">Get To Know Us</h3>
          <ul className="space-y-1 mt-2">
            <li><a href="#" className="text-[#a1004c] hover:underline">About Us</a></li>
            <li><a href="#" className="text-[#a1004c] hover:underline">Brides Of India</a></li>
            <li><a href="#" className="text-[#a1004c] hover:underline">Our Stores</a></li>
            <li><a href="#" className="text-[#a1004c] hover:underline">CSR</a></li>
            <li><a href="#" className="text-[#a1004c] hover:underline">Blog</a></li>
          </ul>
        </div>
        {/* Let Us Help You */}
        <div>
          <h3 className="font-semibold mb-2 border-b border-[#d6d1c4] pb-1">Let Us Help You</h3>
          <ul className="space-y-1 mt-2">
            <li><a href="#" className="text-[#a1004c] hover:underline">FAQ</a></li>
            <li><a href="#" className="text-[#a1004c] hover:underline">Track My Order</a></li>
            <li><a href="#" className="text-[#a1004c] hover:underline">Ring Size Guide</a></li>
            <li><a href="#" className="text-[#a1004c] hover:underline">Bangle Size Guide</a></li>
            <li><a href="#" className="text-[#a1004c] hover:underline">Site Map</a></li>
          </ul>
        </div>
        {/* Policies */}
        <div>
          <h3 className="font-semibold mb-2 border-b border-[#d6d1c4] pb-1">Policies</h3>
          <ul className="space-y-1 mt-2">
            <li><a href="#" className="text-[#a1004c] hover:underline">Refund Policy</a></li>
            <li><a href="#" className="text-[#a1004c] hover:underline">Buyback Policy</a></li>
            <li><a href="#" className="text-[#a1004c] hover:underline">Exchange Policy</a></li>
            <li><a href="#" className="text-[#a1004c] hover:underline">Shipping Policy</a></li>
            <li><a href="#" className="text-[#a1004c] hover:underline">Cancellation Policy</a></li>
            <li><a href="#" className="text-[#a1004c] hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="text-[#a1004c] hover:underline">Make To Order</a></li>
            <li><a href="#" className="text-[#a1004c] hover:underline">Terms of Service</a></li>
          </ul>
        </div>
        {/* Useful Links */}
        <div>
          <h3 className="font-semibold mb-2 border-b border-[#d6d1c4] pb-1">Useful Links</h3>
          <ul className="space-y-1 mt-2">
            <li><a href="#" className="text-[#a1004c] hover:underline">Build Your Custom Jewellery</a></li>
            <li><a href="#" className="text-[#a1004c] hover:underline">Scheme Payment <span className="text-xs">(India only)</span></a></li>
            <li><a href="#" className="text-[#a1004c] hover:underline">Book an Appointment</a></li>
            <li><a href="#" className="text-[#a1004c] hover:underline">Careers</a></li>
          </ul>
        </div>
        {/* Customer Service */}
        <div>
          <h3 className="font-semibold mb-2 border-b border-[#d6d1c4] pb-1">Customer Service</h3>
          <ul className="space-y-1 mt-2">
            <li className="flex items-center gap-2"><FaPhoneAlt className="text-[#2d1a0c]" /> <span>+91 22 62300916 <span className="text-xs text-[#a1004c]">(10.00am – 7.00pm)</span></span></li>
            <li className="flex items-center gap-2"><FaWhatsapp className="text-[#25d366]" /> <span>9167780916 <span className="text-xs text-[#a1004c]">(9.00am – 6.00pm)</span></span></li>
            <li><a href="mailto:care.in@malabargoldanddiamonds.com" className="text-[#a1004c] hover:underline">dummymail@gmail.com</a></li>
            <li className="text-[#7b5d58] text-xs mt-2">LUXE GOLD AND DIAMONDS<br/></li>
          </ul>
        </div>
      </div>
    </footer>
  );
} 