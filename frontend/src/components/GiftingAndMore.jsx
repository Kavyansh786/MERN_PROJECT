import React from 'react';

const giftingItems = [
  { title: 'Birthday', image: 'birthday.png' },
  { title: 'Anniversary', image: 'anniversary.png' },
  { title: 'Baby Birth', image: 'baby.png' },
  { title: 'Festive collection', image: 'festive.png' },
  { title: 'Personalised Jewellery', image: 'featured.png' },
  { title: 'Customized Jewellery', image: 'customised.png' },
];

export default function GiftingAndMore() {
  return (
    <div className="py-16 px-6 bg-white text-[#4a2c2a]">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold font-serif">Gifting & More</h2>
        <p className="text-[#7b5d58] text-lg">Gifts that mark a moment</p>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-3 gap-6">
        {/* Left 2x2 smaller cards */}
        <div className="col-span-2 grid grid-cols-2 grid-rows-2 gap-4">
          {giftingItems.slice(0, 4).map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl overflow-hidden relative shadow hover:shadow-lg transition-transform hover:scale-105 aspect-[4/3]"
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
              className="rounded-xl overflow-hidden relative shadow hover:shadow-lg transition-transform hover:scale-105 h-[172px]"
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
