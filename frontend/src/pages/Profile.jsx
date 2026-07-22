import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import AddressManager from '../components/AddressManager';
import { getUserId } from '../utils/userUtils';
import Footer from '../components/Footer';

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
    const userId = getUserId();
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
    axios.get(`/orders/my?userId=${userId}`)
      .then(res => {
        if (res.data.success) {
          setOrders(res.data.orders || []);
          // Calculate reward points: 10% of total order value
          const totalOrderValue = (res.data.orders || []).reduce((sum, order) => sum + (order.totalPrice || 0), 0);
          setRewardPoints(Math.round(totalOrderValue * 0.10));
        }
      })
      .catch(() => {});
    // Fetch wishlist
    if (userId) {
      axios.get(`/users/wishlist?id=${userId}`)
        .then(res => setWishlist(res.data || []))
        .catch(() => setWishlist([]));
    }
  }, []);

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => setEditMode(false);
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = async () => {
    const userId = getUserId();
    await axios.patch(`/users/profile?id=${userId}`, {
      name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      phone: form.phone,
      dob: form.dob,
    });
    setEditMode(false);
    // Refetch user
    axios.get(`/users/profile?id=${userId}`).then(res => {
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify({ user: res.data }));
    });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center">User not found</div>;

  // Stats (replace with real data if available)
  const ordersCount = orders.length;
  const wishlistCount = wishlist.length;
  const points = rewardPoints;

  return (
    <div className="min-h-screen bg-[#FEFCF8] flex flex-col items-center py-12 px-4">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl border border-[#E5D5B7] p-10 mb-12 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#B8860B]/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#B8860B]/5 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
        {/* Profile Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 mb-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative group">
              <div className="w-40 h-40 rounded-full border-4 border-[#B8860B]/20 bg-gradient-to-br from-[#FDF6E3] to-[#F5E6A8] flex items-center justify-center text-6xl font-bold overflow-hidden shadow-xl relative">
                {user.profilePic ? (
                  <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-[#B8860B]">{user.name?.[0]}</span>
                )}
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-[#B8860B]/10 to-transparent"></div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#B8860B] rounded-full flex items-center justify-center shadow-lg">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[#B8860B] to-[#8B6914] bg-clip-text text-transparent mb-3">{user.name}</h1>
              <div className="flex flex-wrap gap-3">
                <span className="px-6 py-2 bg-gradient-to-r from-[#B8860B] to-[#8B6914] text-white rounded-full text-sm font-semibold shadow-lg">Verified Member</span>
              </div>
            </div>
          </div>
          {!editMode && (
            <button 
              onClick={handleEdit} 
              className="px-8 py-4 rounded-2xl font-bold bg-gradient-to-r from-[#B8860B] to-[#8B6914] text-white hover:from-[#8B6914] hover:to-[#6B5010] transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </button>
          )}
        </div>
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-[#FDF6E3] via-white to-[#F5E6A8] p-8 rounded-2xl shadow-xl border border-[#B8860B]/10 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#B8860B] to-[#8B6914] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-[#B8860B] mb-1">{ordersCount}</div>
                <div className="text-sm font-semibold text-gray-600">Total Orders</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#FDF6E3] via-white to-[#F5E6A8] p-8 rounded-2xl shadow-xl border border-[#B8860B]/10 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#B8860B] to-[#8B6914] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-[#B8860B] mb-1">{wishlistCount}</div>
                <div className="text-sm font-semibold text-gray-600">Wishlist Items</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#FDF6E3] via-white to-[#F5E6A8] p-8 rounded-2xl shadow-xl border border-[#B8860B]/10 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#B8860B] to-[#8B6914] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-[#B8860B] mb-1">{points}</div>
                <div className="text-sm font-semibold text-gray-600">Reward Points</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mb-6 mt-12">
          {/* Enhanced Tabs */}
          <div className="flex flex-wrap gap-2 mb-10 p-2 bg-[#FDF6E3] rounded-2xl border border-[#B8860B]/10">
            {TABS.map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex-1 min-w-fit px-8 py-4 font-semibold text-lg rounded-xl transition-all duration-300 ${
                  activeTab === tab.value
                    ? 'bg-gradient-to-r from-[#B8860B] to-[#8B6914] text-white shadow-lg transform scale-105'
                    : 'text-[#B8860B] hover:bg-white/50 hover:shadow-md'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Enhanced Tab Content */}
          <div className="bg-gradient-to-br from-white via-[#FEFCF8] to-[#FDF6E3] rounded-3xl p-10 border border-[#B8860B]/10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#B8860B]/5 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-8 relative z-10">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-[#B8860B] to-[#8B6914] bg-clip-text text-transparent mb-2">
                  {TABS.find(tab => tab.value === activeTab)?.label}
                </h2>
                <p className="text-gray-600 font-medium">Manage your {activeTab === 'personal' ? 'personal information' : activeTab === 'addresses' ? 'delivery addresses' : 'payment methods'}</p>
              </div>
            </div>
            {activeTab === 'personal' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block font-bold text-[#B8860B] mb-3 text-lg">First Name</label>
                  {editMode ? (
                    <input 
                      name="firstName" 
                      value={form.firstName} 
                      onChange={handleChange} 
                      className="w-full px-6 py-4 rounded-2xl border-2 focus:outline-none focus:ring-4 focus:ring-[#B8860B]/20 focus:border-[#B8860B] bg-white text-gray-800 shadow-lg border-[#B8860B]/20 transition-all duration-300 text-lg font-medium" 
                      placeholder="Enter your first name"
                    />
                  ) : (
                    <div className="bg-gradient-to-r from-white to-[#FDF6E3] rounded-2xl px-6 py-4 border border-[#B8860B]/10 shadow-md text-lg font-medium text-gray-800">{form.firstName || 'Not provided'}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block font-bold text-[#B8860B] mb-3 text-lg">Last Name</label>
                  {editMode ? (
                    <input 
                      name="lastName" 
                      value={form.lastName} 
                      onChange={handleChange} 
                      className="w-full px-6 py-4 rounded-2xl border-2 focus:outline-none focus:ring-4 focus:ring-[#B8860B]/20 focus:border-[#B8860B] bg-white text-gray-800 shadow-lg border-[#B8860B]/20 transition-all duration-300 text-lg font-medium" 
                      placeholder="Enter your last name"
                    />
                  ) : (
                    <div className="bg-gradient-to-r from-white to-[#FDF6E3] rounded-2xl px-6 py-4 border border-[#B8860B]/10 shadow-md text-lg font-medium text-gray-800">{form.lastName || 'Not provided'}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block font-bold text-[#B8860B] mb-3 text-lg">Email Address</label>
                  {editMode ? (
                    <input 
                      name="email" 
                      value={form.email} 
                      onChange={handleChange} 
                      className="w-full px-6 py-4 rounded-2xl border-2 focus:outline-none focus:ring-4 focus:ring-[#B8860B]/20 focus:border-[#B8860B] bg-white text-gray-800 shadow-lg border-[#B8860B]/20 transition-all duration-300 text-lg font-medium" 
                      placeholder="Enter your email address"
                    />
                  ) : (
                    <div className="bg-gradient-to-r from-white to-[#FDF6E3] rounded-2xl px-6 py-4 border border-[#B8860B]/10 shadow-md text-lg font-medium text-gray-800">{form.email || 'Not provided'}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block font-bold text-[#B8860B] mb-3 text-lg">Phone Number</label>
                  {editMode ? (
                    <input 
                      name="phone" 
                      value={form.phone} 
                      onChange={handleChange} 
                      className="w-full px-6 py-4 rounded-2xl border-2 focus:outline-none focus:ring-4 focus:ring-[#B8860B]/20 focus:border-[#B8860B] bg-white text-gray-800 shadow-lg border-[#B8860B]/20 transition-all duration-300 text-lg font-medium" 
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="bg-gradient-to-r from-white to-[#FDF6E3] rounded-2xl px-6 py-4 border border-[#B8860B]/10 shadow-md text-lg font-medium text-gray-800">{form.phone || 'Not provided'}</div>
                  )}
                </div>
                <div className="space-y-2 lg:col-span-2">
                  <label className="block font-bold text-[#B8860B] mb-3 text-lg">Date of Birth</label>
                  {editMode ? (
                    <input 
                      name="dob" 
                      type="date" 
                      value={form.dob} 
                      onChange={handleChange} 
                      className="w-full px-6 py-4 rounded-2xl border-2 focus:outline-none focus:ring-4 focus:ring-[#B8860B]/20 focus:border-[#B8860B] bg-white text-gray-800 shadow-lg border-[#B8860B]/20 transition-all duration-300 text-lg font-medium" 
                    />
                  ) : (
                    <div className="bg-gradient-to-r from-white to-[#FDF6E3] rounded-2xl px-6 py-4 border border-[#B8860B]/10 shadow-md text-lg font-medium text-gray-800">{form.dob || 'Not provided'}</div>
                  )}
                </div>
                {editMode && (
                  <div className="lg:col-span-2 flex flex-col md:flex-row gap-4 mt-8">
                    <button 
                      onClick={handleSave} 
                      className="flex-1 py-4 px-8 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 bg-gradient-to-r from-[#B8860B] to-[#8B6914] text-white hover:from-[#8B6914] hover:to-[#6B5010] transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes
                    </button>
                    <button 
                      onClick={handleCancel} 
                      className="flex-1 py-4 px-8 rounded-2xl font-bold text-lg bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#B8860B] to-[#8B6914] rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-2xl text-[#B8860B]">Delivery Addresses</h3>
                </div>
                <div className="bg-gradient-to-br from-[#FDF6E3] to-white rounded-2xl p-6 border border-[#B8860B]/10">
                  <AddressManager userId={user._id || user.id} />
                </div>
              </div>
            )}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#B8860B] to-[#8B6914] rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-2xl text-[#B8860B]">Payment Methods</h3>
                </div>
                <div className="bg-gradient-to-br from-[#FDF6E3] to-white rounded-2xl p-8 border border-[#B8860B]/10 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#B8860B]/10 to-[#B8860B]/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[#B8860B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-[#B8860B] mb-2">Coming Soon</h4>
                  <p className="text-gray-600 font-medium">Payment method management will be available in the next update</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}