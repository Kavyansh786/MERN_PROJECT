import React from 'react';
import { Link } from 'react-router-dom'; // Required for linking

// Categories data
const categories = [
  {
    name: 'Bridal Collection',
    price: 'Starting from ₹32,400*',
    image: 'neck.png',
  },
  {
    name: 'Sleek Rings',
    price: 'Starting from ₹10,080*',
    image: 'gring.png',
  },
  {
    name: 'Elegant Bangles',
    price: 'Starting from ₹36,200*',
    image: 'bangle.png',
  },
  {
    name: 'Stunning Earrings',
    price: 'Starting from ₹10,817*',
    image: 'ear.png',
  },
  {
    name: 'Stylish Mangalsutras',
    price: 'Starting from ₹36,500*',
    image: 'mangal.png',
  },
];

// Single category item component
const CategoryItem = ({ category, isLarge = false }) => {
  const content = (
    <div className="relative rounded-xl overflow-hidden group cursor-pointer w-full h-full">
      <img
        src={category.image}
        alt={category.name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://placehold.co/600x400/0f1d31/FFFFFF?text=Image+Not+Found';
        }}
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
      <div
        className={`absolute inset-0 flex flex-col text-white p-6
          ${isLarge ? 'justify-end items-start text-left' : 'justify-center items-center text-center'}
        `}
      >
        <h3 className="text-2xl font-bold drop-shadow-lg">{category.name}</h3>
        {category.price && <p className="mt-1 text-sm drop-shadow-lg">{category.price}</p>}
      </div>
    </div>
  );

  // Only make Bridal Collection clickable
  return category.name === 'Bridal Collection' ? (
    <Link to="/bridal">{content}</Link>
  ) : (
    content
  );
};

// Main component
export default function ShopByCategory() {
  const largeCategory = categories[0];
  const smallCategories = categories.slice(1);

  return (
    <section className="px-4 py-16 md:px-8 lg:px-16 bg-[#fdf8f6]">
      {/* Section title */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-[#4a2c2a]">Shop by Category</h2>
        <p className="text-[#7b5d58] text-lg mt-2">Curated collections just for you</p>
      </div>

      {/* Category grid */}
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-2 h-auto md:h-[500px]">
        {/* Left column: bridal collection large grid */}
        <div className="h-[250px] md:h-full">
          <CategoryItem category={largeCategory} isLarge={true} />
        </div>

        {/* Right column: smaller categories */}
        <div className="grid grid-cols-2 grid-rows-2 gap-2">
          {smallCategories.map((cat) => (
            <CategoryItem key={cat.name} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
