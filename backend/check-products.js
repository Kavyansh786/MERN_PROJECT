const mongoose = require('mongoose');
const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/aurea')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function checkAndFixProducts() {
  try {
    // Check all products
    const allProducts = await Product.find({});
    console.log(`Total products in database: ${allProducts.length}`);
    
    // Group by categoryPage
    const grouped = allProducts.reduce((acc, product) => {
      acc[product.categoryPage] = (acc[product.categoryPage] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\nProducts by categoryPage:');
    Object.entries(grouped).forEach(([categoryPage, count]) => {
      console.log(`  ${categoryPage}: ${count} products`);
    });
    
    // Find products with old seasonal categoryPage values
    const oldSeasonalValues = ['diwali', 'christmas', 'new-year', 'valentines-day', 'mothers-day', 'black-friday', 'independence-day', 'summer-sale', 'winter-collection', 'raksha-bandhan-2024'];
    const oldSeasonalProducts = await Product.find({
      categoryPage: { $in: oldSeasonalValues }
    });
    
    if (oldSeasonalProducts.length > 0) {
      console.log(`\nFound ${oldSeasonalProducts.length} products with old seasonal categoryPage values:`);
      oldSeasonalProducts.forEach(product => {
        console.log(`  - ${product.name} (${product.categoryPage})`);
      });
      
      // Update them to 'seasonal'
      const updateResult = await Product.updateMany(
        { categoryPage: { $in: oldSeasonalValues } },
        { $set: { categoryPage: 'seasonal' } }
      );
      
      console.log(`\nUpdated ${updateResult.modifiedCount} products to use 'seasonal' categoryPage`);
    }
    
    // Show final count of seasonal products
    const seasonalProducts = await Product.find({ categoryPage: 'seasonal' });
    console.log(`\nFinal count of seasonal products: ${seasonalProducts.length}`);
    
    if (seasonalProducts.length > 0) {
      console.log('Seasonal products:');
      seasonalProducts.forEach(product => {
        console.log(`  - ${product.name} (SKU: ${product.sku})`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkAndFixProducts();
