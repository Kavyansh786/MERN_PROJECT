import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../components/Toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password,
    });

    if (res.data && res.data.user) {
      // ✅ Correct shape for Profile.jsx
      localStorage.setItem('user', JSON.stringify({ user: res.data.user }));

      showToast({
        type: 'success',
        message: 'Login successful!',
        duration: 3000,
      });

      setTimeout(() => {
        navigate('/user/profile'); // ✅ Based on your router
      }, 1000);
    } else {
      showToast({
        type: 'error',
        message: 'Invalid response from server',
        duration: 3000,
      });
    }
  } catch (err) {
    showToast({
      type: 'error',
      message: err.response?.data?.message || 'Invalid credentials',
      duration: 3000,
    });
  }
};
  return (
    <div
      className="min-h-screen flex items-center justify-center px-2 bg-gradient-to-br from-rose-200 via-pink-100 to-amber-100 relative"
      style={{
        backgroundImage: "url('bg 2.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="w-full max-w-md bg-white/90 rounded-3xl shadow-2xl p-8 md:p-10 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#5a3a1b' }}>
          Welcome Back
        </h2>
        <p className="text-center mb-8 text-lg" style={{ color: '#a58a6a' }}>
          Sign in to your account to continue
        </p>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <div>
            <label className="block mb-1 font-medium" style={{ color: '#7c5c36' }}>
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-200 transition text-gray-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium" style={{ color: '#7c5c36' }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-200 pr-10 text-gray-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-400 focus:outline-none"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm mt-1 mb-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-rose-400" />
              <span className="text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-rose-400 hover:text-rose-500 font-medium transition">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full text-white py-3 rounded-xl font-semibold text-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]/50"
            style={{ backgroundColor: '#B76E79' }}
          >
            Sign In <span className="text-xl">→</span>
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Don&apos;t have an account?
          <a href="/register" className="text-rose-500 font-semibold hover:underline ml-1">
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
}
