import React from 'react';
import { Link } from 'react-router-dom';

const user = {
  name: 'Monika',
  profilePic: 'https://i.pinimg.com/736x/8c/65/e4/8c65e45f96514921a9eac26646576537.jpg',
  loyalty: 'Heritage Gold',
  stats: {
    orders: 27,
    favorites: 11,
    wishlist: 19,
    tier: 'Heritage Gold',
  },
  note: 'Jewelry is my heritage, my celebration, and my strength. My grandmother’s antique gold kada inspires me to blend tradition with my own modern style. Each piece I wear is a story of love, legacy, and elegance.',
};

const jewelryBox = [
  {
    id: 1,
    name: 'Antique Gold Kada',
    price: 68200,
    imageUrl: 'https://i.pinimg.com/736x/0b/02/14/0b02145fb67c5caa6b92d54ef1781ddf.jpg',
    suggestion: 'A family heirloom, perfect for festive sarees and lehengas.',
  },
  {
    id: 2,
    name: 'Temple Jhumka Earrings',
    price: 31200,
    imageUrl: 'https://i.pinimg.com/736x/03/d8/2c/03d82c6b69ef910f6b240827203cb807.jpg',
    suggestion: 'Wear for weddings or traditional gatherings.',
  },
  {
    id: 3,
    name: 'Polki Diamond Mangalsutra',
    price: 54200,
    imageUrl: 'https://i.pinimg.com/736x/45/df/21/45df2172f9686eb5e6afd3f9a0c040f7.jpg',
    suggestion: 'A blend of tradition and modern minimalism.',
  },
  {
    id: 4,
    name: 'Lotus Motif Pendant',
    price: 22200,
    imageUrl: 'https://i.pinimg.com/736x/1c/70/31/1c70310a09467f01bb90ef7128055e2e.jpg',
    suggestion: 'Symbolizes purity and grace, ideal for daily wear.',
  },
  {
    id: 5,
    name: 'Kundan Bridal Choker',
    price: 81200,
    imageUrl: 'https://i.pinimg.com/736x/7e/2a/6b/7e2a6b2e2e2e2e2e2e2e2e2e2e2e2e2e.jpg',
    suggestion: 'A showstopper for bridal and festive occasions.',
  },
  {
    id: 6,
    name: 'Meenakari Peacock Earrings',
    price: 18400,
    imageUrl: 'https://i.pinimg.com/736x/4a/3b/2c/4a3b2c3b2c3b2c3b2c3b2c3b2c3b2c3b.jpg',
    suggestion: 'Adds a pop of color to any ethnic look.',
  },
  {
    id: 7,
    name: 'Navratna Gold Ring',
    price: 15600,
    imageUrl: 'https://i.pinimg.com/736x/5b/4c/3d/5b4c3d4c3d4c3d4c3d4c3d4c3d4c3d4c.jpg',
    suggestion: 'Auspicious and vibrant, perfect for daily wear.',
  },
  {
    id: 8,
    name: 'Filigree Gold Bangle',
    price: 29800,
    imageUrl: 'https://i.pinimg.com/736x/6c/5d/4e/6c5d4e5d4e5d4e5d4e5d4e5d4e5d4e5d.jpg',
    suggestion: 'Intricate craftsmanship for special occasions.',
  },
  {
    id: 9,
    name: 'Ruby Chandbali Earrings',
    price: 36200,
    imageUrl: 'https://i.pinimg.com/736x/7d/6e/5f/7d6e5f6e5f6e5f6e5f6e5f6e5f6e5f6e.jpg',
    suggestion: 'Statement piece for evening events.',
  },
  {
    id: 10,
    name: 'Pearl Drop Maang Tikka',
    price: 12400,
    imageUrl: 'https://i.pinimg.com/736x/8e/7f/6g/8e7f6g7f6g7f6g7f6g7f6g7f6g7f6g7f.jpg',
    suggestion: 'Completes your traditional ensemble with grace.',
  },
];

