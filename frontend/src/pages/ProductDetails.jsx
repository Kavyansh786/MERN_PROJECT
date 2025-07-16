import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        console.error('Failed to fetch product:', err);
        setError('Product not found');
      });
  }, [id]);

  if (error) {
    return <div className="text-center mt-10 text-red-600">{error}</div>;
  }

  if (!product) {
    return <div className="text-center mt-10">Loading product...</div>;
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-auto object-cover rounded-lg shadow"
        />

        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-xl text-gray-600">₹{product.price.toLocaleString()}</p>
          <p>{product.description}</p>

          <button className="mt-6 bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
