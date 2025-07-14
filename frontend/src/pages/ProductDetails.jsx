import React from 'react'
import { useParams } from 'react-router-dom'

const dummyProduct = {
  id: 1,
  name: 'Gold Necklace',
  price: 14999,
  description:
    'This handcrafted gold necklace is made with 22k pure gold and is the perfect blend of tradition and luxury.',
  image: 'https://via.placeholder.com/600x400?text=Gold+Necklace',
}

export default function ProductDetail() {
  const { id } = useParams()

  // In real app, you'd fetch by ID. We're showing a dummy product for now.
  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <img
          src={dummyProduct.image}
          alt={dummyProduct.name}
          className="w-full h-auto object-cover rounded-lg shadow"
        />

        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{dummyProduct.name}</h1>
          <p className="text-xl text-gray-600">₹{dummyProduct.price.toLocaleString()}</p>
          <p>{dummyProduct.description}</p>

          <button className="mt-6 bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