const moodboard = [
  {
    id: 1,
    imageUrl: 'https://i.pinimg.com/736x/8c/65/e4/8c65e45f96514921a9eac26646576537.jpg',
    label: 'Heritage Saree Glam',
  },
  {
    id: 2,
    imageUrl: 'https://i.pinimg.com/736x/45/df/21/45df2172f9686eb5e6afd3f9a0c040f7.jpg',
    label: 'Modern Mangalsutra',
  },
  {
    id: 3,
    imageUrl: 'https://i.pinimg.com/736x/03/d8/2c/03d82c6b69ef910f6b240827203cb807.jpg',
    label: 'Temple Elegance',
  },
  {
    id: 4,
    imageUrl: 'https://i.pinimg.com/736x/0b/02/14/0b02145fb67c5caa6b92d54ef1781ddf.jpg',
    label: 'Heirloom Style',
  },
];

export default function Profile() {
  return (
    <div className="min-h-screen bg-[#2d1f1a] text-[#fff6ee] font-sans relative pb-32 flex items-center justify-center" style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/indian-motif.png)', backgroundRepeat: 'repeat', backgroundSize: 'auto' }}>
      {/* Modal Container */}
      <div className="w-full max-w-6xl mx-auto bg-gradient-to-br from-[#3a2320] via-[#7a5a44] to-[#2d1f1a] rounded-3xl shadow-2xl border-8 border-[#FFD7B0] p-12 relative z-10" style={{ boxShadow: '0 0 80px 10px #FFD7B0, 0 8px 64px #3a2320' }}>
        {/* Profile Banner */}
        <div className="relative flex flex-col items-center justify-center py-20 bg-gradient-to-b from-[#3a2320] to-[#7a5a44] shadow-lg rounded-2xl mb-10 border-b-4 border-[#D4AF37]">
          <div className="w-56 h-56 rounded-full border-8 border-[#FFD7B0] shadow-2xl flex items-center justify-center mb-6" style={{ boxShadow: '0 0 60px 10px #FFD7B0, 0 8px 48px #3a2320' }}>
            <img src={user.profilePic} alt={user.name} className="w-52 h-52 object-cover rounded-full border-4 border-[#D4AF37]" />
          </div>
          <h1 className="text-5xl font-serif font-extrabold text-[#FFD7B0] mb-2 drop-shadow-lg tracking-wide" style={{ fontFamily: 'Merriweather, serif' }}>{user.name}</h1>
          <span className="inline-block bg-[#FFD7B0] text-[#3a2320] font-semibold px-8 py-3 rounded-full shadow border-2 border-[#D4AF37] mt-2 text-lg tracking-wide">Loyalty Tier: {user.loyalty}</span>
          <div className="mt-4 flex items-center gap-3">
            <span className="inline-block bg-[#D4AF37] text-[#3a2320] px-4 py-1 rounded-full text-sm font-bold shadow">Heritage Member</span>
            <span className="italic text-[#FFD7B0] text-base">“Tradition meets modern elegance”</span>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="flex justify-center mb-10">
          <span className="inline-block w-32 h-2 rounded-full bg-gradient-to-r from-[#FFD7B0] via-[#D4AF37] to-[#FFD7B0] relative">
            <span className="absolute left-1/2 -translate-x-1/2 -top-3 text-2xl" role="img" aria-label="lotus">🪷</span>
          </span>
        </div>

        {/* Stats Panel */}
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10 justify-center items-center bg-[#3a2320] rounded-2xl shadow-lg p-10 z-10 relative border-4 border-[#FFD7B0] mb-12">
          <div className="flex-1 flex flex-col items-center">
            <span className="text-4xl font-extrabold text-[#FFD7B0]">{user.stats.orders}</span>
            <span className="text-peach-200 text-xl">Total Orders</span>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <span className="text-4xl font-extrabold text-[#FFD7B0]">{user.stats.favorites}</span>
            <span className="text-peach-200 text-xl">Favorite Pieces</span>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <span className="text-4xl font-extrabold text-[#FFD7B0]">{user.stats.wishlist}</span>
            <span className="text-peach-200 text-xl">Wishlist Items</span>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <span className="text-4xl font-extrabold text-[#FFD7B0]">{user.stats.tier}</span>
            <span className="text-peach-200 text-xl">Loyalty Tier</span>
          </div>
        </div>

        {/* My Jewelry Box */}
        <section className="max-w-6xl mx-auto px-2 py-12">
          <h2 className="text-4xl font-serif font-bold text-[#FFD7B0] mb-10 tracking-wide" style={{ fontFamily: 'Merriweather, serif' }}>My Jewelry Box</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {jewelryBox.map((item) => (
              <div key={item.id} className="bg-[#fff6ee] rounded-3xl shadow-2xl overflow-hidden flex flex-col group transition-transform duration-300 hover:scale-105 border-4 border-[#FFD7B0] relative">
                <div className="relative overflow-hidden bg-[#ffe5d0]">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110" />
                  <span className="absolute top-3 left-3 bg-[#D4AF37] text-[#3a2320] px-3 py-1 rounded-full text-xs font-bold shadow">{item.name.includes('Mangalsutra') ? 'Mangalsutra' : item.name.includes('Kada') ? 'Kada' : item.name.includes('Jhumka') ? 'Earrings' : 'Pendant'}</span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-serif text-2xl text-[#3a2320] font-bold mb-2" style={{ fontFamily: 'Merriweather, serif' }}>{item.name}</h3>
                  <div className="text-xl text-[#D4AF37] font-semibold mb-2">₹{item.price.toLocaleString()}</div>
                  <div className="text-peach-200 text-base mb-2 italic">{item.suggestion}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Decorative Divider */}
        <div className="flex justify-center mb-10">
          <span className="inline-block w-32 h-2 rounded-full bg-gradient-to-r from-[#FFD7B0] via-[#D4AF37] to-[#FFD7B0] relative">
            <span className="absolute left-1/2 -translate-x-1/2 -top-3 text-2xl" role="img" aria-label="paisley">🌸</span>
          </span>
        </div>

        {/* My Style Moodboard */}
        <section className="max-w-6xl mx-auto px-2 pb-12">
          <h2 className="text-3xl font-serif font-bold text-[#FFD7B0] mb-8 tracking-wide" style={{ fontFamily: 'Merriweather, serif' }}>My Style Moodboard</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {moodboard.map((look) => (
              <div key={look.id} className="rounded-2xl overflow-hidden shadow-xl border-4 border-[#FFD7B0] bg-[#fff6ee] flex flex-col items-center group hover:shadow-2xl transition-all duration-300">
                <img src={look.imageUrl} alt={look.label} className="w-full h-40 object-cover" />
                <span className="text-peach-200 text-base font-semibold py-2 px-4 mt-2 mb-3 rounded-full bg-[#FFD7B0] text-[#3a2320] tracking-wide">{look.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Decorative Divider */}
        <div className="flex justify-center mb-10">
          <span className="inline-block w-32 h-2 rounded-full bg-gradient-to-r from-[#FFD7B0] via-[#D4AF37] to-[#FFD7B0] relative">
            <span className="absolute left-1/2 -translate-x-1/2 -top-3 text-2xl" role="img" aria-label="mandala">🕉️</span>
          </span>
        </div>

        {/* Personal Note */}
        <section className="max-w-4xl mx-auto px-2 pb-16">
          <h2 className="text-3xl font-serif font-bold text-[#FFD7B0] mb-6 tracking-wide" style={{ fontFamily: 'Merriweather, serif' }}>My Story with Jewelry</h2>
          <div className="bg-[#fff6ee] rounded-3xl shadow-xl p-10 border-4 border-[#FFD7B0]">
            <p className="italic text-2xl text-[#3a2320] leading-relaxed" style={{ fontFamily: 'Dancing Script, cursive' }}>{user.note}</p>
          </div>
        </section>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-12 right-12 flex flex-col gap-6 z-50">
          <Link to="/wishlist">
            <button className="bg-[#FFD7B0] text-[#3a2320] rounded-full shadow-2xl w-20 h-20 flex items-center justify-center text-3xl hover:bg-[#f7c59f] transition-all border-4 border-[#D4AF37]">
              <span role="img" aria-label="wishlist">💖</span>
            </button>
          </Link>
          <Link to="/orders">
            <button className="bg-[#FFD7B0] text-[#3a2320] rounded-full shadow-2xl w-20 h-20 flex items-center justify-center text-3xl hover:bg-[#f7c59f] transition-all border-4 border-[#D4AF37]">
              <span role="img" aria-label="orders">📦</span>
            </button>
          </Link>
          <Link to="/contact">
            <button className="bg-[#FFD7B0] text-[#3a2320] rounded-full shadow-2xl w-20 h-20 flex items-center justify-center text-3xl hover:bg-[#f7c59f] transition-all border-4 border-[#D4AF37]">
              <span role="img" aria-label="support">💬</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
