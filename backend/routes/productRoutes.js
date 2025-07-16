const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../services/productService');

// ✅ GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err.message);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// ✅ GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('Error getting product:', err.message);
    res.status(500).json({ message: 'Failed to get product' });
  }
});

// ✅ POST /api/products
router.post('/', async (req, res) => {
  try {
    const product = await createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    console.error('Product creation error:', err.message);
    res.status(500).json({ message: 'Product creation failed' });
  }
});

// ✅ PATCH /api/products/:id
router.patch('/:id', async (req, res) => {
  try {
    const updated = await updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (err) {
    console.error('Product update error:', err.message);
    res.status(500).json({ message: 'Product update failed' });
  }
});

// ✅ DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await deleteProduct(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Product deletion error:', err.message);
    res.status(500).json({ message: 'Product deletion failed' });
  }
});

module.exports = router;
