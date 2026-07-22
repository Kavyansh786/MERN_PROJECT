const express = require('express');
const bcrypt = require('bcryptjs');
const {
  getUserById,
  updateUserProfile,
  getUserWishlist,
  addToWishlist,
  removeFromWishlist
} = require('../services/userService');
const User = require('../models/user');

const router = express.Router();

// ✅ GET /api/users/profile?id=<userId>
router.get('/profile', async (req, res) => {
  try {
    const userId = req.query.id;

    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    const user = await getUserById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

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

    if (!userId) return res.status(400).json({ message: 'User ID is required' });

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

    if (userId === 'undefined') {
      return res.status(400).json({ message: 'Invalid user ID' });
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

// DELETE /api/users/wishlist/:userId/:productId
router.delete('/wishlist/:userId/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    if (!userId || !productId) {
      return res.status(400).json({ message: 'User ID and product ID are required' });
    }
    const updatedWishlist = await removeFromWishlist(userId, productId);
    res.json(updatedWishlist);
  } catch (err) {
    console.error('Failed to remove from wishlist:', err.message);
    res.status(500).json({ message: 'Failed to remove from wishlist' });
  }
});

// GET /api/users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// POST /api/users - Create new user (Admin only)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, password, isAdmin } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      isAdmin: isAdmin || false
    });

    const savedUser = await newUser.save();
    
    // Return user without password
    const userResponse = savedUser.toObject();
    delete userResponse.password;
    
    res.status(201).json({
      message: 'User created successfully',
      user: userResponse
    });
  } catch (err) {
    console.error('Failed to create user:', err.message);
    res.status(500).json({ message: 'Failed to create user' });
  }
});

// PATCH /api/users/:id
router.patch('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user' });
  }
});

module.exports = router;
