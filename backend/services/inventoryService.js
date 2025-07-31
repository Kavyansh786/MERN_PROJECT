const Product = require('../models/product');

// Get all products with inventory info
async function getAllInventory() {
  return await Product.find().select('name sku currentStock reserved available category');
}

// Update stock for a product
async function updateStock(productId, currentStock, reserved) {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  // Validate stock values
  if (currentStock < 0 || reserved < 0) {
    throw new Error('Stock values cannot be negative');
  }

  if (reserved > currentStock) {
    throw new Error('Reserved stock cannot exceed current stock');
  }

  product.currentStock = currentStock;
  product.reserved = reserved;
  
  return await product.save();
}

// Get low stock products (less than 10 available)
async function getLowStockProducts() {
  return await Product.find({
    $expr: {
      $lt: [
        { $subtract: ['$currentStock', '$reserved'] },
        10
      ]
    }
  }).select('name sku currentStock reserved available category');
}

// Generate SKU
function generateSKU(category, productId) {
  const categoryCode = category.substring(0, 3).toUpperCase();
  const idCode = productId.toString().slice(-4);
  return `${categoryCode}-${idCode}`;
}

module.exports = {
  getAllInventory,
  updateStock,
  getLowStockProducts,
  generateSKU
}; 