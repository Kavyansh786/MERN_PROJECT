const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');

// Simple test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Reports API is working', timestamp: new Date() });
});

// Get all reports data
router.get('/', async (req, res) => {
  try {
    console.log('Reports API called with query:', req.query);
    
    // Get date range from query params (default to 30 days)
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Basic filters
    const dateFilter = { createdAt: { $gte: startDate } };
    const validOrderStatuses = ['Delivered', 'Processing', 'Shipped', 'Pending'];
    
    // Get basic metrics
    let totalRevenue = 0;
    let totalOrders = 0;
    let totalCustomers = 0;
    
    try {
      // Count total orders in date range
      totalOrders = await Order.countDocuments({
        ...dateFilter,
        orderStatus: { $in: validOrderStatuses }
      });
      
      // Calculate total revenue
      const revenueResult = await Order.aggregate([
        {
          $match: {
            ...dateFilter,
            orderStatus: { $in: validOrderStatuses }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalPrice' }
          }
        }
      ]);
      totalRevenue = revenueResult[0]?.total || 0;
      
      // Count total customers
      totalCustomers = await User.countDocuments();
      
    } catch (dbError) {
      console.error('Database query error:', dbError);
    }
    
    // Get sales by category (simplified)
    let salesByCategory = [];
    try {
      const categoryResults = await Order.aggregate([
        {
          $match: {
            ...dateFilter,
            orderStatus: { $in: validOrderStatuses }
          }
        },
        { $unwind: '$orderItems' },
        {
          $lookup: {
            from: 'products',
            localField: 'orderItems.product',
            foreignField: '_id',
            as: 'productInfo'
          }
        },
        { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: '$productInfo.category',
            revenue: {
              $sum: {
                $multiply: [
                  '$orderItems.quantity',
                  { $ifNull: ['$productInfo.price', 0] }
                ]
              }
            }
          }
        },
        { $sort: { revenue: -1 } },
        { $limit: 10 }
      ]);
      
      const totalCategoryRevenue = categoryResults.reduce((sum, cat) => sum + cat.revenue, 0);
      
      salesByCategory = categoryResults.map(cat => ({
        category: cat._id || 'Unknown',
        revenue: cat.revenue,
        percentage: totalCategoryRevenue > 0 ? Math.round((cat.revenue / totalCategoryRevenue) * 100) : 0
      }));
      
    } catch (categoryError) {
      console.error('Category aggregation error:', categoryError);
      salesByCategory = [];
    }
    
    // Get monthly revenue (last 6 months)
    let monthlyRevenue = [];
    try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      const monthlyResults = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: sixMonthsAgo },
            orderStatus: { $in: validOrderStatuses }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            revenue: { $sum: '$totalPrice' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);
      
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      monthlyRevenue = monthlyResults.map(month => ({
        month: monthNames[month._id.month - 1] || 'Unknown',
        revenue: month.revenue || 0
      }));
      
    } catch (monthlyError) {
      console.error('Monthly revenue error:', monthlyError);
      monthlyRevenue = [];
    }
    
    // Get top products
    let topProducts = [];
    try {
      const productResults = await Order.aggregate([
        {
          $match: {
            ...dateFilter,
            orderStatus: { $in: validOrderStatuses }
          }
        },
        { $unwind: '$orderItems' },
        {
          $lookup: {
            from: 'products',
            localField: 'orderItems.product',
            foreignField: '_id',
            as: 'productInfo'
          }
        },
        { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: '$orderItems.product',
            name: { $first: '$productInfo.name' },
            sales: { $sum: '$orderItems.quantity' },
            revenue: {
              $sum: {
                $multiply: [
                  '$orderItems.quantity',
                  { $ifNull: ['$productInfo.price', 0] }
                ]
              }
            }
          }
        },
        { $sort: { revenue: -1 } },
        { $limit: 4 }
      ]);
      
      topProducts = productResults.map(product => ({
        name: product.name || 'Unknown Product',
        sales: product.sales || 0,
        revenue: product.revenue || 0
      }));
      
    } catch (productError) {
      console.error('Top products error:', productError);
      topProducts = [];
    }
    
    // Prepare response
    const responseData = {
      totalRevenue: totalRevenue || 0,
      totalOrders: totalOrders || 0,
      totalCustomers: totalCustomers || 0,
      salesByCategory: salesByCategory || [],
      monthlyRevenue: monthlyRevenue || [],
      topProducts: topProducts || [],
      recentActivity: []
    };
    
    console.log('Sending response:', responseData);
    res.json(responseData);
    
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ 
      message: 'Failed to fetch reports data',
      error: error.message 
    });
  }
});

// Helper function to get time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  return date.toLocaleDateString();
}

module.exports = router;
