import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

export default function NewArrivals() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => {
        console.error('Failed to fetch new arrivals:', err);
      });
  }, []);

  return (
    <div className="bg-white text-[#4a2c2a] px-6 pt-40 pb-0">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold font-serif text-[#D4AF37] mb-2">New Arrivals</h2>
        <span className="block h-1 w-16 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] rounded-full mx-auto mb-2"></span>
        <p className="text-[#7c5c36] text-lg mt-2 font-medium">Fresh designs that capture the latest trends</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {products.slice(0, 8).map((product) => (
          <ProductCard key={product._id} product={product} showNewBadge={true} />
        ))}
      </div>
    </div>
  );
}
