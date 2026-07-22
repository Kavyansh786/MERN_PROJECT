const mongoose = require('mongoose');
const Product = require('./models/product');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/aurea')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function migrateSeasonalProducts() {
  try {
    console.log('Starting migration of seasonal products...');
    
    // Find all products with old seasonal categoryPage values
    const oldSeasonalPages = ['diwali', 'raksha-bandhan-2024', 'christmas', 'new-year', 'valentines-day', 'mothers-day', 'black-friday', 'independence-day', 'summer-sale', 'winter-collection'];
    
    const productsToUpdate = await Product.find({
      categoryPage: { $in: oldSeasonalPages }
    });
    
    console.log(`Found ${productsToUpdate.length} products with old seasonal categoryPage values`);
    
    if (productsToUpdate.length > 0) {
      // Update all these products to use 'seasonal' categoryPage
      const result = await Product.updateMany(
        { categoryPage: { $in: oldSeasonalPages } },
        { $set: { categoryPage: 'seasonal' } }
      );
      
      console.log(`Updated ${result.modifiedCount} products to use 'seasonal' categoryPage`);
      
      // Show updated products
      const updatedProducts = await Product.find({ categoryPage: 'seasonal' });
      console.log(`Total products with 'seasonal' categoryPage: ${updatedProducts.length}`);
      
      updatedProducts.forEach(product => {
        console.log(`- ${product.name} (SKU: ${product.sku})`);
      });
    } else {
      console.log('No products found with old seasonal categoryPage values');
    }
    
    // Show current categoryPage distribution
    console.log('\nCurrent categoryPage distribution:');
    const allProducts = await Product.find({});
    const distribution = allProducts.reduce((acc, product) => {
      acc[product.categoryPage] = (acc[product.categoryPage] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(distribution).forEach(([categoryPage, count]) => {
      console.log(`${categoryPage}: ${count} products`);
    });
    
    console.log('\nMigration completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

migrateSeasonalProducts();
