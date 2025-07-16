// Profile.jsx
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'))

    if (!storedUser || !storedUser._id) {
      navigate('/login')
      return
    }

    axios
      .get(`http://localhost:5000/api/users/profile?id=${storedUser._id}`)
      .then(res => setUser(res.data))
      .catch(err => {
        console.error('Error fetching profile:', err)
        setError('Failed to load profile')
      })
  }, [navigate])

  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>
  if (!user) return <div className="text-center mt-10">Loading profile...</div>

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Profile</h1>
      <div className="bg-gray-100 p-6 rounded shadow space-y-4">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
        <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          Edit Profile
        </button>
      </div>
    </div>
  )
}
