import React from 'react';

const bridalProducts = [
  {
    id: 1,
    name: 'Royal Pearl Wedding Set',
    image: 'https://i.pinimg.com/originals/3f/9a/f7/3f9af7b3b5c96bba6c7dfb38b2a53e52.jpg',
    badges: ['Bestseller', 'AR Try-On', '10% OFF'],
  },
  {
    id: 2,
    name: 'Gold Bridal Choker',
    image: 'https://i.pinimg.com/originals/1a/77/3b/1a773b2c4d50e6076a536fd64f2389a3.jpg',
    badges: ['New', 'AR Try-On'],
  },
  {
    id: 3,
    name: 'Diamond Maang Tikka',
    image: 'https://i.pinimg.com/originals/4e/f5/47/4ef5470a8dd2165a7f2e6e2e8123d529.jpg',
    badges: ['AR Try-On', '19% OFF'],
  },
  {
    id: 4,
    name: 'Elegant Nath Ring',
    image: 'https://i.pinimg.com/originals/c2/13/43/c21343a063a8dbb14b6c2d91b55b0b0d.jpg',
    badges: ['Exclusive'],
  },
  {
    id: 5,
    name: 'Bridal Combo Set',
    image: 'https://i.pinimg.com/originals/a5/2d/20/a52d207be4c4d69c5895b0c81cb98cb0.jpg',
    badges: ['Trending', 'AR Try-On'],
  },
  {
    id: 6,
    name: 'Classic Pearl Nath',
    image: 'https://i.pinimg.com/originals/b3/0d/13/b30d13517f8a6a77cb63a9d13cc9315b.jpg',
    badges: ['AR Try-On'],
  },
];

const BridalCollection = () => {
  return (
    <div className="bg-pink-50 py-10 px-4">
      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-brown-800">
          Adorn Your Big Day with <span className="text-rose-500">Brilliance</span>
        </h1>
        <p className="text-lg text-brown-600 mt-2 max-w-3xl mx-auto">
          Celebrate your special day with our exquisite bridal collection — featuring timeless craftsmanship and modern elegance.
        </p>
      </div>

      {/* Filters (UI only) */}
      <div className="flex justify-center gap-4 flex-wrap mb-8">
        {['All', 'Wedding Sets', 'Chokers', 'Maang Tikka', 'Nath', 'Combos'].map((cat, i) => (
          <button
            key={i}
            className={`px-4 py-2 rounded-full border ${i === 0 ? 'bg-rose-400 text-white' : 'bg-white text-brown-700'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {bridalProducts.map((item) => (
          <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition duration-200">
            <div className="relative">
              <img src={item.image} alt={item.name} className="w-full h-64 object-cover" />
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {item.badges.map((badge, i) => (
                  <span
                    key={i}
                    className={`text-xs font-bold px-2 py-1 rounded text-white ${
                      badge.includes('OFF')
                        ? 'bg-red-500'
                        : badge === 'New'
                        ? 'bg-green-500'
                        : badge === 'Trending'
                        ? 'bg-purple-500'
                        : badge === 'Exclusive'
                        ? 'bg-orange-500'
                        : 'bg-pink-600'
                    }`}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-brown-800 font-semibold text-lg">{item.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BridalCollection;
