const express = require('express');
const router = express.Router();
const Cart = require('../models/cart.js');

// ✅ Hardcoded user ID for now
const testUserId = '662f1b8e3c8c7e1e94650a20';

// ✅ GET /api/cart → get current cart
router.get('/', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: testUserId }).populate('items.product');
    res.json(cart || { user: testUserId, items: [] });
  } catch (err) {
    console.error(' Failed to fetch cart:', err.message);
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
});

// ✅ POST /api/cart → add product to cart
router.post('/', async (req, res) => {
  const { productId, quantity } = req.body;

  // Manual input validation
  if (!productId || typeof quantity !== 'number' || quantity < 1) {
    console.error(' Invalid input:', req.body);
    return res.status(400).json({
      message: 'Product ID and valid quantity (>= 1) are required'
    });
  }

  try {
    let cart = await Cart.findOne({ user: testUserId });

    if (!cart) {
      // Create a new cart
      cart = await Cart.create({
        user: testUserId,
        items: [{ product: productId, quantity }]
      });
    } else {
      // Update existing cart
      const index = cart.items.findIndex(
        item => item.product.toString() === productId
      );

      if (index !== -1) {
        cart.items[index].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    res.status(200).json(cart);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      console.error(' Cart Validation Error:', messages.join(', '));
      return res.status(400).json({ message: messages.join(', ') });
    }

    console.error(' Cart Save Error:', err.message);
    res.status(500).json({ message: 'Failed to add to cart' });
  }
});

// ✅ DELETE /api/cart/:productId → remove product from cart
router.delete('/:productId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: testUserId });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(
      item => item.product.toString() !== req.params.productId
    );

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(' Failed to remove item from cart:', err.message);
    res.status(500).json({ message: 'Failed to remove item from cart' });
  }
});

// ✅ DELETE /api/cart → clear entire cart
router.delete('/', async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: testUserId });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    console.error(' Failed to clear cart:', err.message);
    res.status(500).json({ message: 'Failed to clear cart' });
  }
});

module.exports = router;
