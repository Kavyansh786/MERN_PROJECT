const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { passport } = require('../config/passport');
const { generateOTP } = require('../utils/otp');
const { sendOTPEmail } = require('../config/nodemailer');
const { 
  SecurityMiddleware, 
  rateLimiters, 
  validateRegistration, 
  validateLogin 
} = require('../utils/validation');

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// ✅ POST /api/auth/register - Customer registration with OTP
router.post('/register', 
  rateLimiters.register,
  SecurityMiddleware.validateSecurity,
  SecurityMiddleware.sanitizeInput,
  validateRegistration,
  async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    let user = await User.findOne({ email });

    if (user && user.isEmailVerified) {
      return res.status(400).json({ message: 'User already exists and is verified.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (user && !user.isEmailVerified) {
      // Update existing unverified user
      user.name = name;
      user.phone = phone;
      user.password = hashedPassword;
    } else {
      // Create new user
      user = new User({ name, email, phone, password: hashedPassword });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();
    
    try {
      await sendOTPEmail(user.email, otp);
      console.log(`✅ User registered and OTP sent to: ${user.email}`);
      
      res.status(201).json({
        message: 'Registration successful. Please check your email for the OTP.',
        user: { id: user._id, email: user.email }
      });
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError.message);
      
      // If email fails, still allow user to proceed but inform them
      res.status(201).json({
        message: 'Registration successful, but email could not be sent. Please contact support for manual verification.',
        user: { id: user._id, email: user.email },
        emailError: true
      });
    }

  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ message: 'Registration failed: ' + err.message });
  }
});

// ✅ POST /api/auth/login - Customer login with JWT
router.post('/login',
  rateLimiters.login,
  SecurityMiddleware.validateSecurity,
  SecurityMiddleware.sanitizeInput,
  validateLogin,
  async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found. Please register first.' });

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: 'Email not verified. Please verify your email first.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: 'customer' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: 'customer' }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Login failed' });
  }
});

// ✅ POST /api/auth/verify-otp - Verify OTP and activate account
router.post('/verify-otp',
  rateLimiters.otp,
  SecurityMiddleware.validateSecurity,
  SecurityMiddleware.sanitizeInput,
  async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT token upon successful verification
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: 'customer' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Email verified successfully. You are now logged in.',
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: 'customer' }
    });

  } catch (err) {
    console.error('OTP verification error:', err.message);
    res.status(500).json({ message: 'OTP verification failed.' });
  }
});

// ✅ POST /api/auth/send-otp - Resend OTP
router.post('/send-otp',
  rateLimiters.otp,
  SecurityMiddleware.validateSecurity,
  SecurityMiddleware.sanitizeInput,
  async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email is already verified.' });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await sendOTPEmail(user.email, otp);

    res.status(200).json({ message: 'New OTP sent to your email.' });

  } catch (err) {
    console.error('Send OTP error:', err.message);
    res.status(500).json({ message: 'Failed to send OTP.' });
  }
});

// ✅ POST /api/auth/admin/login - Admin login (Hybrid: Demo + Database)
router.post('/admin/login',
  rateLimiters.login,
  SecurityMiddleware.validateSecurity,
  SecurityMiddleware.sanitizeInput,
  validateLogin,
  async (req, res) => {
  const { email, password } = req.body;

  try {
    // Option 1: Check hardcoded demo admin credentials
    const demoAdminCredentials = {
      email: 'admin@jewelry.com',
      password: 'admin123'
    };

    // Check demo credentials first
    if (email === demoAdminCredentials.email && password === demoAdminCredentials.password) {
      const token = jwt.sign(
        { userId: 'demo-admin', email: email, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        message: 'Admin login successful',
        token,
        user: { id: 'demo-admin', name: 'Demo Admin', email: email, role: 'admin' }
      });
    }

    // Option 2: Check database for admin users
    const adminUser = await User.findOne({ email, isAdmin: true });
    if (adminUser) {
      const isMatch = await bcrypt.compare(password, adminUser.password);
      if (isMatch) {
        const token = jwt.sign(
          { userId: adminUser._id, email: adminUser.email, role: 'admin' },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        return res.status(200).json({
          message: 'Admin login successful',
          token,
          user: { 
            id: adminUser._id, 
            name: adminUser.name, 
            email: adminUser.email, 
            phone: adminUser.phone,
            role: 'admin' 
          }
        });
      }
    }

    // If neither demo nor database admin found/matched
    res.status(401).json({ message: 'Invalid admin credentials' });
    
  } catch (err) {
    console.error('Admin login error:', err.message);
    res.status(500).json({ message: 'Admin login failed' });
  }
});

// ✅ Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

// ✅ Middleware to verify admin role
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
};

// ✅ GET /api/auth/verify - Verify token and get user info
router.get('/verify', verifyToken, (req, res) => {
  res.status(200).json({
    message: 'Token is valid',
    user: req.user
  });
});

// ✅ GET /api/auth/admin/verify - Verify admin token
router.get('/admin/verify', verifyToken, verifyAdmin, (req, res) => {
  res.status(200).json({
    message: 'Admin token is valid',
    user: req.user
  });
});

// ✅ Google OAuth Routes
// Initiate Google OAuth
router.get('/google',
  passport.authenticate('google', { 
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] 
  })
);

// Google OAuth callback
router.get('/google/callback',
  (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
      if (err) {
        console.error('Google OAuth authentication error:', err);
        return res.redirect('http://localhost:1512/login?error=oauth_failed');
      }
      
      if (!user) {
        console.error('Google OAuth: No user returned', info);
        return res.redirect('http://localhost:1512/login?error=oauth_failed');
      }
      
      req.user = user;
      next();
    })(req, res, next);
  },
  async (req, res) => {
    try {
      const user = req.user;
      console.log('Google OAuth callback success for user:', user.email);
      
      if (!user) {
        console.error('No user found in callback');
        return res.redirect('http://localhost:1512/login?error=oauth_failed');
      }
      
      // Check if user's email is verified
      if (!user.isEmailVerified) {
        console.log('Google user needs OTP verification:', user.email);
        // Redirect to OTP verification page for unverified Google users
        return res.redirect(`http://localhost:1512/verify-otp?email=${encodeURIComponent(user.email)}&source=google`);
      }
      
      // Generate JWT token for verified Google user
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: 'customer' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      console.log('Generated token for verified Google user:', user.email);
      
      // Redirect to frontend with token for verified users
      res.redirect(`http://localhost:1512/auth/google/success?token=${token}&user=${encodeURIComponent(JSON.stringify({
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: 'customer'
      }))}`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect('http://localhost:1512/login?error=oauth_failed');
    }
  }
);

// Export middleware functions for use in other routes
router.verifyToken = verifyToken;
router.verifyAdmin = verifyAdmin;

module.exports = router;
