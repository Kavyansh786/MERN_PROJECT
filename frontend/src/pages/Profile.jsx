import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import AddressManager from '../components/AddressManager';

const TABS = [
  { label: 'Personal Information', value: 'personal' },
  { label: 'Addresses', value: 'addresses' },
  { label: 'Payment Methods', value: 'payments' },
];

export default function Profile() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [rewardPoints, setRewardPoints] = useState(0);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userId = storedUser?.user?.id || storedUser?._id;
    if (!userId) return;
    setLoading(true);
    axios.get(`/users/profile?id=${userId}`)
      .then(res => {
        setUser(res.data);
        setForm({
          firstName: res.data.name?.split(' ')[0] || '',
          lastName: res.data.name?.split(' ').slice(1).join(' ') || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          dob: res.data.dob || '',
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
    // Fetch orders
    axios.get(`http://localhost:5000/api/orders/my?userId=${userId}`)
      .then(res => {
        if (res.data.success) {
          setOrders(res.data.orders || []);
          // Calculate reward points: 10% of total order value
          const totalOrderValue = (res.data.orders || []).reduce((sum, order) => sum + (order.totalPrice || 0), 0);
          setRewardPoints(Math.round(totalOrderValue * 0.10));
        }
      });
    // Fetch wishlist
    axios.get(`http://localhost:5000/api/users/wishlist?id=${userId}`)
      .then(res => setWishlist(res.data || []));
  }, []);

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => setEditMode(false);
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userId = storedUser?.user?.id || storedUser?._id;
    await axios.patch(`/users/profile?id=${userId}`, {
      name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      phone: form.phone,
      dob: form.dob,
    });
    setEditMode(false);
    // Refetch user
    axios.get(`/users/profile?id=${userId}`).then(res => setUser(res.data));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center">User not found</div>;

  // Stats (replace with real data if available)
  const ordersCount = orders.length;
  const wishlistCount = wishlist.length;
  const points = rewardPoints;

  return (
    <div className="min-h-screen bg-[#fdf8f6] flex flex-col items-center py-10 px-2">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl border-2 border-[#e0c3a0] p-8 mb-10">
        {/* Profile Card */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-8">
          <div className="flex items-center gap-8">
            <div className="relative">
              <div className="w-36 h-36 rounded-full border-4 border-yellow-200 bg-gray-200 flex items-center justify-center text-5xl text-yellow-400 font-bold overflow-hidden">
                {user.profilePic ? (
                  <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span>{user.name?.[0]}</span>
                )}
              </div>
              {/* Removed star and camera icons */}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#4a2c2a] mb-2">{user.name}</h1>
              <div className="text-lg text-yellow-700 mb-2">{user.email}</div>
              {/* Removed Royal Member button */}
            </div>
          </div>
          <button onClick={handleEdit} className="bg-yellow-400 text-white font-bold px-6 py-3 rounded-lg shadow hover:bg-yellow-500 flex items-center gap-2">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6l11-11a2.828 2.828 0 0 0-4-4L5 17v4z"/></svg>
            Edit Profile
          </button>
        </div>
        {/* Stats */}
        <div className="flex flex-col md:flex-row gap-6 justify-center mb-8">
          <div className="flex-1 bg-white/95 rounded-xl shadow p-6 border-2 border-[#e0c3a0] flex flex-col items-center">
            <span className="text-4xl font-bold text-[#4a2c2a]">{ordersCount}</span>
            <span className="text-lg text-yellow-700 mt-2">Orders</span>
          </div>
          <div className="flex-1 bg-white/95 rounded-xl shadow p-6 border-2 border-[#e0c3a0] flex flex-col items-center">
            <span className="text-4xl font-bold text-[#4a2c2a]">{wishlistCount}</span>
            <span className="text-lg text-yellow-700 mt-2">Wishlist</span>
          </div>
          <div className="flex-1 bg-white/95 rounded-xl shadow p-6 border-2 border-[#e0c3a0] flex flex-col items-center">
            <span className="text-4xl font-bold text-[#4a2c2a]">{points.toLocaleString()}</span>
            <span className="text-lg text-yellow-700 mt-2">Points</span>
          </div>
        </div>
        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-[#e0c3a0] mb-4">
            {TABS.map(tab => (
              <button
                key={tab.value}
                className={`px-6 py-3 font-bold text-lg rounded-t-lg focus:outline-none transition-all duration-200 ${activeTab === tab.value ? 'bg-yellow-400 text-white shadow' : 'bg-yellow-100 text-yellow-700'}`}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Tab Content */}
          <div className="bg-white/95 rounded-xl shadow p-6 border-2 border-[#e0c3a0]">
            {activeTab === 'personal' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold mb-1">First Name</label>
                  {editMode ? (
                    <input name="firstName" value={form.firstName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#f7c59f] bg-white/80 text-[#3e2d26] shadow-lg border-[#e0c3a0] transition-all duration-300" />
                  ) : (
                    <div className="bg-white rounded px-3 py-2">{form.firstName}</div>
                  )}
                </div>
                <div>
                  <label className="block font-semibold mb-1">Last Name</label>
                  {editMode ? (
                    <input name="lastName" value={form.lastName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#f7c59f] bg-white/80 text-[#3e2d26] shadow-lg border-[#e0c3a0] transition-all duration-300" />
                  ) : (
                    <div className="bg-white rounded px-3 py-2">{form.lastName}</div>
                  )}
                </div>
                <div>
                  <label className="block font-semibold mb-1">Email Address</label>
                  {editMode ? (
                    <input name="email" value={form.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#f7c59f] bg-white/80 text-[#3e2d26] shadow-lg border-[#e0c3a0] transition-all duration-300" />
                  ) : (
                    <div className="bg-white rounded px-3 py-2">{form.email}</div>
                  )}
                </div>
                <div>
                  <label className="block font-semibold mb-1">Phone Number</label>
                  {editMode ? (
                    <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#f7c59f] bg-white/80 text-[#3e2d26] shadow-lg border-[#e0c3a0] transition-all duration-300" />
                  ) : (
                    <div className="bg-white rounded px-3 py-2">{form.phone}</div>
                  )}
                </div>
                <div>
                  <label className="block font-semibold mb-1">Date of Birth</label>
                  {editMode ? (
                    <input name="dob" type="date" value={form.dob} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#f7c59f] bg-white/80 text-[#3e2d26] shadow-lg border-[#e0c3a0] transition-all duration-300" />
                  ) : (
                    <div className="bg-white rounded px-3 py-2">{form.dob}</div>
                  )}
                </div>
                {editMode && (
                  <div className="col-span-2 flex gap-4 mt-4">
                    <button onClick={handleSave} className="flex-1 py-3 px-6 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white hover:from-[#B8941F] hover:to-[#E6C200]">Save</button>
                    <button onClick={handleCancel} className="flex-1 py-3 px-6 rounded-xl font-bold text-lg bg-gray-200 text-[#3e2d26] hover:bg-gray-300 transition-all duration-300 shadow-lg">Cancel</button>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'addresses' && (
              <div>
                <h3 className="font-bold text-lg mb-4">Addresses</h3>
                <AddressManager userId={user._id || user.id} />
              </div>
            )}
            {activeTab === 'payments' && (
              <div>
                <h3 className="font-bold text-lg mb-4">Payment Methods</h3>
                <div className="bg-white rounded p-4 text-gray-500">(Payment method management coming soon...)</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}