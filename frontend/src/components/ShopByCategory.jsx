import React from 'react';

const categories = [
  {
    name: 'Gold Necklaces',
    designs: '120+ designs',
    image: 'https://i.pinimg.com/1200x/c1/35/11/c13511f3fc8433ee2944924e1fea4c77.jpg',
  },
  {
    name: 'Silver Bracelets',
    designs: '85+ designs',
    image: 'https://i.pinimg.com/736x/00/d5/fe/00d5fe040fdb4102761682cf65553062.jpg',
  },
  {
    name: 'Diamond Rings',
    designs: '95+ designs',
    image: 'https://i.pinimg.com/736x/9a/b2/2b/9ab22b70480a08655371e06e6c181091.jpg',
  },
  {
    name: 'Pearl Earrings',
    designs: '110+ designs',
    image: 'https://i.pinimg.com/736x/94/be/c5/94bec5af9713c94c3b0041e84f1c26df.jpg',
  },
];

export default function ShopByCategory() {
  return (
    <section className="text-center px-6 py-16 bg-[#eeeee4]">
      <h2 className="text-3xl font-bold text-[#4a2c2a] mb-2">Shop by Category</h2>
      <p className="text-[#7b5d58] text-lg mb-10">Find the perfect piece for every occasion</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="relative rounded-xl overflow-hidden shadow-lg group hover:scale-105 transition duration-300"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-300"
            />
            <div className="absolute bottom-0 bg-black/40 w-full p-4 text-left text-white">
              <h3 className="text-xl font-bold">{cat.name}</h3>
              <p className="text-sm">{cat.designs}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
