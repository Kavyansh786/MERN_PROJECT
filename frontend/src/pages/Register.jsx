import React, { useState } from 'react'
import axios from 'axios'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()
    console.log('Registering:', { name, email, password })

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
      })

      console.log('✅ Registration successful:', response.data)
      alert('Registered successfully!')
    } catch (error) {
      console.error('USER ALREADY EXISTS:', error.response?.data || error.message)
      alert('USER ALREADY EXISTS')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-gray-100 p-8 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <input
          type="text"
          placeholder="Name"
          className="w-full mb-4 px-4 py-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Register
        </button>
      </form>
    </div>
  )
}
