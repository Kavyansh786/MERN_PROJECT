import React from 'react';

const reviews = [
  {
    name: 'Priya Sharma',
    product: 'Rose Gold Infinity Bracelet',
    comment: 'Absolutely stunning jewelry! The quality is great and I got so many compliments.',
    image: 'https://i.pinimg.com/1200x/94/3a/d0/943ad0ad0332b9194e74347ef423efff.jpg',
  },
  {
    name: 'Ananya Gupta',
    product: 'Custom Wedding Ring',
    comment: 'They made exactly what I imagined. Highly recommend their customization!',
    image: 'https://i.pinimg.com/1200x/6f/67/dc/6f67dcd6381155dc03953227d06d217f.jpg',
  },
  {
    name: 'Meera Patel',
    product: 'Silver Lotus Necklace',
    comment: 'Fast delivery and beautiful packaging. The necklace is even better in person!',
    image: 'https://i.pinimg.com/1200x/74/b6/86/74b68679224a650cb46f9b25526ef7ad.jpg',
  },
];

export default function CustomerReviews() {
  return (
    <section className="bg-white text-[#3E2723] py-12 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold font-serif text-[#D4AF37] mb-2">What Our Customers Say</h2>
        <span className="block h-1 w-16 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] rounded-full mx-auto mb-2"></span>
        <p className="text-base mt-2 text-[#8D6E63]">Real stories from our jewelry lovers</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {reviews.map((item, index) => (
          <div key={index} className="bg-white shadow rounded-lg overflow-hidden">
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <p className="text-yellow-500 mb-2">★★★★★</p>
              <p className="italic">"{item.comment}"</p>
              <div className="mt-3">
                <p className="font-bold">{item.name}</p>
                <p className="text-sm text-[#8D6E63]">Purchased: {item.product}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 