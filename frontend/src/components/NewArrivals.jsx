import React from 'react';

const newArrivalsData = [
  {
    title: 'Necklaces',
    description: 'Elegant and timeless designs',
    image: 'https://i.pinimg.com/736x/47/c5/28/47c528ca0995dc8678967dcf78f32a24.jpg',
    price: '₹12,999',
    rating: 5,
    reviews: 43,
  },
  {
    title: 'Rings',
    description: 'Perfect for engagements & more',
    image: 'https://i.pinimg.com/736x/f7/34/68/f7346867164c12c3be0ebf67f1bddf3f.jpg',
    price: '₹9,499',
    rating: 4,
    reviews: 28,
  },
  {
    title: 'Bracelets',
    description: 'Chic and stylish accessories',
    image: 'https://i.pinimg.com/736x/5e/35/f8/5e35f80b9b94f1e6ff64b616b60bf8ea.jpg',
    price: '₹7,299',
    rating: 4,
    reviews: 34,
  },
  {
    title: 'Earrings',
    description: 'From studs to statement pieces',
    image: 'https://i.pinimg.com/1200x/1f/d8/f5/1fd8f50c802373ee0d428a83e70f42e5.jpg',
    price: '₹6,599',
    rating: 5,
    reviews: 52,
  },
];

const NewArrivals = () => {
  return (
    <div className="min-h-screen bg-[#fdf8f6] text-[#4a2c2a] px-6 py-10">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold">New Arrivals</h2>
        <p className="text-[#7b5d58] text-lg mt-2">
          Fresh designs that capture the latest trends
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {newArrivalsData.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <div className="relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-[240px] object-cover"
              />
              <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                ✨ New
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{item.title}</h3>

              {/* Ratings */}
              <div className="flex items-center gap-1 text-yellow-500 mt-1">
                {'★'.repeat(item.rating)}
                {'☆'.repeat(5 - item.rating)}
                <span className="text-[#7b5d58] text-sm ml-2">({item.reviews})</span>
              </div>

              {/* Price */}
              <p className="text-xl font-bold mt-2">{item.price}</p>

              {/* Add to Cart Button */}
              <button className="mt-4 w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                <span>🛒</span> Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewArrivals;