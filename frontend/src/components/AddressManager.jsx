import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddressManager({ userId, className = '' }) {
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    pincode: '',
    state: '',
    city: '',
    houseNo: '',
    area: '',
    addressType: 'Home',
    isDefault: false
  });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  useEffect(() => {
    if (!userId) return;
    fetchAddresses();
  }, [userId]);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(`/address/${userId}`);
      setSavedAddresses(response.data.addresses || []);
    } catch (error) {
      // Optionally handle error
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    else if (formData.fullName.trim().length < 3) newErrors.fullName = 'Full name must be at least 3 characters';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(formData.phone)) newErrors.phone = 'Please enter a valid 10-digit Indian phone number';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Please enter a valid 6-digit pincode';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.houseNo.trim()) newErrors.houseNo = 'House No. / Building Name is required';
    if (!formData.area.trim()) newErrors.area = 'Road name / Area / Colony is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const addressData = {
        userId,
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim().toLowerCase(),
        street: `${formData.houseNo.trim()}, ${formData.area.trim()}`,
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        landmark: formData.addressType,
        isDefault: formData.isDefault
      };
      if (isEditing) {
        await axios.put(`/address/${editingId}`, addressData);
      } else {
        await axios.post('/address', addressData);
      }
      setFormData({
        fullName: '', phone: '', email: '', pincode: '', state: '', city: '', houseNo: '', area: '', addressType: 'Home', isDefault: false
      });
      setIsEditing(false);
      setEditingId(null);
      setShowForm(false);
      fetchAddresses();
    } catch (error) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  };

  const handleEditAddress = (address) => {
    setFormData({
      fullName: address.fullName,
      phone: address.phone,
      email: address.email,
      pincode: address.pincode,
      state: address.state,
      city: address.city,
      houseNo: address.street.split(',')[0] || '',
      area: address.street.split(',')[1] || '',
      addressType: address.landmark || 'Home',
      isDefault: address.isDefault || false
    });
    setIsEditing(true);
    setEditingId(address._id);
    setShowForm(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await axios.delete(`/address/${addressId}`);
      fetchAddresses();
    } catch (error) {
      // Optionally handle error
    }
  };

  const isFormValid = () => {
    return formData.fullName && formData.phone && formData.email && 
           formData.pincode && formData.state && formData.city && 
           formData.houseNo && formData.area && Object.keys(errors).length === 0;
  };

  return (
    <div className={className}>
      {/* Saved Addresses */}
      {savedAddresses.length > 0 && (
        <div className="bg-white/95 rounded-2xl shadow-2xl p-6 border-2 border-[#e0c3a0] mb-6">
          <h3 className="text-2xl font-bold text-[#a67c52] mb-4">Saved Addresses</h3>
          <div className="space-y-4">
            {savedAddresses.map((address) => (
              <div
                key={address._id}
                className="p-4 rounded-xl border-2 border-[#e0c3a0] bg-white hover:border-[#a67c52] hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-[#3e2d26]">{address.fullName}</span>
                      {address.isDefault && (
                        <span className="px-2 py-1 bg-[#a67c52] text-white text-xs rounded-full">Default</span>
                      )}
                    </div>
                    <p className="text-[#3e2d26] mb-1">{address.phone}</p>
                    <p className="text-[#3e2d26] mb-1">{address.email}</p>
                    <p className="text-[#3e2d26] mb-1">{address.street}</p>
                    <p className="text-[#3e2d26]">{address.city}, {address.state} - {address.pincode}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEditAddress(address)}
                      className="p-2 text-[#a67c52] hover:bg-[#f7e1c7] rounded-lg transition-colors"
                      title="Edit address"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete address"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Add New Address Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-4 bg-gradient-to-r from-[#a67c52] to-[#f7c59f] text-white text-xl font-bold rounded-xl shadow-lg hover:from-[#8d6a43] hover:to-[#e0c3a0] transition-all duration-300 tracking-wide mb-6"
        >
          + Add New Address
        </button>
      )}
      {/* Address Form */}
      {showForm && (
        <div className="bg-white/95 rounded-2xl shadow-2xl p-6 border-2 border-[#e0c3a0] mb-6">
          <h3 className="text-2xl font-bold text-[#a67c52] mb-6">
            {isEditing ? 'Edit Address' : 'Add New Address'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-[#3e2d26] font-semibold mb-2">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#f7c59f] bg-[#fdf6ee] text-[#3e2d26] shadow transition-all ${
                  errors.fullName ? 'border-red-500' : 'border-[#e0c3a0]'
                }`}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>
            {/* Phone Number */}
            <div>
              <label className="block text-[#3e2d26] font-semibold mb-2">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#f7c59f] bg-[#fdf6ee] text-[#3e2d26] shadow transition-all ${
                  errors.phone ? 'border-red-500' : 'border-[#e0c3a0]'
                }`}
                placeholder="Enter 10-digit phone number"
                maxLength="10"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
            {/* Email */}
            <div>
              <label className="block text-[#3e2d26] font-semibold mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#f7c59f] bg-[#fdf6ee] text-[#3e2d26] shadow transition-all ${
                  errors.email ? 'border-red-500' : 'border-[#e0c3a0]'
                }`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            {/* Pincode */}
            <div>
              <label className="block text-[#3e2d26] font-semibold mb-2">Pincode *</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#f7c59f] bg-[#fdf6ee] text-[#3e2d26] shadow transition-all ${
                  errors.pincode ? 'border-red-500' : 'border-[#e0c3a0]'
                }`}
                placeholder="Enter 6-digit pincode"
                maxLength="6"
              />
              {errors.pincode && (
                <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
              )}
            </div>
            {/* State */}
            <div>
              <label className="block text-[#3e2d26] font-semibold mb-2">State *</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#f7c59f] bg-[#fdf6ee] text-[#3e2d26] shadow transition-all ${
                  errors.state ? 'border-red-500' : 'border-[#e0c3a0]'
                }`}
              >
                <option value="">Select State</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">{errors.state}</p>
              )}
            </div>
            {/* City */}
            <div>
              <label className="block text-[#3e2d26] font-semibold mb-2">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#f7c59f] bg-[#fdf6ee] text-[#3e2d26] shadow transition-all ${
                  errors.city ? 'border-red-500' : 'border-[#e0c3a0]'
                }`}
                placeholder="Enter city name"
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>
            {/* House No / Building Name */}
            <div>
              <label className="block text-[#3e2d26] font-semibold mb-2">House No. / Building Name *</label>
              <input
                type="text"
                name="houseNo"
                value={formData.houseNo}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#f7c59f] bg-[#fdf6ee] text-[#3e2d26] shadow transition-all ${
                  errors.houseNo ? 'border-red-500' : 'border-[#e0c3a0]'
                }`}
                placeholder="Enter house number or building name"
              />
              {errors.houseNo && (
                <p className="text-red-500 text-sm mt-1">{errors.houseNo}</p>
              )}
            </div>
            {/* Area / Colony */}
            <div>
              <label className="block text-[#3e2d26] font-semibold mb-2">Road name / Area / Colony *</label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#f7c59f] bg-[#fdf6ee] text-[#3e2d26] shadow transition-all ${
                  errors.area ? 'border-red-500' : 'border-[#e0c3a0]'
                }`}
                placeholder="Enter road name, area, or colony"
              />
              {errors.area && (
                <p className="text-red-500 text-sm mt-1">{errors.area}</p>
              )}
            </div>
            {/* Address Type */}
            <div>
              <label className="block text-[#3e2d26] font-semibold mb-2">Address Type</label>
              <select
                name="addressType"
                value={formData.addressType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-[#e0c3a0] focus:outline-none focus:ring-2 focus:ring-[#f7c59f] bg-[#fdf6ee] text-[#3e2d26] shadow transition-all"
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          {/* Default Address Checkbox */}
          <div className="mt-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleInputChange}
                className="w-5 h-5 text-[#a67c52] focus:ring-[#a67c52] rounded"
              />
              <span className="text-[#3e2d26] font-semibold">Make this my default address</span>
            </label>
          </div>
          {/* Form Actions */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleSaveAddress}
              disabled={!isFormValid() || loading}
              className={`flex-1 py-3 px-6 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 ${
                isFormValid() && !loading
                  ? 'bg-gradient-to-r from-[#a67c52] to-[#f7c59f] text-white hover:from-[#8d6a43] hover:to-[#e0c3a0]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? 'Saving...' : isEditing ? 'Update Address' : 'Save Address'}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setIsEditing(false);
                setEditingId(null);
                setFormData({
                  fullName: '', phone: '', email: '', pincode: '', state: '', city: '', houseNo: '', area: '', addressType: 'Home', isDefault: false
                });
                setErrors({});
              }}
              className="flex-1 py-3 px-6 rounded-xl font-bold text-lg bg-gray-200 text-[#3e2d26] hover:bg-gray-300 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 
