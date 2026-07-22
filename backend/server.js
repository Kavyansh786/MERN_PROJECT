// Load environment variables
require('dotenv').config();


// Now require other dependencies
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { initializePassport, getPassport } = require('./config/passport');
const connectDB = require('./db/connect.js');

// Initialize express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:1512', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Serve static files for uploads
app.use('/uploads', express.static('uploads'));

// Session middleware for passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// Initialize Passport and get the instance
const { passport } = require('./config/passport');

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', require('./routes/authRoutes.js'));
app.use('/api/users', require('./routes/userRoutes.js'));
app.use('/api/products', require('./routes/productRoutes.js'));
app.use('/api/orders', require('./routes/orderRoutes.js'));
app.use('/api/cart', require('./routes/cartRoutes.js'));
app.use('/api/payment',require('./routes/payment.js'));
app.use('/api/address', require('./routes/addressRoutes.js'));
app.use('/api/reviews', require('./routes/reviewRoutes.js'));
app.use('/api/inventory', require('./routes/inventoryRoutes.js'));
app.use('/api/coupons', require('./routes/couponRoutes.js'));
app.use('/api/reports', require('./routes/reportRoutes.js'));
app.use('/api/chatbot', require('./routes/chatbot.js'));
app.use('/api/chatbot-training', require('./routes/chatbotTraining.js'));
app.use('/api/virtual-tryon', require('./routes/virtualTryOn.js'));
app.use('/api/seasonal-page', require('./routes/seasonalPage.js'));
app.use('/api/bulk-upload', require('./routes/bulkUpload.js'));
app.use('/api/settings', require('./routes/settingsRoutes.js'));

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
