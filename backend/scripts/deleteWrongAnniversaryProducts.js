const mongoose = require('mongoose');
const Product = require('../models/product');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/mern-ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const deleteWrongAnniversaryProducts = async () => {
  try {
    await connectDB();
    
    // Delete products with categoryPage: "anniversary" (wrong value)
    const result = await Product.deleteMany({ 
      category: 'Anniversary',
      categoryPage: 'anniversary'  // Delete products with wrong categoryPage
    });
    
    console.log(`Successfully deleted ${result.deletedCount} anniversary products with wrong categoryPage`);
    
    // Show remaining anniversary products
    const remaining = await Product.find({ category: 'Anniversary' });
    console.log(`Remaining anniversary products: ${remaining.length}`);
    
    if (remaining.length > 0) {
      console.log('Remaining products categoryPage values:');
      remaining.forEach(product => {
        console.log(`- ${product.name}: categoryPage = "${product.categoryPage}"`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error deleting products:', error);
    process.exit(1);
  }
};

deleteWrongAnniversaryProducts();
