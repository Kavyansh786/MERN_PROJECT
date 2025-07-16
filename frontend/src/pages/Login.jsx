// Login.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password
      })

      localStorage.setItem('user', JSON.stringify(res.data)) // ✅ Save user
      navigate('/user/profile') // ✅ Redirect to profile
    } catch (err) {
      console.error('Login error:', err)
      alert('Invalid credentials or user not found')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-gray-100 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
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
          Login
        </button>
        <p className="text-sm text-center mt-4">
          Don’t have an account? <a href="/register" className="underline">Register</a>
        </p>
      </form>
    </div>
  )
}
