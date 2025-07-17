import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'; // ✅ Named import


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/user/profile');
    } catch (err) {
      console.error('Login error:', err);
      alert('Invalid credentials or user not found');
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwt_decode(credentialResponse.credential);
      console.log('Google user decoded:', decoded);
      localStorage.setItem('user', JSON.stringify(decoded));
      navigate('/user/profile');
    } catch (err) {
      console.error('Google login decode error:', err);
      alert('Failed to decode Google credentials.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-2 bg-gradient-to-br from-rose-200 via-pink-100 to-amber-100 relative"
      style={{
        backgroundImage: "url('login1.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="w-full max-w-md bg-white/90 rounded-3xl shadow-2xl p-8 md:p-10 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-center text-brown-800 mb-2" style={{ color: '#5a3a1b' }}>
          Welcome Back
        </h2>
        <p className="text-center text-brown-400 mb-8 text-lg" style={{ color: '#a58a6a' }}>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-200"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 pr-10 focus:outline-none focus:ring-2 focus:ring-rose-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-rose-400"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full text-white py-3 rounded-xl font-semibold text-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 hover:shadow-lg"
            style={{ backgroundColor: '#B76E79' }}
          >
            Sign In <span className="text-xl">→</span>
          </button>
        </form>

        <div className="flex items-center w-full my-6">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="mx-3 text-gray-500 bg-white px-2">Or continue with</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        <div className="w-full flex justify-center mb-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              alert('Google Login Failed');
            }}
            theme="outline"
            size="large"
            width="100%"
          />
        </div>

        <p className="text-center text-gray-600 text-sm">
          Don&apos;t have an account?{' '}
          <a href="/register" className="text-rose-500 font-semibold hover:underline">
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
}
