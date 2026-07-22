const express = require('express');
const router = express.Router();
const VirtualTryOnSession = require('../models/VirtualTryOnSession');
const Product = require('../models/product');
const auth = require('../middleware/auth');

// Save virtual try-on session
router.post('/save-session', auth, async (req, res) => {
  try {
    const { productId, sessionData, timestamp } = req.body;
    const userId = req.user.id;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const session = new VirtualTryOnSession({
      userId,
      productId,
      sessionData,
      timestamp: timestamp || new Date(),
      metadata: {
        userAgent: req.headers['user-agent'],
        ip: req.ip
      }
    });

    await session.save();

    // Populate product details for response
    await session.populate('productId', 'name price image category');

    res.status(201).json({
      message: 'Try-on session saved successfully',
      session
    });
  } catch (error) {
    console.error('Error saving try-on session:', error);
    res.status(500).json({ message: 'Failed to save try-on session' });
  }
});

// Get user's try-on history
router.get('/history', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, category } = req.query;

    const query = { userId };
    if (category) {
      // First get products of the specified category
      const products = await Product.find({ category }, '_id');
      const productIds = products.map(p => p._id);
      query.productId = { $in: productIds };
    }

    const sessions = await VirtualTryOnSession.find(query)
      .populate('productId', 'name price image category')
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await VirtualTryOnSession.countDocuments(query);

    res.json({
      sessions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching try-on history:', error);
    res.status(500).json({ message: 'Failed to fetch try-on history' });
  }
});

// Get try-on analytics for a specific product
router.get('/analytics/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { startDate, endDate } = req.query;

    const query = { productId };
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const totalSessions = await VirtualTryOnSession.countDocuments(query);
    const uniqueUsers = await VirtualTryOnSession.distinct('userId', query);
    
    // Get sessions by day for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyStats = await VirtualTryOnSession.aggregate([
      {
        $match: {
          productId: productId,
          timestamp: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalSessions,
      uniqueUsers: uniqueUsers.length,
      dailyStats,
      averageSessionsPerDay: totalSessions / 30
    });
  } catch (error) {
    console.error('Error fetching try-on analytics:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

// Delete a try-on session
router.delete('/session/:sessionId', auth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    const session = await VirtualTryOnSession.findOne({
      _id: sessionId,
      userId
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    await VirtualTryOnSession.findByIdAndDelete(sessionId);

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error deleting try-on session:', error);
    res.status(500).json({ message: 'Failed to delete session' });
  }
});

// Get popular products based on try-on sessions
router.get('/popular-products', async (req, res) => {
  try {
    const { limit = 10, category, timeframe = '30d' } = req.query;

    // Calculate date range based on timeframe
    const now = new Date();
    let startDate;
    switch (timeframe) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const matchStage = {
      timestamp: { $gte: startDate }
    };

    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: '$productId',
          tryOnCount: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      {
        $addFields: {
          uniqueUserCount: { $size: '$uniqueUsers' }
        }
      },
      { $sort: { tryOnCount: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' }
    ];

    // Add category filter if specified
    if (category) {
      pipeline.push({
        $match: { 'product.category': category }
      });
    }

    const popularProducts = await VirtualTryOnSession.aggregate(pipeline);

    res.json(popularProducts);
  } catch (error) {
    console.error('Error fetching popular products:', error);
    res.status(500).json({ message: 'Failed to fetch popular products' });
  }
});

module.exports = router;