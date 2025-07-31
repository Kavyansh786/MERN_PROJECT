import React, { useState, useEffect } from 'react';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import api from '../api/axios';

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    maxUsage: '',
    expiryDate: '',
    isActive: true
  });

  useEffect(() => {
    fetchCoupons();
  }, []);



  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await api.get('/coupons');
      setCoupons(response.data);
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoupon = async () => {
    try {
      await api.post('/coupons', formData);
      setShowAddModal(false);
      setFormData({ code: '', discount: '', maxUsage: '', expiryDate: '', isActive: true });
      fetchCoupons();
    } catch (error) {
      console.error('Failed to add coupon:', error);
      alert(error.response?.data?.message || 'Failed to add coupon');
    }
  };

  const handleEditCoupon = async () => {
    try {
      await api.patch(`/coupons/${editingCoupon._id}`, formData);
      setEditingCoupon(null);
      setFormData({ code: '', discount: '', maxUsage: '', expiryDate: '', isActive: true });
      fetchCoupons();
    } catch (error) {
      console.error('Failed to update coupon:', error);
      alert(error.response?.data?.message || 'Failed to update coupon');
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await api.delete(`/coupons/${couponId}`);
        fetchCoupons();
      } catch (error) {
        console.error('Failed to delete coupon:', error);
        alert(error.response?.data?.message || 'Failed to delete coupon');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discount: coupon.discount,
      maxUsage: coupon.maxUsage,
      expiryDate: coupon.expiryDate.split('T')[0],
      isActive: coupon.isActive
    });
  };

  const getStatusBadge = (coupon) => {
    const isExpired = new Date(coupon.expiryDate) < new Date();
    const isMaxedOut = coupon.usage >= coupon.maxUsage;
    
    if (isExpired || isMaxedOut || !coupon.isActive) {
      return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs whitespace-nowrap">Expired</span>;
    }
    return <span className="bg-black text-white px-2 py-1 rounded-full text-xs whitespace-nowrap">Active</span>;
  };

  const getUsagePercentage = (usage, maxUsage) => {
    return Math.min((usage / maxUsage) * 100, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading coupons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Coupons</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Coupon
          </button>
        </div>

        {/* Coupons Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left font-semibold text-gray-900">Code</th>
                  <th className="p-4 text-left font-semibold text-gray-900">Discount</th>
                  <th className="p-4 text-left font-semibold text-gray-900">Usage</th>
                  <th className="p-4 text-left font-semibold text-gray-900">Expiry</th>
                  <th className="p-4 text-left font-semibold text-gray-900">Status</th>
                  <th className="p-4 text-left font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{coupon.code}</div>
                    </td>
                    <td className="p-4 text-gray-900">{coupon.discount}%</td>
                    <td className="p-4">
                      <div className="space-y-2">
                        <div className="text-sm text-gray-900">
                          {coupon.usage}/{coupon.maxUsage}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-black h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getUsagePercentage(coupon.usage, coupon.maxUsage)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-900">
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(coupon)}
                    </td>
                    <td className="p-4 relative">
                      <button
                        className="p-2 rounded hover:bg-gray-100"
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setDropdownPosition({
                            top: rect.bottom + window.scrollY,
                            left: rect.right - 160 // 160px is dropdown width
                          });
                          setOpenDropdown(openDropdown === coupon._id ? null : coupon._id);
                        }}
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dropdown Menu - Positioned outside table */}
        {openDropdown && (
          <div 
            className="fixed w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-[9999]"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left
            }}
          >
            <button 
              className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50" 
              onClick={() => {
                const coupon = coupons.find(c => c._id === openDropdown);
                if (coupon) {
                  openEditModal(coupon);
                  setOpenDropdown(null);
                }
              }}
            >
              <Edit className="w-4 h-4 mr-2" /> Edit Coupon
            </button>
            <button 
              className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50" 
              onClick={() => {
                handleDeleteCoupon(openDropdown);
                setOpenDropdown(null);
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete Coupon
            </button>
          </div>
        )}

        {/* Add/Edit Coupon Modal */}
        {(showAddModal || editingCoupon) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">
                {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="SAVE20"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="100"
                    placeholder="20"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Usage
                  </label>
                  <input
                    type="number"
                    name="maxUsage"
                    value={formData.maxUsage}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    placeholder="100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={editingCoupon ? handleEditCoupon : handleAddCoupon}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingCoupon ? 'Update' : 'Add'}
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCoupon(null);
                    setFormData({ code: '', discount: '', maxUsage: '', expiryDate: '', isActive: true });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 