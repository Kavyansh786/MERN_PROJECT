import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      });
  }, []);

  return (
    <div className="min-h-screen bg-white px-6 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-center">Shop All Jewelry</h1>

      {error && (
        <div className="text-center text-red-600 mb-4">{error}</div>
      )}

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="border rounded-lg overflow-hidden shadow">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-4">₹{product.price.toLocaleString()}</p>
                <Link
                  to={`/product/${product._id}`}
                  className="block text-center bg-black text-white py-2 rounded hover:bg-gray-800 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
