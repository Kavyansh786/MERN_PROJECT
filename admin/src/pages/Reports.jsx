import React, { useState, useEffect } from 'react';
import { Download, FileText, TrendingUp, Users, ShoppingCart, DollarSign, RefreshCw } from 'lucide-react';
import api from '../api/axios';

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState({
    salesByCategory: [],
    monthlyRevenue: [],
    topProducts: [],
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0
  });

  useEffect(() => {
    fetchReports();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchReports, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reports');
      setReports(response.data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      // Fallback to empty data if API fails
      setReports({
        salesByCategory: [],
        monthlyRevenue: [],
        topProducts: [],
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        recentActivity: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    // Implement PDF export functionality
    console.log('Exporting PDF...');
  };

  const handleExportCSV = () => {
    // Implement CSV export functionality
    console.log('Exporting CSV...');
  };

  const getCategoryColor = (index) => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <div className="flex gap-3">
            <button
              onClick={fetchReports}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{reports.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{reports.totalOrders}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{reports.totalCustomers}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales by Category */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sales by Category</h3>
            <p className="text-sm text-gray-600 mb-6">Revenue distribution across product categories</p>
            
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {reports.salesByCategory.map((category, index) => {
                    const total = reports.salesByCategory.reduce((sum, cat) => sum + cat.percentage, 0);
                    const startAngle = reports.salesByCategory
                      .slice(0, index)
                      .reduce((sum, cat) => sum + (cat.percentage / total) * 360, 0);
                    const angle = (category.percentage / total) * 360;
                    const radius = 40;
                    const x1 = 50 + radius * Math.cos((startAngle - 90) * Math.PI / 180);
                    const y1 = 50 + radius * Math.sin((startAngle - 90) * Math.PI / 180);
                    const x2 = 50 + radius * Math.cos((startAngle + angle - 90) * Math.PI / 180);
                    const y2 = 50 + radius * Math.sin((startAngle + angle - 90) * Math.PI / 180);
                    const largeArcFlag = angle > 180 ? 1 : 0;
                    
                    return (
                      <path
                        key={category.category}
                        d={`M 50 50 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                        fill={getCategoryColor(index)}
                      />
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="space-y-3">
              {reports.salesByCategory && reports.salesByCategory.length > 0 ? (
                reports.salesByCategory.map((category, index) => (
                  <div key={category.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: getCategoryColor(index) }}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">{category.category}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{category.percentage}%</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No sales data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly Revenue</h3>
            <p className="text-sm text-gray-600 mb-6">Revenue trends over the past 6 months</p>
            
            <div className="h-64 flex items-end justify-between gap-2">
              {reports.monthlyRevenue && reports.monthlyRevenue.length > 0 ? (
                reports.monthlyRevenue.map((month, index) => {
                  const maxRevenue = Math.max(...reports.monthlyRevenue.map(m => m.revenue));
                  const height = maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0;
                  
                  return (
                    <div key={month.month} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gray-200 rounded-t" style={{ height: `${height}%` }}>
                        <div className="w-full bg-blue-600 rounded-t transition-all duration-300 hover:bg-blue-700"></div>
                      </div>
                      <span className="text-xs text-gray-600 mt-2">{month.month}</span>
                      <span className="text-xs text-gray-500">₹{(month.revenue / 1000).toFixed(0)}k</span>
                    </div>
                  );
                })
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <p>No revenue data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Top Selling Products</h3>
            <p className="text-sm text-gray-600 mb-6">Best performing products this month</p>
            
            <div className="space-y-4">
              {reports.topProducts && reports.topProducts.length > 0 ? (
                reports.topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.sales} units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{product.revenue.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Revenue</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No product data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Recent Activity</h3>
            <p className="text-sm text-gray-600 mb-6">Latest orders and customer activity</p>
            
            <div className="space-y-4">
              {reports.recentActivity && reports.recentActivity.length > 0 ? (
                reports.recentActivity.map((activity, index) => (
                  <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${
                    activity.color === 'green' ? 'bg-green-50' :
                    activity.color === 'blue' ? 'bg-blue-50' :
                    activity.color === 'yellow' ? 'bg-yellow-50' : 'bg-gray-50'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.color === 'green' ? 'bg-green-100' :
                      activity.color === 'blue' ? 'bg-blue-100' :
                      activity.color === 'yellow' ? 'bg-yellow-100' : 'bg-gray-100'
                    }`}>
                      {activity.icon === 'trending' ? (
                        <TrendingUp className={`w-4 h-4 ${
                          activity.color === 'green' ? 'text-green-600' :
                          activity.color === 'blue' ? 'text-blue-600' :
                          activity.color === 'yellow' ? 'text-yellow-600' : 'text-gray-600'
                        }`} />
                      ) : activity.icon === 'users' ? (
                        <Users className={`w-4 h-4 ${
                          activity.color === 'green' ? 'text-green-600' :
                          activity.color === 'blue' ? 'text-blue-600' :
                          activity.color === 'yellow' ? 'text-yellow-600' : 'text-gray-600'
                        }`} />
                      ) : (
                        <ShoppingCart className={`w-4 h-4 ${
                          activity.color === 'green' ? 'text-green-600' :
                          activity.color === 'blue' ? 'text-blue-600' :
                          activity.color === 'yellow' ? 'text-yellow-600' : 'text-gray-600'
                        }`} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 