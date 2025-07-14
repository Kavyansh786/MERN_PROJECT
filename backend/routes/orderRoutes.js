const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Hardcoded user ID for now (until auth is added)
const testUserId = '662f1b8e3c8c7e1e94650a20';

// ✅ POST /api/orders → Create Order
router.post('/', async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  // Manual input validation
  if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
    return res.status(400).json({ message: 'At least one order item is required' });
  }

  for (const item of orderItems) {
    if (!item.product || typeof item.quantity !== 'number' || item.quantity < 1) {
      return res.status(400).json({
        message: 'Each item must have a valid product ID and quantity >= 1'
      });
    }
  }

  if (!shippingAddress || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
    return res.status(400).json({
      message: 'Shipping address must include city, postalCode, and country'
    });
  }

  try {
    const newOrder = await Order.create({
      user: testUserId,
      orderItems,
      shippingAddress,
      paymentMethod,
    });

    res.status(201).json(newOrder);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    res.status(500).json({ message: 'Failed to create order' });
  }
});

// ✅ GET /api/orders/my → Get orders for current user
router.get('/my', async (req, res) => {
  try {
    const orders = await Order.find({ user: testUserId }).populate('orderItems.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get user orders' });
  }
});

// ✅ GET /api/orders → Get all orders (admin only later)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get all orders' });
  }
});

// ✅ PATCH /api/orders/:id → Update order status
router.patch('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Optional: Validate allowed statuses
    const allowedStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    const newStatus = req.body.orderStatus;

    if (newStatus && !allowedStatuses.includes(newStatus)) {
      return res.status(400).json({ message: 'Invalid order status value' });
    }

    order.orderStatus = newStatus || order.orderStatus;

    if (order.orderStatus === 'Delivered') {
      order.deliveredAt = new Date();
    }

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

module.exports = router;
