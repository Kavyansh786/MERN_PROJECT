import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Upload, Download, TestTube, BarChart3 } from 'lucide-react';
import axios from 'axios';

const ChatbotTraining = () => {
  const [trainingData, setTrainingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState(null);
  const [testQuery, setTestQuery] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [bulkImportData, setBulkImportData] = useState('');
  const [importResults, setImportResults] = useState(null);

  const categories = [
    'products', 'orders', 'shipping', 'returns', 'pricing', 
    'materials', 'customization', 'care_instructions', 'general', 'greetings', 'support'
  ];

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    keywords: [],
    category: 'general',
    priority: 1,
    confidenceThreshold: 0.7,
    context: '',
    followUpSuggestions: [],
    isActive: true
  });

  useEffect(() => {
    fetchTrainingData();
    fetchStats();
  }, []);

  const fetchTrainingData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('/api/chatbot-training', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: searchTerm,
          category: selectedCategory,
          limit: 50
        }
      });
      setTrainingData(response.data.data);
    } catch (error) {
      console.error('Error fetching training data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('/api/chatbot-training/stats/overview', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const url = editingItem 
        ? `/api/chatbot-training/${editingItem._id}`
        : '/api/chatbot-training';
      
      const method = editingItem ? 'put' : 'post';
      
      await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowModal(false);
      setEditingItem(null);
      resetForm();
      fetchTrainingData();
      fetchStats();
    } catch (error) {
      console.error('Error saving training data:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this training data?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`/api/chatbot-training/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTrainingData();
      fetchStats();
    } catch (error) {
      console.error('Error deleting training data:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      question: item.question,
      answer: item.answer,
      keywords: item.keywords,
      category: item.category,
      priority: item.priority,
      confidenceThreshold: item.confidenceThreshold,
      context: item.context || '',
      followUpSuggestions: item.followUpSuggestions,
      isActive: item.isActive
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      keywords: [],
      category: 'general',
      priority: 1,
      confidenceThreshold: 0.7,
      context: '',
      followUpSuggestions: [],
      isActive: true
    });
  };

  const handleTestQuery = async () => {
    if (!testQuery.trim()) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post('/api/chatbot-training/test-match', 
        { query: testQuery },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTestResults(response.data.matches);
    } catch (error) {
      console.error('Error testing query:', error);
    }
  };

  const handleBulkImport = async () => {
    if (!bulkImportData.trim()) return;
    
    try {
      const data = JSON.parse(bulkImportData);
      if (!Array.isArray(data)) {
        throw new Error('Data must be an array');
      }
      
      const token = localStorage.getItem('adminToken');
      const response = await axios.post('/api/chatbot-training/bulk-import', 
        { trainingData: data },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setImportResults({
        success: true,
        message: response.data.message,
        imported: data.length,
        skipped: 0
      });
      
      fetchTrainingData();
      fetchStats();
      
    } catch (error) {
      console.error('Error importing data:', error);
      setImportResults({
        success: false,
        message: error.response?.data?.error || error.message || 'Import failed',
        errors: [error.message]
      });
    }
  };

  const handleClearAllData = async () => {
    if (!window.confirm('Are you sure you want to delete ALL training data? This action cannot be undone.')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.delete('/api/chatbot-training/clear-all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setImportResults({
        success: true,
        message: response.data.message,
        imported: 0,
        skipped: 0
      });
      
      fetchTrainingData();
      fetchStats();
      
    } catch (error) {
      console.error('Error clearing data:', error);
      setImportResults({
        success: false,
        message: error.response?.data?.error || error.message || 'Clear failed',
        errors: [error.message]
      });
    }
  };

  const addKeyword = (keyword) => {
    if (keyword && !formData.keywords.includes(keyword)) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, keyword]
      });
    }
  };

  const removeKeyword = (index) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter((_, i) => i !== index)
    });
  };

  const addFollowUp = (suggestion) => {
    if (suggestion && !formData.followUpSuggestions.includes(suggestion)) {
      setFormData({
        ...formData,
        followUpSuggestions: [...formData.followUpSuggestions, suggestion]
      });
    }
  };

  const removeFollowUp = (index) => {
    setFormData({
      ...formData,
      followUpSuggestions: formData.followUpSuggestions.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Chatbot Training</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowStats(!showStats)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <BarChart3 size={20} />
            Stats
          </button>
          <button
            onClick={() => setShowTestModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <TestTube size={20} />
            Test
          </button>
          <button
            onClick={() => setShowBulkImportModal(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2"
          >
            <Upload size={20} />
            Bulk Import
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Add Training Data
          </button>
        </div>
      </div>

      {/* Stats Panel */}
      {showStats && stats && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Training Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-600">Total Entries</h3>
              <p className="text-2xl font-bold text-blue-800">{stats.totalEntries}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-600">Active</h3>
              <p className="text-2xl font-bold text-green-800">{stats.activeEntries}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-red-600">Inactive</h3>
              <p className="text-2xl font-bold text-red-800">{stats.inactiveEntries}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-purple-600">Categories</h3>
              <p className="text-2xl font-bold text-purple-800">{stats.categoryStats.length}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Category Distribution</h4>
              <div className="space-y-1">
                {stats.categoryStats.slice(0, 5).map(cat => (
                  <div key={cat._id} className="flex justify-between text-sm">
                    <span className="capitalize">{cat._id}</span>
                    <span className="font-medium">{cat.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Most Used Responses</h4>
              <div className="space-y-1">
                {stats.topUsed.slice(0, 3).map(item => (
                  <div key={item._id} className="text-sm">
                    <div className="font-medium truncate">{item.question}</div>
                    <div className="text-gray-500">Used {item.usageCount} times</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search training data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat} className="capitalize">{cat.replace('_', ' ')}</option>
            ))}
          </select>
          <button
            onClick={fetchTrainingData}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
          >
            <Filter size={20} />
            Filter
          </button>
        </div>
      </div>

      {/* Training Data Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trainingData && trainingData.length > 0 ? trainingData.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{item.question}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{item.answer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {item.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.priority}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.usageCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    {loading ? 'Loading training data...' : 'No training data found. Click "Add Training Data" to get started.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingItem ? 'Edit Training Data' : 'Add Training Data'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({...formData, answer: e.target.value})}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat} className="capitalize">{cat.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.keywords.map((keyword, index) => (
                    <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                      {keyword}
                      <button type="button" onClick={() => removeKeyword(index)} className="text-purple-600 hover:text-purple-800">×</button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add keyword and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addKeyword(e.target.value.trim());
                      e.target.value = '';
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Suggestions</label>
                <div className="space-y-2 mb-2">
                  {formData.followUpSuggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="flex-1 text-sm bg-gray-100 px-2 py-1 rounded">{suggestion}</span>
                      <button type="button" onClick={() => removeFollowUp(index)} className="text-red-600 hover:text-red-800">×</button>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add follow-up suggestion and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addFollowUp(e.target.value.trim());
                      e.target.value = '';
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Test Modal */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Test Chatbot Responses</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Query</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testQuery}
                    onChange={(e) => setTestQuery(e.target.value)}
                    placeholder="Enter a question to test..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleTestQuery}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Test
                  </button>
                </div>
              </div>

              {testResults.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Matching Results:</h3>
                  <div className="space-y-2">
                    {testResults.map((result, index) => (
                      <div key={result.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-purple-600">Match #{index + 1}</span>
                          <span className="text-xs text-gray-500 capitalize">{result.category}</span>
                        </div>
                        <div className="text-sm font-medium mb-1">{result.question}</div>
                        <div className="text-sm text-gray-600 mb-2">{result.answer}</div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Priority: {result.priority}</span>
                          <span>Used: {result.usageCount} times</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => {
                  setShowTestModal(false);
                  setTestQuery('');
                  setTestResults([]);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showBulkImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Bulk Import Training Data</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  JSON Training Data
                </label>
                <p className="text-sm text-gray-600 mb-2">
                  Paste your JSON array of training data. Each object should have: question, answer, category, keywords, priority, followUpSuggestions
                </p>
                <textarea
                  value={bulkImportData}
                  onChange={(e) => setBulkImportData(e.target.value)}
                  placeholder='[{"question": "What types of jewelry do you sell?", "answer": "We offer...", "category": "products", "keywords": ["jewelry", "types"], "priority": 1, "followUpSuggestions": ["Browse rings"]}]'
                  rows="15"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
                />
              </div>

              {importResults && (
                <div className={`p-4 rounded-lg ${importResults.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <h3 className={`font-medium ${importResults.success ? 'text-green-800' : 'text-red-800'}`}>
                    Import Results
                  </h3>
                  <p className={`text-sm ${importResults.success ? 'text-green-700' : 'text-red-700'}`}>
                    {importResults.message}
                  </p>
                  {importResults.success && (
                    <div className="mt-2 text-sm text-green-700">
                      <p>✅ Imported: {importResults.imported} entries</p>
                      {importResults.skipped > 0 && <p>⚠️ Skipped: {importResults.skipped} entries</p>}
                    </div>
                  )}
                  {importResults.errors && importResults.errors.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-red-700">Errors:</p>
                      <ul className="text-sm text-red-600 list-disc list-inside">
                        {importResults.errors.slice(0, 5).map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={handleClearAllData}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Clear All Data
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowBulkImportModal(false);
                    setBulkImportData('');
                    setImportResults(null);
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkImport}
                  disabled={!bulkImportData.trim()}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Import Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotTraining;
