import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/users/wishlist')
      .then(res => setWishlist(res.data))
      .catch(err => {
        console.error('Error fetching wishlist:', err);
        setError('Failed to load wishlist');
      });
  }, []);

  return (
    <div className="min-h-screen bg-white p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Wishlist</h1>

      {error && (
        <p className="text-center text-red-600 mb-4">{error}</p>
      )}

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {wishlist.map((item) => (
            <div key={item._id} className="border p-4 rounded shadow text-center">
              <img
                src={item.image}
                alt={item.name}
                className="mx-auto mb-2 w-24 h-24 object-cover rounded"
              />
              <h2 className="font-semibold">{item.name}</h2>
              <p>₹{item.price.toLocaleString()}</p>
              <button className="mt-2 px-4 py-1 bg-black text-white rounded hover:bg-gray-800">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
