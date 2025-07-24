const express = require('express');
const {
  getAllReviews,
  approveReview,
  rejectReview
} = require('../services/reviewService');
const Review = require('../models/reviiews');

const router = express.Router();

// GET /api/reviews?status=Pending|Approved|Rejected
router.get('/', async (req, res) => {
  try {
    const reviews = await getAllReviews(req.query.status);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

// POST /api/reviews (create one or more reviews)
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    let result;
    if (Array.isArray(data)) {
      result = await Review.insertMany(data);
    } else {
      result = await Review.create(data);
    }
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create review(s)', error: err.message });
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
