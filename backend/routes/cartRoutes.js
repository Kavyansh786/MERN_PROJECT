const express = require('express');
const router = express.Router();
const Cart = require('../models/cart.js');

// ✅ GET /api/cart?userId=...
router.get('/', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    res.json(cart || { user: userId, items: [] });
  } catch (err) {
    console.error('Failed to fetch cart:', err.message);
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
});

// ✅ POST /api/cart?userId=...
router.post('/', async (req, res) => {
  const { userId } = req.query;
  const { productId, quantity } = req.body;

  if (!userId || !productId || typeof quantity !== 'number' || quantity < 1) {
    return res.status(400).json({
      message: 'User ID, Product ID, and valid quantity (>= 1) are required'
    });
  }

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity }]
      });
    } else {
      const index = cart.items.findIndex(item => item.product.toString() === productId);
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
      console.error('Cart Validation Error:', messages.join(', '));
      return res.status(400).json({ message: messages.join(', ') });
    }

    console.error('Cart Save Error:', err.message);
    res.status(500).json({ message: 'Failed to add to cart' });
  }
});

// ✅ DELETE /api/cart/:productId?userId=...
router.delete('/:productId', async (req, res) => {
  const { userId } = req.query;
  const { productId } = req.params;

  if (!userId) return res.status(400).json({ message: 'User ID is required' });

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();

    res.json(cart);
  } catch (err) {
    console.error('Failed to remove item from cart:', err.message);
    res.status(500).json({ message: 'Failed to remove item from cart' });
  }
});

// ✅ DELETE /api/cart?userId=...
router.delete('/', async (req, res) => {
  const { userId } = req.query;

  if (!userId) return res.status(400).json({ message: 'User ID is required' });

  try {
    await Cart.findOneAndDelete({ user: userId });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    console.error('Failed to clear cart:', err.message);
    res.status(500).json({ message: 'Failed to clear cart' });
  }
});

module.exports = router;
