const express = require('express');
const router = express.Router();

const Product = require('../models/product');
const Order = require('../models/order');

// POST /api/orders
router.post('/', async (req, res) => {
  const testUserId = '662f1b8e3c8c7e1e94650a20'; // Replace with your test user
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    // Calculate total price
    let totalPrice = 0;

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: 'Invalid product ID in order' });
      }

      totalPrice += product.price * item.quantity;
    }

    const newOrder = await Order.create({
      user: testUserId,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: 'Pending',
      orderStatus: 'Processing'
    });

    res.status(201).json(newOrder);
  } catch (err) {
    console.error('Order creation error:', err.message);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

module.exports = router;
