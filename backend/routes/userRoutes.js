const express = require('express');
const router = express.Router();
const { getUserById, updateUserProfile, getUserWishlist, addToWishlist } = require('../services/userService');

// Hardcoded test user ID
const testUserId = '68676301057779079dc54a04';

// ✅ GET /api/users/profile
router.get('/profile', async (req, res) => {
  try {
    const user = await getUserById(testUserId);
    res.json(user);
  } catch (err) {
    console.error(' Failed to fetch user profile:', err.message);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// ✅ PATCH /api/users/profile
router.patch('/profile', async (req, res) => {
  try {
    const updatedUser = await updateUserProfile(testUserId, req.body);
    res.json(updatedUser);
  } catch (err) {
    console.error(' Failed to update user profile:', err.message);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// ✅ GET /api/users/wishlist
router.get('/wishlist', async (req, res) => {
  try {
    const wishlist = await getUserWishlist(testUserId);
    res.json(wishlist);
  } catch (err) {
    console.error(' Failed to fetch wishlist:', err.message);
    res.status(500).json({ message: 'Failed to fetch wishlist' });
  }
});

// ✅ POST /api/users/wishlist
router.post('/wishlist', async (req, res) => {
  const { productId } = req.body;

  try {
    const updatedWishlist = await addToWishlist(testUserId, productId);
    res.json(updatedWishlist);
  } catch (err) {
    console.error(' Failed to add to wishlist:', err.message);
    res.status(500).json({ message: 'Failed to add to wishlist' });
  }
});

// ✅ Test route
router.get('/test', (req, res) => {
  res.send('User route works!');
});

module.exports = router;
