const express = require('express');
const router = express.Router();

const Product = require('../models/product');
const Order = require('../models/order');
const Coupon = require('../models/coupon');

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

    const { orderItems, shippingAddress, paymentMethod, totalPrice, originalPrice, discountAmount, couponCode } = req.body;

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
      originalPrice: originalPrice || calculatedTotalPrice,
      discountAmount: discountAmount || 0,
      couponCode: couponCode || null,
      paymentStatus: 'Pending',
      orderStatus: 'Processing'
    });

    // If a coupon was used, increment its usage count
    if (couponCode && discountAmount > 0) {
      try {
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
        if (coupon) {
          coupon.usage += 1;
          await coupon.save();
          console.log(`Coupon ${couponCode} usage incremented to ${coupon.usage}`);
        }
      } catch (couponError) {
        console.error('Error incrementing coupon usage:', couponError.message);
        // Don't fail the order creation if coupon update fails
      }
    }

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

// GET /api/orders - Get all orders (for admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('orderItems.product', 'name price imageUrl')
      .sort({ createdAt: -1 }); // Most recent first
    res.json({ success: true, orders });
  } catch (err) {
    console.error('Error fetching all orders:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
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

// PUT /api/orders/:id/cancel - Cancel a specific order
router.put('/:id/cancel', async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.query.userId || req.headers['user-id'];
    const isAdmin = req.query.admin === 'true' || req.headers['admin'] === 'true';

    let order;
    if (isAdmin) {
      // Admin can cancel any order
      order = await Order.findById(orderId);
    } else {
      // Regular user can only cancel their own orders
      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          message: 'User ID is required' 
        });
      }
      order = await Order.findOne({ _id: orderId, user: userId });
    }

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Check if order can be cancelled
    if (order.orderStatus === 'Cancelled') {
      return res.status(400).json({ 
        success: false, 
        message: 'Order is already cancelled' 
      });
    }

    if (order.orderStatus === 'Delivered') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot cancel a delivered order' 
      });
    }

    // Update order status to cancelled
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: 'Cancelled' },
      { new: true }
    ).populate('orderItems.product', 'name price imageUrl');

    // If order had a coupon, decrement its usage count
    if (order.couponCode && order.discountAmount > 0) {
      try {
        const coupon = await Coupon.findOne({ code: order.couponCode.toUpperCase() });
        if (coupon && coupon.usage > 0) {
          coupon.usage -= 1;
          await coupon.save();
          console.log(`Coupon ${order.couponCode} usage decremented to ${coupon.usage}`);
        }
      } catch (couponError) {
        console.error('Error decrementing coupon usage:', couponError.message);
        // Don't fail the cancellation if coupon update fails
      }
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order: updatedOrder
    });
  } catch (err) {
    console.error('Error cancelling order:', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to cancel order'
    });
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
