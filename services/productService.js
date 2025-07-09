const Product = require('./models/Product');

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
    return await Product.create(data);
  } catch (error) {
    throw new Error('Product creation failed');
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
