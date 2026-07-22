import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import ProductCard from '../components/ProductCard';
import { getUserId } from '../utils/userUtils';
import Footer from '../components/Footer';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const userId = getUserId();

    if (!userId) {
      setError('Please login to view your wishlist');
      return;
    }

    axios.get(`/users/wishlist?id=${userId}`)
      .then(res => setWishlist(res.data))
      .catch(err => {
        console.error('Error fetching wishlist:', err);
        setError('Failed to load wishlist');
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#fdf8f6] px-6 py-10 text-[#4a2c2a]">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
          <div className="w-4 h-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded-full"></div>
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
        </div>
        <h1 className="text-5xl font-extrabold tracking-wide text-[#D4AF37] drop-shadow-lg">
          Your Wishlist
        </h1>
        <p className="text-[#7c5c36] text-lg mt-4 font-medium">Your favorite pieces saved for later</p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
          <div className="w-4 h-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded-full"></div>
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
        </div>
      </div>

      {error && (
        <div className="text-center text-red-600 mb-4 bg-red-50 p-4 rounded-lg">{error}</div>
      )}

      {wishlist.length === 0 ? (
        <p className="text-center text-[#7c5c36]/60">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {wishlist.map((item) => (
            <ProductCard key={item._id} product={item} showNewBadge={false} />
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
}
