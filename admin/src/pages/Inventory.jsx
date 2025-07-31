import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({ currentStock: 0, reserved: 0 });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const [inventoryRes, lowStockRes] = await Promise.all([
        api.get('/inventory'),
        api.get('/inventory/low-stock')
      ]);
      
      setInventory(inventoryRes.data);
      setLowStockCount(lowStockRes.data.length);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditStock = (product) => {
    setEditingProduct(product);
    setEditForm({
      currentStock: product.currentStock,
      reserved: product.reserved
    });
  };

  const handleUpdateStock = async () => {
    try {
      await api.patch(`/inventory/${editingProduct._id}`, editForm);
      alert('Stock updated successfully');
      setEditingProduct(null);
      fetchInventory(); // Refresh data
    } catch (error) {
      console.error('Failed to update stock:', error);
      alert(error.response?.data?.message || 'Failed to update stock');
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditForm({ currentStock: 0, reserved: 0 });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };

  const handleExportInventory = () => {
    // Create CSV content
    const csvContent = [
      // CSV Header
      ['Product Name', 'SKU', 'Category', 'Current Stock', 'Reserved', 'Available', 'Status'],
      // CSV Data
      ...inventory.map(product => [
        product.name,
        product.sku,
        product.category,
        product.currentStock,
        product.reserved,
        product.available,
        product.available <= 0 ? 'Out of Stock' : product.available < 10 ? 'Low Stock' : 'In Stock'
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (available) => {
    if (available <= 0) {
      return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs whitespace-nowrap">Out of Stock</span>;
    } else if (available < 10) {
      return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs whitespace-nowrap">Low Stock</span>;
    } else {
      return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs whitespace-nowrap">In Stock</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
          <div className="flex gap-3">
            <button 
              onClick={handleExportInventory}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </button>
          </div>
        </div>



        {/* Alert */}
        {lowStockCount > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
              <span className="text-orange-800 font-medium">
                {lowStockCount} products are running low on stock
              </span>
            </div>
          </div>
        )}

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left font-semibold text-gray-900">Product</th>
                  <th className="p-4 text-left font-semibold text-gray-900">SKU</th>
                  <th className="p-4 text-left font-semibold text-gray-900">Current Stock</th>
                  <th className="p-4 text-left font-semibold text-gray-900">Reserved</th>
                  <th className="p-4 text-left font-semibold text-gray-900">Available</th>
                  <th className="p-4 text-left font-semibold text-gray-900">Status</th>
                  <th className="p-4 text-left font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {inventory.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-gray-600 font-semibold">
                            {product.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-900">{product.sku}</td>
                    <td className="p-4 text-gray-900">{product.currentStock}</td>
                    <td className="p-4 text-gray-900">{product.reserved}</td>
                    <td className="p-4 text-gray-900">{product.available}</td>
                    <td className="p-4">{getStatusBadge(product.available)}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleEditStock(product)}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                      >
                        Update Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Stock Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Update Stock - {editingProduct.name}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Stock
                  </label>
                  <input
                    type="number"
                    name="currentStock"
                    value={editForm.currentStock}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reserved
                  </label>
                  <input
                    type="number"
                    name="reserved"
                    value={editForm.reserved}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max={editForm.currentStock}
                  />
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">
                    Available: <span className="font-semibold">{Math.max(editForm.currentStock - editForm.reserved, 0)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleUpdateStock}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update
                </button>
                <button
                  onClick={handleCancelEdit}
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