const Product = require('../models/product');

async function getAllProducts() {
  try {
    return await Product.find();
  } catch (error) {
    throw new Error('Could not fetch products');
  }
}

async function getProductById(id) {
  try {
    return await Product.findById(id);
  } catch (error) {
    throw new Error('Product not found');
  }
}

async function createProduct(data) {
  try {
    console.log('Creating product with data:', JSON.stringify(data, null, 2));
    const product = await Product.create(data);
    console.log('Product created successfully:', product._id);
    return product;
  } catch (error) {
    console.error('Product creation error details:', error.message);
    if (error.code === 11000) {
      throw new Error(`Product with SKU ${data.sku} already exists`);
    }
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }
    throw new Error(`Product creation failed: ${error.message}`);
  }
}

async function updateProduct(id, updates) {
  try {
    return await Product.findByIdAndUpdate(id, updates, { new: true });
  } catch (error) {
    throw new Error('Product update failed');
  }
}

async function deleteProduct(id) {
  try {
    return await Product.findByIdAndDelete(id);
  } catch (error) {
    throw new Error('Product deletion failed');
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
