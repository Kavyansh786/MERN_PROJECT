const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./db/connect.js');

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:1512', 'http://localhost:5173'], // frontend URLs
  credentials: true // allows sending cookies
}));
app.use(express.json());
app.use(cookieParser()); // for parsing cookies

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

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
