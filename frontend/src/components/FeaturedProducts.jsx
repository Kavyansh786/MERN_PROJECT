import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => {
        console.error('Failed to fetch featured products:', err);
      });
  }, []);

  return (
    <div className="px-6 py-8 bg-white">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold font-serif text-[#D4AF37] mb-2">Featured Collection</h2>
        <span className="block h-1 w-16 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] rounded-full mx-auto mb-2"></span>
        <p className="text-base mt-2 text-[#8D6E63]">Curated pieces that define luxury and elegance</p>
      </div>
      
      {products.length === 0 ? (
        <p className="text-center text-[#7c5c36]/60">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {products.filter(p => p.isFeatured).slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} showNewBadge={false} />
          ))}
        </div>
      )}
    </div>
  );
} 