const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db/connect.js');
const cors = require('cors');

// Initialize express app FIRST ✅
const app = express();

// Load .env
dotenv.config();

// Connect to MongoDB
connectDB();

// CORS and JSON middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes.js'));
console.log(' Loading user routes');

app.use('/api/users', require('./routes/userRoutes.js'));
app.use('/api/products', require('./routes/productRoutes.js'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
