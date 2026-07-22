import React from 'react';
import { useNavigate } from 'react-router-dom';

const giftingItems = [
  { title: 'Birthday', image: 'birthday.png', link: '/birthday-gifts' },
  { title: 'Anniversary', image: 'anniversary.png', link: '/anniversary-gifts' },
  { title: 'Zodiac Jwellery', image: 'https://www.astridandmiyu.com/cdn/shop/collections/zodiac-necklaces_f3ee3b7e-696a-4e0d-bfd5-d176e77bbf8b.jpg?v=1741196677&width=1200', link: '/zodiac-jewelry' },
  { title: 'Festive collection', image: 'festive.png', link: '/festive-gifts' },
];

export default function GiftingAndMore() {
  const navigate = useNavigate();

  const handleItemClick = (title) => {
    const item = giftingItems.find(item => item.title === title);
    if (item && item.link) {
      navigate(item.link);
    }
  };

  return (
    <div className="pt-6 px-6 pb-4 bg-white text-[#4a2c2a]">
      {/* Heading */}
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-extrabold font-serif text-[#D4AF37] mb-2">Gifting & More</h2>
        <span className="block h-1 w-16 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] rounded-full mx-auto mb-2"></span>
        <p className="text-[#7b5d58] text-lg mt-2 font-medium">Gifts that mark a moment</p>
      </div>

      {/* Main Grid - Centered 2x2 layout */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 grid-rows-2 gap-6">
          {giftingItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleItemClick(item.title)}
              className="rounded-xl overflow-hidden relative shadow hover:shadow-lg transition-transform hover:scale-105 aspect-[3/2] cursor-pointer"
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
