const Review = require('../models/reviiews');

// Get all reviews (optionally filter by status)
async function getAllReviews(status) {
  const filter = status ? { status } : {};
  return await Review.find(filter).populate('product user');
}

// Approve a review
async function approveReview(id) {
  return await Review.findByIdAndUpdate(id, { status: 'Approved' }, { new: true });
}

// Reject a review
async function rejectReview(id) {
  return await Review.findByIdAndUpdate(id, { status: 'Rejected' }, { new: true });
}

module.exports = {
  getAllReviews,
  approveReview,
  rejectReview,
}; 