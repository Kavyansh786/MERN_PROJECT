import React from 'react';
import { useNavigate } from 'react-router-dom';

const giftingItems = [
  { title: 'Birthday', image: 'birthday.png' },
  { title: 'Anniversary', image: 'anniversary.png' },
  { title: 'Baby Birth', image: 'baby.png' },
  { title: 'Festive collection', image: 'festive.png' },
  { title: 'Personalised Jewellery', image: 'featured.png' },
  { title: 'Raksha Bandhan Collection', image: 'festive.png' },
];

export default function GiftingAndMore() {
  const navigate = useNavigate();

  const handleItemClick = (title) => {
    if (title === 'Raksha Bandhan Collection') {
      navigate('/raksha-bandhan');
    }
    // Add other navigation logic for other items if needed
  };

  return (
    <div className="pt-8 px-6 bg-white text-[#4a2c2a]">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold font-serif text-[#D4AF37] mb-2">Gifting & More</h2>
        <span className="block h-1 w-16 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] rounded-full mx-auto mb-2"></span>
        <p className="text-[#7b5d58] text-lg mt-2 font-medium">Gifts that mark a moment</p>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-3 gap-6">
        {/* Left 2x2 smaller cards */}
        <div className="col-span-2 grid grid-cols-2 grid-rows-2 gap-4">
          {giftingItems.slice(0, 4).map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleItemClick(item.title)}
              className="rounded-xl overflow-hidden relative shadow hover:shadow-lg transition-transform hover:scale-105 aspect-[4/3] cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 bg-black/50 text-white w-full py-2 text-center font-semibold text-sm">
                {item.title}
              </div>
            </div>
          ))}
        </div>

        {/* Right stacked tall rectangles */}
        <div className="flex flex-col gap-4">
          {giftingItems.slice(4).map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleItemClick(item.title)}
              className="rounded-xl overflow-hidden relative shadow hover:shadow-lg transition-transform hover:scale-105 h-[172px] cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 bg-black/50 text-white w-full py-2 text-center font-semibold text-sm">
                {item.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
