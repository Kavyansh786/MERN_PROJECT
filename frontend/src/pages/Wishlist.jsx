import React from 'react'

const wishlistItems = [
  {
    id: 1,
    name: 'Silver Bracelet',
    price: 4999,
    image: 'https://via.placeholder.com/100x100?text=Bracelet',
  },
  {
    id: 2,
    name: 'Diamond Ring',
    price: 19999,
    image: 'https://via.placeholder.com/100x100?text=Ring',
  },
]

export default function Wishlist() {
  return (
    <div className="min-h-screen bg-white p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {wishlistItems.map((item) => (
          <div key={item.id} className="border p-4 rounded shadow text-center">
            <img src={item.image} alt={item.name} className="mx-auto mb-2" />
            <h2 className="font-semibold">{item.name}</h2>
            <p>₹{item.price.toLocaleString()}</p>
            <button className="mt-2 px-4 py-1 bg-black text-white rounded hover:bg-gray-800">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
