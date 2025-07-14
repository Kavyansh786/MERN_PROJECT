import React from 'react'

const dummyCart = [
  {
    id: 1,
    name: 'Gold Necklace',
    price: 14999,
    quantity: 1,
    image: 'https://via.placeholder.com/100x100?text=Necklace',
  },
  {
    id: 2,
    name: 'Diamond Ring',
    price: 19999,
    quantity: 2,
    image: 'https://via.placeholder.com/100x100?text=Ring',
  },
]

export default function Cart() {
  const total = dummyCart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>
      <div className="space-y-4">
        {dummyCart.map((item) => (
          <div
            key={item.id}
            className="flex items-center border p-4 rounded-lg justify-between shadow"
          >
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
            <div className="flex-1 px-4">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p>₹{item.price.toLocaleString()} × {item.quantity}</p>
            </div>
            <p className="font-bold text-lg">₹{(item.price * item.quantity).toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-right">
        <h3 className="text-xl font-bold">Total: ₹{total.toLocaleString()}</h3>
        <button className="mt-4 px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition">
          Proceed to Checkout
        </button>
      </div>
    </div>
  )
}
