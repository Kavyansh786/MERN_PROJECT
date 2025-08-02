const express = require('express');
const {
  getAllReviews,
  approveReview,
  rejectReview
} = require('../services/reviewService');
const Review = require('../models/reviiews');

const router = express.Router();

// GET /api/reviews/test - Test endpoint to verify review system
router.get('/test', async (req, res) => {
  try {
    res.json({ message: 'Review API is working!', timestamp: new Date() });
  } catch (err) {
    res.status(500).json({ message: 'Review API test failed' });
  }
});

// GET /api/reviews?status=Pending|Approved|Rejected
router.get('/', async (req, res) => {
  try {
    const reviews = await getAllReviews(req.query.status);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

// GET /api/reviews/product/:productId - Get reviews for a specific product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ 
      product: req.params.productId,
      status: 'Approved' // Only show approved reviews
    }).populate('user', 'name').sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product reviews' });
  }
});

// POST /api/reviews (create one or more reviews)
router.post('/', async (req, res) => {
  try {
    const { userId, productId, rating, comment, userName } = req.body;
    
    // Validate required fields
    if (!userId || !productId || !rating || !comment) {
      return res.status(400).json({ 
        message: 'Missing required fields: userId, productId, rating, comment' 
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        message: 'Rating must be between 1 and 5' 
      });
    }

    const reviewData = {
      product: productId,
      user: userId,
      rating: rating,
      comment: comment,
      status: 'Approved' // Auto-approve for now, can be changed to 'Pending' if moderation is needed
    };

    const review = await Review.create(reviewData);
    
    // Populate user info for response
    await review.populate('user', 'name');
    
    res.status(201).json({ 
      success: true, 
      message: 'Review submitted successfully',
      review: review
    });
  } catch (err) {
    console.error('Review creation error:', err);
    res.status(400).json({ 
      message: 'Failed to create review', 
      error: err.message 
    });
  }
});

// PATCH /api/reviews/:id/approve
router.patch('/:id/approve', async (req, res) => {
  try {
    const review = await approveReview(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Failed to approve review' });
  }
});

// PATCH /api/reviews/:id/reject
router.patch('/:id/reject', async (req, res) => {
  try {
    const review = await rejectReview(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Failed to reject review' });
  }
});

module.exports = router;
