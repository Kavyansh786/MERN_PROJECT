import React from 'react'
import { Link } from 'react-router-dom'

const dummyProducts = [
  {
    id: 1,
    name: 'Gold Necklace',
    price: 14999,
    image: 'https://via.placeholder.com/300x200?text=Necklace',
  },
  {
    id: 2,
    name: 'Diamond Ring',
    price: 19999,
    image: 'https://via.placeholder.com/300x200?text=Ring',
  },
  {
    id: 3,
    name: 'Silver Bracelet',
    price: 4999,
    image: 'https://via.placeholder.com/300x200?text=Bracelet',
  },
  {
    id: 4,
    name: 'Pearl Earrings',
    price: 7999,
    image: 'https://via.placeholder.com/300x200?text=Earrings',
  },
]

export default function Shop() {
  return (
    <div className="min-h-screen bg-white px-6 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-center">Shop All Jewelry</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {dummyProducts.map((product) => (
          <div key={product.id} className="border rounded-lg overflow-hidden shadow">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-4">₹{product.price.toLocaleString()}</p>
              <Link
                to={`/products/${product.id}`}
                className="block text-center bg-black text-white py-2 rounded hover:bg-gray-800 transition"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
