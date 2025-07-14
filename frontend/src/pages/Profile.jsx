import React from 'react'

export default function Profile() {
  return (
    <div className="min-h-screen bg-white text-gray-800 p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Profile</h1>
      <div className="bg-gray-100 p-6 rounded shadow space-y-4">
        <p><strong>Name:</strong> John Doe</p>
        <p><strong>Email:</strong> johndoe@example.com</p>
        <p><strong>Phone:</strong> +91 9876543210</p>
        <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          Edit Profile
        </button>
      </div>
    </div>
  )
}
