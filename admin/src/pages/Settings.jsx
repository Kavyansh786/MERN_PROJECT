import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Save, 
  Upload, 
  Store as StoreIcon, 
  CreditCard, 
  Truck, 
  Calculator, 
  Mail,
  CheckCircle,
  Loader
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('store');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Store Settings State
  const [storeSettings, setStoreSettings] = useState({
    storeName: '',
    storeEmail: '',
    storeDescription: '',
    storeLogo: null,
    storeAddress: '',
    storePhone: ''
  });

  // Payment Settings State
  const [paymentSettings, setPaymentSettings] = useState({
    razorpayEnabled: false,
    razorpayKeyId: '',
    razorpayKeySecret: '',
    codEnabled: false
  });

  // Shipping Settings State
  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: 0,
    standardShippingRate: 0,
    expressShippingRate: 0
  });

  // Tax Settings State
  const [taxSettings, setTaxSettings] = useState({
    taxEnabled: false,
    gstRate: 0,
    cgstRate: 0,
    sgstRate: 0
  });

  // Email Settings State
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    fromEmail: '',
    fromName: ''
  });

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setInitialLoading(true);
      const response = await axios.get('http://localhost:5000/api/settings');
      const settings = response.data.data;
      
      // Update all settings states
      setStoreSettings({
        storeName: settings.storeName || '',
        storeEmail: settings.storeEmail || '',
        storeDescription: settings.storeDescription || '',
        storeLogo: settings.storeLogo || null,
        storeAddress: settings.storeAddress || '',
        storePhone: settings.storePhone || ''
      });
      
      setPaymentSettings({
        razorpayEnabled: settings.razorpayEnabled || false,
        razorpayKeyId: settings.razorpayKeyId || '',
        razorpayKeySecret: settings.razorpayKeySecret || '',
        codEnabled: settings.codEnabled || false
      });
      
      setShippingSettings({
        freeShippingThreshold: settings.freeShippingThreshold || 0,
        standardShippingRate: settings.standardShippingRate || 0,
        expressShippingRate: settings.expressShippingRate || 0
      });
      
      setTaxSettings({
        taxEnabled: settings.taxEnabled || false,
        gstRate: settings.gstRate || 0,
        cgstRate: settings.cgstRate || 0,
        sgstRate: settings.sgstRate || 0
      });
      
      setEmailSettings({
        smtpHost: settings.smtpHost || '',
        smtpPort: settings.smtpPort || 587,
        smtpUser: settings.smtpUser || '',
        smtpPassword: settings.smtpPassword || '',
        fromEmail: settings.fromEmail || '',
        fromName: settings.fromName || ''
      });
      
    } catch (error) {
      console.error('Error loading settings:', error);
      showMessage('error', 'Failed to load settings');
    } finally {
      setInitialLoading(false);
    }
  };

  const tabs = [
    { id: 'store', label: 'Store', icon: StoreIcon },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'tax', label: 'Tax', icon: Calculator },
    { id: 'email', label: 'Email', icon: Mail }
  ];

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      let data = {};
      
      switch (activeTab) {
        case 'store':
          endpoint = 'http://localhost:5000/api/settings/store';
          data = storeSettings;
          break;
        case 'payment':
          endpoint = 'http://localhost:5000/api/settings/payment';
          data = paymentSettings;
          break;
        case 'shipping':
          endpoint = 'http://localhost:5000/api/settings/shipping';
          data = shippingSettings;
          break;
        case 'tax':
          endpoint = 'http://localhost:5000/api/settings/tax';
          data = taxSettings;
          break;
        case 'email':
          endpoint = 'http://localhost:5000/api/settings/email';
          data = emailSettings;
          break;
        default:
          throw new Error('Invalid tab');
      }
      
      await axios.put(endpoint, data);
      showMessage('success', `${tabs.find(t => t.id === activeTab)?.label} settings saved successfully!`);
    } catch (error) {
      console.error('Error saving settings:', error);
      showMessage('error', 'Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('logo', file);
        
        const response = await axios.post('http://localhost:5000/api/settings/logo', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        const logoUrl = response.data.data.logoUrl;
        setStoreSettings(prev => ({ ...prev, storeLogo: `http://localhost:5000${logoUrl}` }));
        showMessage('success', 'Logo uploaded successfully!');
      } catch (error) {
        console.error('Error uploading logo:', error);
        showMessage('error', 'Failed to upload logo');
      } finally {
        setLoading(false);
      }
    }
  };

  const renderStoreSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
          <input
            type="text"
            value={storeSettings.storeName}
            onChange={(e) => setStoreSettings(prev => ({ ...prev, storeName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter store name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Store Email</label>
          <input
            type="email"
            value={storeSettings.storeEmail}
            onChange={(e) => setStoreSettings(prev => ({ ...prev, storeEmail: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="store@example.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Store Address</label>
          <textarea
            value={storeSettings.storeAddress}
            onChange={(e) => setStoreSettings(prev => ({ ...prev, storeAddress: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter store address"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Store Phone</label>
          <input
            type="tel"
            value={storeSettings.storePhone}
            onChange={(e) => setStoreSettings(prev => ({ ...prev, storePhone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="+91 9876543210"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Store Description</label>
        <textarea
          value={storeSettings.storeDescription}
          onChange={(e) => setStoreSettings(prev => ({ ...prev, storeDescription: e.target.value }))}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe your store..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Store Logo</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          {storeSettings.storeLogo ? (
            <div className="space-y-4">
              <img src={storeSettings.storeLogo} alt="Store Logo" className="mx-auto h-20 w-20 object-contain" />
              <button
                onClick={() => document.getElementById('logo-upload').click()}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Change Logo
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="text-gray-600">
                <button
                  onClick={() => document.getElementById('logo-upload').click()}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Click to upload store logo
                </button>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
            </div>
          )}
          <input
            id="logo-upload"
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Razorpay</h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={paymentSettings.razorpayEnabled}
              onChange={(e) => setPaymentSettings(prev => ({ ...prev, razorpayEnabled: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        {paymentSettings.razorpayEnabled && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Key ID</label>
              <input
                type="text"
                value={paymentSettings.razorpayKeyId}
                onChange={(e) => setPaymentSettings(prev => ({ ...prev, razorpayKeyId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="rzp_test_xxxxxxxxxx"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Key Secret</label>
              <input
                type="password"
                value={paymentSettings.razorpayKeySecret}
                onChange={(e) => setPaymentSettings(prev => ({ ...prev, razorpayKeySecret: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Razorpay Key Secret"
              />
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Cash on Delivery</h3>
            <p className="text-sm text-gray-500">Allow customers to pay on delivery</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={paymentSettings.codEnabled}
              onChange={(e) => setPaymentSettings(prev => ({ ...prev, codEnabled: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderShippingSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Free Shipping Threshold (₹)</label>
          <input
            type="number"
            value={shippingSettings.freeShippingThreshold}
            onChange={(e) => setShippingSettings(prev => ({ ...prev, freeShippingThreshold: Number(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Standard Shipping Rate (₹)</label>
          <input
            type="number"
            value={shippingSettings.standardShippingRate}
            onChange={(e) => setShippingSettings(prev => ({ ...prev, standardShippingRate: Number(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="50"
          />
        </div>
      </div>
    </div>
  );

  const renderTaxSettings = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Tax Calculation</h3>
            <p className="text-sm text-gray-500">Enable tax calculation for orders</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={taxSettings.taxEnabled}
              onChange={(e) => setTaxSettings(prev => ({ ...prev, taxEnabled: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {taxSettings.taxEnabled && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">GST Rate (%)</label>
            <input
              type="number"
              value={taxSettings.gstRate}
              onChange={(e) => setTaxSettings(prev => ({ ...prev, gstRate: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="18"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CGST Rate (%)</label>
            <input
              type="number"
              value={taxSettings.cgstRate}
              onChange={(e) => setTaxSettings(prev => ({ ...prev, cgstRate: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="9"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SGST Rate (%)</label>
            <input
              type="number"
              value={taxSettings.sgstRate}
              onChange={(e) => setTaxSettings(prev => ({ ...prev, sgstRate: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="9"
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
          <input
            type="text"
            value={emailSettings.smtpHost}
            onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="smtp.gmail.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
          <input
            type="number"
            value={emailSettings.smtpPort}
            onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPort: Number(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="587"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Username</label>
          <input
            type="text"
            value={emailSettings.smtpUser}
            onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpUser: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="your-email@gmail.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Password</label>
          <input
            type="password"
            value={emailSettings.smtpPassword}
            onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPassword: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="App password or email password"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
          <input
            type="email"
            value={emailSettings.fromEmail}
            onChange={(e) => setEmailSettings(prev => ({ ...prev, fromEmail: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="noreply@yourstore.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
          <input
            type="text"
            value={emailSettings.fromName}
            onChange={(e) => setEmailSettings(prev => ({ ...prev, fromName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your Store Name"
          />
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'store': return renderStoreSettings();
      case 'payment': return renderPaymentSettings();
      case 'shipping': return renderShippingSettings();
      case 'tax': return renderTaxSettings();
      case 'email': return renderEmailSettings();
      default: return renderStoreSettings();
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your store configuration and preferences</p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <CheckCircle className="h-5 w-5" />
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {renderTabContent()}
          </div>

          {/* Save Button */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-xl">
            <button
              onClick={handleSaveSettings}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
