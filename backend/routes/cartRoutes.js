const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/user');
const mongoose = require('mongoose');

// GET: Get cart for user
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId }).populate('items.product');
    if (!cart) return res.status(200).json({ items: [] }); // Empty cart fallback
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching cart', error });
  }
});

// POST: Add item to cart or update quantity if already exists
router.post('/', async (req, res) => {
  try {
    const { user, productId, quantity } = req.body;

    if (!user || !productId || !quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'User ID, Product ID, and valid quantity (>= 1) are required'
      });
    }

    let cart = await Cart.findOne({ user });

    if (!cart) {
      cart = new Cart({ user, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    const populatedCart = await cart.populate('items.product');
    res.status(200).json({ success: true, cart: populatedCart });
  } catch (error) {
    console.error('Error saving cart:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// PUT: Update quantity of a product in cart
router.put('/:userId/update', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Valid product ID and quantity required' });
    }

    const cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ success: false, message: 'Product not in cart' });

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    const populatedCart = await cart.populate('items.product');
    res.status(200).json({ success: true, cart: populatedCart });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating cart', error: err });
  }
});

// DELETE: Remove item from cart
router.delete('/:userId/remove/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const cart = await Cart.findOne({ user: userId });

    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    const populatedCart = await cart.populate('items.product');
    res.status(200).json({ success: true, cart: populatedCart });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error removing item', error: err });
  }
});

module.exports = router;
