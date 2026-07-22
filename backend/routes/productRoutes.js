const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../services/productService');

// ✅ GET /api/products/search?q=query
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.json([]);
    }
    
    const products = await getAllProducts();
    
    // Search in name, description, category, and tags
    const searchResults = products.filter(product => {
      const searchTerm = q.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.categoryPage.toLowerCase().includes(searchTerm) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
      );
    });
    
    // Limit to 10 results for performance
    res.json(searchResults.slice(0, 10));
  } catch (err) {
    console.error('Error searching products:', err.message);
    res.status(500).json({ message: 'Search failed' });
  }
});

// ✅ GET /api/products
router.get('/', async (req, res) => {
  try {
    const { categoryPage, category } = req.query;
    let products = await getAllProducts();
    
    // Filter by categoryPage if provided
    if (categoryPage) {
      products = products.filter(product => product.categoryPage === categoryPage);
    }
    
    // Filter by category if provided
    if (category) {
      products = products.filter(product => product.category === category);
    }
    
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
    console.log('Received product creation request:', JSON.stringify(req.body, null, 2));
    const product = await createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    console.error('Product creation error:', err.message);
    res.status(500).json({ message: err.message });
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
