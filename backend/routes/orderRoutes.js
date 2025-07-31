const express = require('express');
const router = express.Router();

const Product = require('../models/product');
const Order = require('../models/order');

// POST /api/orders
router.post('/', async (req, res) => {
  try {
    // Get user ID from request body or headers
    const userId = req.body.userId || req.headers['user-id'];
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    const { orderItems, shippingAddress, paymentMethod, totalPrice, couponCode } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Calculate total price if not provided
    let calculatedTotalPrice = totalPrice || 0;

    if (!calculatedTotalPrice) {
      for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(400).json({ 
            success: false,
            message: 'Invalid product ID in order' 
          });
        }
        calculatedTotalPrice += product.price * item.quantity;
      }
    }

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.city || !shippingAddress.postalCode) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid shipping address' 
      });
    }

    const newOrder = await Order.create({
      user: userId,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice: calculatedTotalPrice,
      paymentStatus: 'Pending',
      orderStatus: 'Processing'
    });



    res.status(201).json({
      success: true,
      order: newOrder
    });
  } catch (err) {
    console.error('Order creation error:', err.message);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create order'
    });
  }
});

// GET /api/orders/my - Get user's orders
router.get('/my', async (req, res) => {
  try {
    // Get user ID from query parameter or header
    const userId = req.query.userId || req.headers['user-id'];
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    const orders = await Order.find({ user: userId })
      .populate('orderItems.product', 'name price imageUrl')
      .sort({ createdAt: -1 }); // Most recent first

    res.status(200).json({
      success: true,
      orders: orders
    });
  } catch (err) {
    console.error('Error fetching orders:', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch orders'
    });
  }
});

// GET /api/orders/:id - Get specific order
router.get('/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.query.userId || req.headers['user-id'];

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    const order = await Order.findOne({ _id: orderId, user: userId })
      .populate('orderItems.product', 'name price imageUrl');

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    res.status(200).json({
      success: true,
      order: order
    });
  } catch (err) {
    console.error('Error fetching order:', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch order'
    });
  }
});

// GET /api/orders - Get all orders (for admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});
// PATCH /api/orders/:id - Update order status or other fields
router.patch('/:id', async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Order not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Order update failed' });
  }
});

module.exports = router;
