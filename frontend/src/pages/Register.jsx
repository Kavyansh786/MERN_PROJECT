import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!firstName || !email || !phone || !password || !confirmPassword || !agreeTerms) {
      setErrorMessage('Please fill all the fields to create an account.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setErrorMessage('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name: `${firstName} ${lastName}`,
        email,
        phone,
        password,
      });

      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/user/profile');
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-200/80 to-white px-2 py-8"
      style={{
        backgroundImage: "url('bg 2.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <form
        onSubmit={handleRegister}
        className="w-full max-w-xl bg-white/95 rounded-3xl shadow-2xl p-8 md:p-10 flex flex-col gap-4"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2" style={{ color: '#5a3a1b' }}>
          Create Account
        </h2>
        <p className="text-center text-lg mb-4" style={{ color: '#a58a6a' }}>
          Join our exclusive jewelry collection
        </p>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="flex-1 px-4 py-3 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="flex-1 px-4 py-3 border rounded-lg"
          />
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 border rounded-lg"
        />

        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full px-4 py-3 border rounded-lg"
        />

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg pr-10"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3">
            👁️
          </button>
        </div>

        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg pr-10"
          />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3">
            👁️
          </button>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
          I agree to the Terms of Service
        </label>

        {errorMessage && <div className="text-red-600">{errorMessage}</div>}

        <button
          type="submit"
          className="bg-[#B76E79] text-white py-3 rounded-xl mt-2"
          disabled={!agreeTerms}
        >
          Create Account →
        </button>

        <p className="text-center mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-rose-500 font-semibold hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
