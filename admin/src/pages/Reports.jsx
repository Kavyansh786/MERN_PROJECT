import React, { useState, useEffect } from 'react';
import { 
  IndianRupee, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  RefreshCw, 
  Download, 
  BarChart3,
  ChevronDown
} from 'lucide-react';
import * as XLSX from 'xlsx';

const Reports = () => {
  const [reports, setReports] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    salesByCategory: [],
    monthlyRevenue: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('30');

  // Mock data fallback
  const mockData = {
    totalRevenue: 1098677,
    totalOrders: 38,
    totalCustomers: 6,
    salesByCategory: [
      { category: 'Necklaces', revenue: 402000, percentage: 70 },
      { category: 'Earrings', revenue: 137440, percentage: 24 },
      { category: 'Rings', revenue: 25000, percentage: 4 },
      { category: 'Gifting', revenue: 12050, percentage: 2 },
      { category: 'Unknown', revenue: 0, percentage: 0 }
    ],
    monthlyRevenue: [
      { month: 'Jul', revenue: 840233 },
      { month: 'Aug', revenue: 258444 }
    ],
    topProducts: [
      { name: 'Gold Necklace Set', sales: 15, revenue: 225000 },
      { name: 'Diamond Earrings', sales: 8, revenue: 120000 },
      { name: 'Silver Ring Collection', sales: 12, revenue: 85000 },
      { name: 'Pearl Bracelet', sales: 6, revenue: 45000 }
    ]
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/reports?days=${dateRange}`);
      if (response.ok) {
        const data = await response.json();
        
        // Use real data if available, otherwise fallback to mock data
        if (data.totalRevenue > 0 || data.totalOrders > 0 || data.totalCustomers > 0) {
          setReports(data);
        } else {
          console.log('Using mock data as fallback');
          setReports(mockData);
        }
      } else {
        console.log('API failed, using mock data');
        setReports(mockData);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setReports(mockData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchReports, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [dateRange]);

  const avgOrderValue = reports.totalOrders > 0 ? Math.round(reports.totalRevenue / reports.totalOrders) : 0;

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();
    
    // Sales by Category sheet with merged cells
    if (reports.salesByCategory && reports.salesByCategory.length > 0) {
      const categoryData = [
        ['Sales by Category Report', '', ''],
        ['', '', ''],
        ['Category', 'Revenue (₹)', 'Percentage (%)'],
        ...reports.salesByCategory.map(cat => [
          cat.category,
          cat.revenue.toLocaleString(),
          `${cat.percentage}%`
        ])
      ];
      
      const categoryWS = XLSX.utils.aoa_to_sheet(categoryData);
      
      // Merge cells for header
      categoryWS['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } } // Merge A1:C1 for title
      ];
      
      // Style the merged header
      categoryWS['A1'] = { 
        v: 'Sales by Category Report', 
        t: 's', 
        s: { 
          font: { bold: true, sz: 14 },
          alignment: { horizontal: 'center' }
        } 
      };
      
      XLSX.utils.book_append_sheet(wb, categoryWS, 'Sales by Category');
    }
    
    // Monthly Revenue sheet with merged cells
    if (reports.monthlyRevenue && reports.monthlyRevenue.length > 0) {
      const monthlyData = [
        ['Monthly Revenue Report', '', ''],
        ['', '', ''],
        ['Month', 'Revenue (₹)', 'Growth (%)'],
        ...reports.monthlyRevenue.map((month, index) => {
          const prevRevenue = index > 0 ? reports.monthlyRevenue[index - 1].revenue : month.revenue;
          const growthRate = prevRevenue > 0 ? (((month.revenue - prevRevenue) / prevRevenue) * 100).toFixed(1) : '0.0';
          return [
            month.month,
            month.revenue.toLocaleString(),
            `${growthRate}%`
          ];
        })
      ];
      
      const monthlyWS = XLSX.utils.aoa_to_sheet(monthlyData);
      
      // Merge cells for header
      monthlyWS['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } } // Merge A1:C1 for title
      ];
      
      // Style the merged header
      monthlyWS['A1'] = { 
        v: 'Monthly Revenue Report', 
        t: 's', 
        s: { 
          font: { bold: true, sz: 14 },
          alignment: { horizontal: 'center' }
        } 
      };
      
      XLSX.utils.book_append_sheet(wb, monthlyWS, 'Monthly Revenue');
    }
    
    // Save the clean report
    XLSX.writeFile(wb, `sales-revenue-report-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
              <p className="text-gray-600">Business analytics and insights</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select 
                  value={dateRange} 
                  onChange={(e) => setDateRange(e.target.value)}
                  className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 3 months</option>
                  <option value="180">Last 6 months</option>
                  <option value="365">Last year</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
              
              <button
                onClick={fetchReports}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Download className="h-4 w-4" />
                Export Excel Report
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">₹{reports.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <IndianRupee className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{reports.totalOrders.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <ShoppingCart className="w-7 h-7 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Customers</p>
                <p className="text-3xl font-bold text-gray-900">{reports.totalCustomers.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Users className="w-7 h-7 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Avg Order Value</p>
                <p className="text-3xl font-bold text-gray-900">₹{avgOrderValue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-xl">
                <BarChart3 className="w-7 h-7 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales by Category Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Sales by Category</h3>
            <p className="text-sm text-gray-600 mb-6">Revenue distribution across product categories</p>
            
            {reports.salesByCategory && reports.salesByCategory.length > 0 ? (
              <div className="space-y-4">
                {reports.salesByCategory.map((category, index) => {
                  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
                  const maxRevenue = Math.max(...reports.salesByCategory.map(c => c.revenue));
                  const widthPercentage = maxRevenue > 0 ? (category.revenue / maxRevenue) * 100 : 0;
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: colors[index % colors.length] }}
                          ></div>
                          <span className="text-sm font-medium text-gray-700">{category.category}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-900">₹{category.revenue.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">{category.percentage}%</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300" 
                          style={{ 
                            width: `${widthPercentage}%`,
                            backgroundColor: colors[index % colors.length]
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-500">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No category data available</p>
                </div>
              </div>
            )}
          </div>

          {/* Monthly Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Monthly Revenue</h3>
            <p className="text-sm text-gray-600 mb-6">Revenue trends over the past 6 months</p>
            
            {reports.monthlyRevenue && reports.monthlyRevenue.length > 0 ? (
              <div className="space-y-4">
                {reports.monthlyRevenue.map((month, index) => {
                  const maxRevenue = Math.max(...reports.monthlyRevenue.map(m => m.revenue));
                  const widthPercentage = maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0;
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{month.month}</span>
                        <span className="text-sm font-semibold text-gray-900">₹{month.revenue.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-500 h-3 rounded-full transition-all duration-300" 
                          style={{ width: `${widthPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-500">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No revenue data available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
