import React from 'react'

export default function Contact() {
  return (
    <div className="min-h-screen bg-white p-6 text-gray-800 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full px-4 py-2 border rounded"
        />
        <textarea
          placeholder="Your Message"
          rows="5"
          className="w-full px-4 py-2 border rounded"
        ></textarea>
        <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
          Send Message
        </button>
      </form>
    </div>
  )
}
