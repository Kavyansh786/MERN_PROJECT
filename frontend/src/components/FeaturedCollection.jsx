import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { buildApiUrl } from '../config/api';

export default function FeaturedCollection() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(buildApiUrl('/products'))
      .then(res => setProducts(res.data))
      .catch(err => {
        console.error('Failed to fetch featured products:', err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#4a2c2a] px-6 py-10 mt-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold font-serif text-[#D4AF37] mb-2">Featured Collection</h2>
        <span className="block h-1 w-16 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] rounded-full mx-auto mb-2"></span>
        <p className="text-base mt-2 text-[#8D6E63]">Curated pieces that define luxury and elegance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {products.slice(0, 8).map((product) => (
          <ProductCard key={product._id} product={product} showNewBadge={false} />
        ))}
      </div>
    </div>
  );
} 
