import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-white border-b shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-black">
          💎 LuxuryJewels
        </Link>
        <div className="space-x-4">
          <Link to="/shop" className="hover:text-gray-600">Shop</Link>
          <Link to="/cart" className="hover:text-gray-600">Cart</Link>
          <Link to="/wishlist" className="hover:text-gray-600">Wishlist</Link>
          <Link to="/orders" className="hover:text-gray-600">Orders</Link>
          <Link to="/user/profile" className="hover:text-gray-600">Profile</Link>
          <Link to="/login" className="hover:text-gray-600">Login</Link>
        </div>
      </div>
    </nav>
  )
}
