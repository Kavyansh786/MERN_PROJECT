import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || !storedUser.user?.id) {
      navigate('/login');
      return;
    }
    axios
      .get(`http://localhost:5000/api/users/profile?id=${storedUser.user.id}`)
      .then((res) => {
        setUser(res.data);
        setForm({ name: res.data.name, email: res.data.email, phone: res.data.phone || '' });
      })
      .catch((err) => {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
      });
  }, [navigate]);

  const handleEdit = () => {
    setEditMode(true);
    setSuccess('');
  };

  const handleCancel = () => {
    setEditMode(false);
    setForm({ name: user.name, email: user.email, phone: user.phone || '' });
    setSuccess('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const res = await axios.patch(`http://localhost:5000/api/users/profile?id=${storedUser.user.id}`, form);
      setUser(res.data);
      setEditMode(false);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;
  if (!user) return <div className="text-center mt-10">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf8f6] to-[#f7e1c7] text-[#3e2d26] p-6 max-w-xl mx-auto flex flex-col items-center justify-center">
      <div className="w-full bg-white/90 rounded-2xl shadow-xl p-8 space-y-6 mt-10">
        <h1 className="text-3xl font-bold text-center text-[#D4AF37] mb-2">Your Profile</h1>
        {success && <div className="text-green-600 text-center font-semibold">{success}</div>}
        {editMode ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-[#e0c3a0] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-[#e0c3a0] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-[#e0c3a0] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
                required
                pattern="\d{10}"
                title="Phone number must be 10 digits"
              />
            </div>
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#D4AF37] text-white px-6 py-2 rounded hover:bg-[#bfa133] font-semibold shadow"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="space-y-2 text-lg">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
            </div>
            <div className="flex justify-between mt-6">
              <button
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                onClick={handleEdit}
              >
                Edit Profile
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('user');
                  navigate('/login');
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
