const express = require('express');
const router = express.Router();
const {
  getAllInventory,
  updateStock,
  getLowStockProducts
} = require('../services/inventoryService');

// GET /api/inventory - Get all inventory
router.get('/', async (req, res) => {
  try {
    const inventory = await getAllInventory();
    res.json(inventory);
  } catch (err) {
    console.error('Failed to fetch inventory:', err.message);
    res.status(500).json({ message: 'Failed to fetch inventory' });
  }
});

// GET /api/inventory/low-stock - Get low stock products
router.get('/low-stock', async (req, res) => {
  try {
    const lowStockProducts = await getLowStockProducts();
    res.json(lowStockProducts);
  } catch (err) {
    console.error('Failed to fetch low stock products:', err.message);
    res.status(500).json({ message: 'Failed to fetch low stock products' });
  }
});

// PATCH /api/inventory/:productId - Update stock for a product
router.patch('/:productId', async (req, res) => {
  try {
    const { currentStock, reserved } = req.body;
    const { productId } = req.params;

    if (currentStock === undefined || reserved === undefined) {
      return res.status(400).json({ message: 'Current stock and reserved are required' });
    }

    const updatedProduct = await updateStock(productId, currentStock, reserved);
    res.json(updatedProduct);
  } catch (err) {
    console.error('Failed to update stock:', err.message);
    res.status(500).json({ message: err.message || 'Failed to update stock' });
  }
});

module.exports = router; 