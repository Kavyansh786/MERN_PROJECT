const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');
const mongoose = require('mongoose');

// Get all reports data
router.get('/', async (req, res) => {
  try {
    // Get total revenue
    const totalRevenue = await Order.aggregate([
      { $match: { orderStatus: { $in: ['Delivered', 'Processing', 'Shipped'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    // Get total orders
    const totalOrders = await Order.countDocuments({ 
      orderStatus: { $in: ['Delivered', 'Processing', 'Shipped'] } 
    });

    // Get total customers
    const totalCustomers = await User.countDocuments();

    // Get sales by category
    const salesByCategory = await Order.aggregate([
      { $match: { orderStatus: { $in: ['Delivered', 'Processing', 'Shipped'] } } },
      { $unwind: '$orderItems' },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          revenue: { $sum: { $multiply: ['$orderItems.quantity', '$product.price'] } }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    // Get monthly revenue for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyRevenue = await Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: sixMonthsAgo },
          orderStatus: { $in: ['Delivered', 'Processing', 'Shipped'] }
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

    // Get top selling products
    const topProducts = await Order.aggregate([
      { $match: { orderStatus: { $in: ['Delivered', 'Processing', 'Shipped'] } } },
      { $unwind: '$orderItems' },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product._id',
          name: { $first: '$product.name' },
          sales: { $sum: '$orderItems.quantity' },
          revenue: { $sum: { $multiply: ['$orderItems.quantity', '$product.price'] } }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 4 }
    ]);

    // Get recent activity
    const recentOrders = await Order.find({ 
      orderStatus: { $in: ['Delivered', 'Processing', 'Shipped'] } 
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name');

    const recentCustomers = await User.find()
    .sort({ createdAt: -1 })
    .limit(3);

    // Format the data
    const formattedSalesByCategory = salesByCategory.map(category => ({
      category: category._id,
      revenue: category.revenue,
      percentage: 0 // Will be calculated below
    }));

    // Calculate percentages for sales by category
    const totalCategoryRevenue = formattedSalesByCategory.reduce((sum, cat) => sum + cat.revenue, 0);
    formattedSalesByCategory.forEach(category => {
      category.percentage = Math.round((category.revenue / totalCategoryRevenue) * 100);
    });

    // Format monthly revenue
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthlyRevenue = monthlyRevenue.map(month => ({
      month: monthNames[month._id.month - 1],
      revenue: month.revenue
    }));

    // Format top products
    const formattedTopProducts = topProducts.map(product => ({
      name: product.name,
      sales: product.sales,
      revenue: product.revenue
    }));

    // Format recent activity
    const recentActivity = [
      ...recentOrders.map(order => ({
        type: 'order',
        title: `New Order #${order._id.toString().slice(-4)}`,
        description: `₹${order.totalPrice.toLocaleString()} • ${getTimeAgo(order.createdAt)}`,
        icon: 'trending',
        color: 'green'
      })),
      ...recentCustomers.map(customer => ({
        type: 'customer',
        title: 'New Customer',
        description: `${customer.name} registered • ${getTimeAgo(customer.createdAt)}`,
        icon: 'users',
        color: 'blue'
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 3);

    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      totalOrders,
      totalCustomers,
      salesByCategory: formattedSalesByCategory,
      monthlyRevenue: formattedMonthlyRevenue,
      topProducts: formattedTopProducts,
      recentActivity
    });

  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Failed to fetch reports data' });
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