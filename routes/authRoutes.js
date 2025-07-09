const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });

    res.status(201).json(user);
  } catch (err) {
    console.error('Registration error:', err.message);
    // If it's a Mongoose validation error:
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Registration failed' });
  }
});


module.exports = router;
