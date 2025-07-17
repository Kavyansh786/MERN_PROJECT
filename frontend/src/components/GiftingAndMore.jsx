import React from 'react';

const giftingData = [
  {
    name: 'Birthday',
    image: 'birthday.png',
  },
  {
    name: 'Anniversary',
    image: 'anniversary.png',
  },
  {
    name: 'Personalised Jewellery',
    image: 'personalised.png',
  },
  {
    name: 'Baby Birth',
    image: 'baby.png',
  },
  {
    name: 'Festive collection',
    image: 'festive.png',
  },
  {
    name: 'Customized ...',
    image: 'customised.png',
  },
];

const GiftingCard = ({ item, className = '' }) => (
  <div
    className={`relative rounded-2xl overflow-hidden shadow-lg bg-white group hover:scale-105 transition-transform duration-300 cursor-pointer ${className}`}
  >
    <img
      src={item.image}
      alt={item.name}
      className="w-full h-full object-cover"
      onError={e => {
        e.target.onerror = null;
        e.target.src = 'https://placehold.co/600x400/EEE/31343C?text=Image+Not+Found';
      }}
    />
    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
    <div className="absolute bottom-6 left-6 text-left">
      <h3 className="text-2xl font-semibold text-[#f5f3f1] drop-shadow-lg">{item.name}</h3>
    </div>
  </div>
);

export default function GiftingAndMore() {
  return (
    <section className="px-4 py-16 -mt-20 md:px-8 lg:px-16 bg-[#fdf8f6]">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-[#2d1a0c]">Gifting & More</h2>
        <p className="text-[#7b5d58] text-lg mt-2">Gifts that mark a moment</p>
      </div>
      <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 md:gap-6">
        {/* Left 2x2 grid: 2 above, 2 below */}
        <div className="col-span-1 row-span-1 h-40 md:h-48">
          <GiftingCard item={giftingData[0]} />
        </div>
        <div className="col-span-1 row-span-1 h-40 md:h-48">
          <GiftingCard item={giftingData[1]} />
        </div>
        <div className="col-span-1 row-span-1 h-40 md:h-48 row-start-2 col-start-1">
          <GiftingCard item={giftingData[2]} />
        </div>
        <div className="col-span-1 row-span-1 h-40 md:h-48 row-start-2 col-start-2">
          <GiftingCard item={giftingData[3]} />
        </div>
        {/* Right tall rectangles next to each other */}
        <div className="col-span-1 row-span-2 h-full min-h-[340px] col-start-3">
          <GiftingCard item={giftingData[4]} className="h-full min-h-[340px]" />
        </div>
        <div className="col-span-1 row-span-2 h-full min-h-[340px] col-start-4">
          <GiftingCard item={giftingData[5]} className="h-full min-h-[340px]" />
        </div>
      </div>
    </section>
  );
}
