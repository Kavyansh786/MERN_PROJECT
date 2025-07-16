const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');     

const router = express.Router();
const {
  getUserById,
  updateUserProfile,
  getUserWishlist,
  addToWishlist
} = require('../services/userService');

// ✅ GET /api/users/profile?id=<userId>
router.get('/profile', async (req, res) => {
  try {
    const userId = req.query.id;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Failed to fetch user profile:', err.message);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// ✅ PATCH /api/users/profile?id=<userId>
router.patch('/profile', async (req, res) => {
  try {
    const userId = req.query.id;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const updatedUser = await updateUserProfile(userId, req.body);
    res.json(updatedUser);
  } catch (err) {
    console.error('Failed to update user profile:', err.message);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// ✅ GET /api/users/wishlist?id=<userId>
router.get('/wishlist', async (req, res) => {
  try {
    const userId = req.query.id;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const wishlist = await getUserWishlist(userId);
    res.json(wishlist);
  } catch (err) {
    console.error('Failed to fetch wishlist:', err.message);
    res.status(500).json({ message: 'Failed to fetch wishlist' });
  }
});

// ✅ POST /api/users/wishlist?id=<userId>
router.post('/wishlist', async (req, res) => {
  try {
    const userId = req.query.id;
    const { productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: 'User ID and product ID are required' });
    }

    const updatedWishlist = await addToWishlist(userId, productId);
    res.json(updatedWishlist);
  } catch (err) {
    console.error('Failed to add to wishlist:', err.message);
    res.status(500).json({ message: 'Failed to add to wishlist' });
  }
});
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'Email not registered. Please register first.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email
      // you can also add a token here if using JWT
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;
