import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Save, X, Palette, Upload, FileSpreadsheet, Download } from 'lucide-react';
import axios from 'axios';

const SeasonalPage = () => {
  const [seasonalPages, setSeasonalPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [selectedExcelFile, setSelectedExcelFile] = useState(null);
  const [uploadingProducts, setUploadingProducts] = useState(false);
  const [bulkUploadResults, setBulkUploadResults] = useState(null);
  const [selectedCategoryPage, setSelectedCategoryPage] = useState('seasonal');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    description: '',
    colors: {
      primary: '#dc2626',
      secondary: '#ec4899',
      background: 'from-red-50 via-pink-50 to-red-100',
      text: '#7f1d1d'
    },
    productFilter: {
      category: '',
      isSpecial: '',
      tags: []
    },
    isActive: false
  });

  const colorPresets = [
    {
      name: 'Raksha Bandhan',
      colors: {
        primary: '#dc2626',
        secondary: '#ec4899',
        background: 'from-red-50 via-pink-50 to-red-100',
        text: '#7f1d1d'
      }
    },
    {
      name: 'Diwali',
      colors: {
        primary: '#f59e0b',
        secondary: '#d97706',
        background: 'from-yellow-50 via-orange-50 to-yellow-100',
        text: '#92400e'
      }
    },
    {
      name: 'Black Friday',
      colors: {
        primary: '#000000',
        secondary: '#374151',
        background: 'from-gray-900 via-gray-800 to-black',
        text: '#ffffff'
      }
    },
    {
      name: 'Independence Day',
      colors: {
        primary: '#dc2626',
        secondary: '#1d4ed8',
        background: 'from-red-50 via-white to-blue-50',
        text: '#1f2937'
      }
    },
    {
      name: 'Christmas',
      colors: {
        primary: '#dc2626',
        secondary: '#16a34a',
        background: 'from-red-50 via-green-50 to-red-100',
        text: '#7f1d1d'
      }
    },
    {
      name: 'New Year',
      colors: {
        primary: '#fbbf24',
        secondary: '#a855f7',
        background: 'from-yellow-50 via-purple-50 to-yellow-100',
        text: '#92400e'
      }
    },
    {
      name: 'Valentine\'s Day',
      colors: {
        primary: '#ec4899',
        secondary: '#dc2626',
        background: 'from-pink-50 via-rose-50 to-pink-100',
        text: '#be185d'
      }
    },
    {
      name: 'Mother\'s Day',
      colors: {
        primary: '#ec4899',
        secondary: '#a855f7',
        background: 'from-pink-50 via-purple-50 to-pink-100',
        text: '#be185d'
      }
    },
    {
      name: 'Summer Sale',
      colors: {
        primary: '#f59e0b',
        secondary: '#06b6d4',
        background: 'from-yellow-50 via-cyan-50 to-yellow-100',
        text: '#0c4a6e'
      }
    },
    {
      name: 'Winter Collection',
      colors: {
        primary: '#1d4ed8',
        secondary: '#6366f1',
        background: 'from-blue-50 via-indigo-50 to-blue-100',
        text: '#1e3a8a'
      }
    }
  ];

  useEffect(() => {
    fetchSeasonalPages();
  }, []);

  const fetchSeasonalPages = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      console.log('Fetching seasonal pages with token:', token ? 'Token exists' : 'No token');
      
      const response = await axios.get('http://localhost:5000/api/seasonal-page', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('API Response:', response.data);
      
      // Handle both direct array and nested data structure
      const pages = response.data.data || response.data;
      setSeasonalPages(Array.isArray(pages) ? pages : []);
    } catch (error) {
      console.error('Error fetching seasonal pages:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };


  // Bulk upload functions
  const downloadTemplate = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bulk-upload/template', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'seasonal-products-template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading template:', error);
      alert('Failed to download template');
    }
  };

  const handleExcelFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedExcelFile(file);
    }
  };

  const handleBulkUpload = async () => {
    if (!selectedExcelFile) {
      alert('Please select an Excel file');
      return;
    }

    setUploadingProducts(true);
    setBulkUploadResults(null);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('excelFile', selectedExcelFile);
      formDataUpload.append('categoryPage', selectedCategoryPage);

      const response = await axios.post('http://localhost:5000/api/bulk-upload/products', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setBulkUploadResults(response.data);
      setSelectedExcelFile(null);
      
    } catch (error) {
      console.error('Bulk upload error:', error);
      
      if (error.response?.data?.missingHeaders) {
        const errorData = error.response.data;
        alert(`Missing Required Column Headers!\n\nMissing: ${errorData.missingHeaders.join(', ')}\n\nRequired columns: ${errorData.requiredHeaders.join(', ')}\n\nPlease download the template and ensure all required columns are present.`);
      } else {
        alert('Failed to upload products: ' + (error.response?.data?.error || error.message));
      }
    } finally {
      setUploadingProducts(false);
    }
  };

  const resetBulkUpload = () => {
    setSelectedExcelFile(null);
    setBulkUploadResults(null);
    setSelectedCategoryPage('seasonal');
    setShowBulkUpload(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      
      if (editingPage) {
        await axios.put(`http://localhost:5000/api/seasonal-page/${editingPage._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/seasonal-page', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      fetchSeasonalPages();
      resetForm();
    } catch (error) {
      console.error('Error saving seasonal page:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this seasonal page?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`http://localhost:5000/api/seasonal-page/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchSeasonalPages();
      } catch (error) {
        console.error('Error deleting seasonal page:', error);
      }
    }
  };

  const handleActivate = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(`http://localhost:5000/api/seasonal-page/${id}/activate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSeasonalPages();
    } catch (error) {
      console.error('Error activating seasonal page:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      subtitle: '',
      description: '',
      colors: {
        primary: '#dc2626',
        secondary: '#ec4899',
        background: 'from-red-50 via-pink-50 to-red-100',
        text: '#7f1d1d'
      },
      productFilter: {
        category: '',
        isSpecial: '',
        tags: []
      },
      isActive: false
    });
    setEditingPage(null);
    setShowModal(false);
  };

  const handleEdit = (page) => {
    setEditingPage(page);
    setFormData(page);
    setShowModal(true);
  };

  const applyColorPreset = (preset) => {
    setFormData(prev => ({
      ...prev,
      colors: preset.colors
    }));
  };

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        <p className="ml-4 text-gray-600">Loading seasonal pages...</p>
      </div>
    );
  }

  console.log('Rendering SeasonalPage component, pages count:', seasonalPages.length);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Seasonal Pages</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700"
        >
          <Plus size={20} />
          Create Seasonal Page
        </button>
      </div>

      {/* Seasonal Pages List */}
      <div className="grid gap-6">
        {seasonalPages.map((page) => (
          <div key={page._id} className="bg-white rounded-lg shadow-md p-6 border">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">{page.title}</h3>
                  {page.isActive && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-2">{page.subtitle}</p>
                <p className="text-sm text-gray-500">Slug: /{page.slug}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowBulkUpload(showBulkUpload === page._id ? null : page._id)}
                  className="text-purple-600 hover:text-purple-800 p-2 rounded hover:bg-purple-50"
                  title="Bulk Upload Products"
                >
                  <FileSpreadsheet size={20} />
                </button>
                <button
                  onClick={() => handleActivate(page._id)}
                  className={`p-2 rounded ${page.isActive ? 'text-green-600' : 'text-gray-400 hover:text-green-600'}`}
                  title={page.isActive ? 'Active' : 'Activate'}
                >
                  {page.isActive ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
                <button
                  onClick={() => handleEdit(page)}
                  className="text-blue-600 hover:text-blue-800 p-2 rounded"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(page._id)}
                  className="text-red-600 hover:text-red-800 p-2 rounded"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            {/* Color Preview */}
            <div className="flex items-center gap-4 mb-3">
              <span className="text-sm text-gray-600">Colors:</span>
              <div className="flex gap-2">
                <div 
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: page.colors.primary }}
                  title="Primary Color"
                />
                <div 
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: page.colors.secondary }}
                  title="Secondary Color"
                />
                <div 
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: page.colors.text }}
                  title="Text Color"
                />
              </div>
            </div>


            <div className="text-sm text-gray-600 mt-3">
              {page.productFilter.category && (
                <p><strong>Category:</strong> {page.productFilter.category}</p>
              )}
            </div>

            {/* Bulk Upload Section */}
            {showBulkUpload === page._id && (
              <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <FileSpreadsheet className="text-purple-600" size={20} />
                  <h4 className="font-semibold text-purple-800">Bulk Upload Products for {page.title}</h4>
                </div>
                
                <div className="space-y-3">
                  {/* Template Download */}
                  <div className="flex items-center justify-between p-3 bg-white border border-purple-200 rounded">
                    <div>
                      <p className="font-medium text-gray-800">Download Excel Template</p>
                      <p className="text-sm text-gray-600">Get the properly formatted template with sample data</p>
                    </div>
                    <button
                      onClick={downloadTemplate}
                      className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
                    >
                      <Download size={16} />
                      Download
                    </button>
                  </div>

                  {/* Category Page Selection */}
                  <div className="p-3 bg-white border border-purple-200 rounded">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Page
                    </label>
                    <select
                      value={selectedCategoryPage}
                      onChange={(e) => setSelectedCategoryPage(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="seasonal">Seasonal (All seasonal pages)</option>
                      <option value="rings">Rings</option>
                      <option value="necklaces">Necklaces</option>
                      <option value="earrings">Earrings</option>
                      <option value="bracelets">Bracelets</option>
                      <option value="bridal">Bridal Collection</option>
                      <option value="birthday-gifts">Birthday Gifts</option>
                      <option value="zodiac-jewelry">Zodiac Jewelry</option>
                      <option value="anniversary-gifts">Anniversary Gifts</option>
                      <option value="festive-gifts">Festive Gifts</option>
                      <option value="personalized-gifts">Personalized Gifts</option>
                      <option value="raksha-bandhan">Raksha Bandhan</option>
                      <option value="shop">General Shop</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Choose "Seasonal" to make products appear on all seasonal pages
                    </p>
                  </div>

                  {/* File Upload */}
                  <div className="p-3 bg-white border border-purple-200 rounded">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Excel File
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleExcelFileSelect}
                        className="flex-1 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                      />
                      {selectedExcelFile && (
                        <span className="text-sm text-green-600">✓ {selectedExcelFile.name}</span>
                      )}
                    </div>
                  </div>

                  {/* Upload Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBulkUpload()}
                      disabled={!selectedExcelFile || uploadingProducts}
                      className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {uploadingProducts ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          Upload Products
                        </>
                      )}
                    </button>
                    <button
                      onClick={resetBulkUpload}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Upload Results */}
                  {bulkUploadResults && (
                    <div className="mt-3 p-3 bg-white border border-purple-200 rounded">
                      <h5 className="font-medium text-gray-800 mb-2">Upload Results</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div className="bg-blue-50 p-2 rounded text-center">
                          <div className="font-semibold text-blue-600">{bulkUploadResults.summary.total}</div>
                          <div className="text-blue-800">Total</div>
                        </div>
                        <div className="bg-green-50 p-2 rounded text-center">
                          <div className="font-semibold text-green-600">{bulkUploadResults.summary.successful}</div>
                          <div className="text-green-800">Success</div>
                        </div>
                        <div className="bg-red-50 p-2 rounded text-center">
                          <div className="font-semibold text-red-600">{bulkUploadResults.summary.failed}</div>
                          <div className="text-red-800">Failed</div>
                        </div>
                        <div className="bg-yellow-50 p-2 rounded text-center">
                          <div className="font-semibold text-yellow-600">{bulkUploadResults.summary.duplicates}</div>
                          <div className="text-yellow-800">Duplicates</div>
                        </div>
                      </div>
                      
                      {bulkUploadResults.summary.successful > 0 && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                          ✅ Successfully uploaded {bulkUploadResults.summary.successful} products to {page.title} page!
                        </div>
                      )}
                      
                      {(bulkUploadResults.results.failed.length > 0 || bulkUploadResults.results.duplicates.length > 0) && (
                        <div className="mt-2 text-xs text-gray-600">
                          <details>
                            <summary className="cursor-pointer hover:text-gray-800">View Error Details</summary>
                            <div className="mt-1 max-h-32 overflow-y-auto">
                              {bulkUploadResults.results.failed.map((item, index) => (
                                <div key={index} className="text-red-600">
                                  Row {item.row}: {item.error}
                                </div>
                              ))}
                              {bulkUploadResults.results.duplicates.map((item, index) => (
                                <div key={index} className="text-yellow-600">
                                  Row {item.row}: {item.error}
                                </div>
                              ))}
                            </div>
                          </details>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="text-xs text-purple-700 bg-purple-100 p-2 rounded">
                    <strong>Note:</strong> Products uploaded here will be specifically assigned to the "{page.title}" seasonal page and will appear at /seasonal/{page.slug}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {seasonalPages.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No seasonal pages created yet.</p>
            <p>Create your first seasonal page to get started!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingPage ? 'Edit Seasonal Page' : 'Create Seasonal Page'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={handleTitleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug *
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle *
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>


                {/* Color Customization */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Palette size={20} className="text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Color Customization</h3>
                  </div>

                  {/* Color Presets */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color Presets
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {colorPresets.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => applyColorPreset(preset)}
                          className="p-3 border border-gray-300 rounded-lg hover:border-purple-500 text-sm"
                        >
                          <div className="flex gap-1 mb-1">
                            <div 
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: preset.colors.primary }}
                            />
                            <div 
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: preset.colors.secondary }}
                            />
                          </div>
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Colors */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={formData.colors.primary}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            colors: { ...prev.colors, primary: e.target.value }
                          }))}
                          className="w-12 h-10 border border-gray-300 rounded"
                        />
                        <input
                          type="text"
                          value={formData.colors.primary}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            colors: { ...prev.colors, primary: e.target.value }
                          }))}
                          className="flex-1 p-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secondary Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={formData.colors.secondary}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            colors: { ...prev.colors, secondary: e.target.value }
                          }))}
                          className="w-12 h-10 border border-gray-300 rounded"
                        />
                        <input
                          type="text"
                          value={formData.colors.secondary}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            colors: { ...prev.colors, secondary: e.target.value }
                          }))}
                          className="flex-1 p-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Text Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={formData.colors.text}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            colors: { ...prev.colors, text: e.target.value }
                          }))}
                          className="w-12 h-10 border border-gray-300 rounded"
                        />
                        <input
                          type="text"
                          value={formData.colors.text}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            colors: { ...prev.colors, text: e.target.value }
                          }))}
                          className="flex-1 p-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Background Gradient
                      </label>
                      <input
                        type="text"
                        value={formData.colors.background}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          colors: { ...prev.colors, background: e.target.value }
                        }))}
                        placeholder="from-red-50 via-pink-50 to-red-100"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Product Filter */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Filter</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.productFilter.category}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          productFilter: { ...prev.productFilter, category: e.target.value }
                        }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">All Categories</option>
                        <option value="rings">Rings</option>
                        <option value="necklaces">Necklaces</option>
                        <option value="earrings">Earrings</option>
                        <option value="bracelets">Bracelets</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Filter
                      </label>
                      <input
                        type="text"
                        value={formData.productFilter.isSpecial}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          productFilter: { ...prev.productFilter, isSpecial: e.target.value }
                        }))}
                        placeholder="e.g., isRakhi, isDiwali"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Set as active seasonal page
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                  >
                    <Save size={20} />
                    {editingPage ? 'Update Page' : 'Create Page'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeasonalPage;
