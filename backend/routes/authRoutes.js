const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// ✅ POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10); // 👈 Hashing
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json(user);
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ message: 'Registration failed' });
  }
});

module.exports = router;


// ✅ POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // 🔴 If user not found
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please register first.' });
    }

    // 🔐 Password comparison
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // ✅ Successful login
    res.status(200).json({
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email },
    });

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Login failed' });
  }
});


module.exports = router;
