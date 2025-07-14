import React from 'react'

export default function Home() {
  return (
    <div className="bg-white min-h-screen text-gray-800">
      <section className="text-center py-16 px-4">
        <h1 className="text-4xl font-bold mb-4">Welcome to Luxury Jewelry</h1>
        <p className="text-lg mb-8">
          Explore our stunning collection of handcrafted jewelry for every occasion.
        </p>
        <a
          href="/shop"
          className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
        >
          Shop Now
        </a>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-8 py-10">
        <div className="bg-gray-100 rounded-lg p-6 shadow text-center">
          <h2 className="text-xl font-semibold mb-2">Necklaces</h2>
          <p className="text-sm">Elegant and timeless designs</p>
        </div>
        <div className="bg-gray-100 rounded-lg p-6 shadow text-center">
          <h2 className="text-xl font-semibold mb-2">Rings</h2>
          <p className="text-sm">Perfect for engagements & more</p>
        </div>
        <div className="bg-gray-100 rounded-lg p-6 shadow text-center">
          <h2 className="text-xl font-semibold mb-2">Bracelets</h2>
          <p className="text-sm">Chic and stylish accessories</p>
        </div>
        <div className="bg-gray-100 rounded-lg p-6 shadow text-center">
          <h2 className="text-xl font-semibold mb-2">Earrings</h2>
          <p className="text-sm">From studs to statement pieces</p>
        </div>
      </section>
    </div>
  )
}
