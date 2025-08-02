const mongoose = require('mongoose');
const Product = require('./models/product');
const fs = require('fs');
const path = require('path');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/aaika-jewellery', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB successfully!');
  
  try {
    // Array of all product files
    const productFiles = [
      'rings-products.json',
      'necklaces-products.json',
      'earrings-products.json',
      'bracelets-products.json',
      'birthday-gifts-products.json'
    ];

    let totalProductsAdded = 0;

    for (const fileName of productFiles) {
      const filePath = path.join(__dirname, '..', fileName);
      
      if (fs.existsSync(filePath)) {
        console.log(`\n📁 Processing ${fileName}...`);
        const products = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        console.log(`Found ${products.length} products in ${fileName}`);
        
        for (const productData of products) {
          try {
            // Check if product with this SKU already exists
            const existingProduct = await Product.findOne({ sku: productData.sku });
            
            if (existingProduct) {
              console.log(`⚠️  Product with SKU ${productData.sku} already exists, skipping...`);
              continue;
            }
            
            // Create new product
            const product = new Product(productData);
            await product.save();
            console.log(`✅ Added: ${productData.name} (${productData.categoryPage})`);
            totalProductsAdded++;
            
          } catch (error) {
            console.error(`❌ Error adding product ${productData.name}:`, error.message);
          }
        }
      } else {
        console.log(`⚠️  File ${fileName} not found, skipping...`);
      }
    }
    
    // Get total count
    const totalProducts = await Product.countDocuments();
    console.log(`\n🎉 Successfully added ${totalProductsAdded} new products!`);
    console.log(`📊 Database now contains ${totalProducts} total products!`);
    
    // Show breakdown by category page
    console.log('\n📈 Products by Category Page:');
    const categoryBreakdown = await Product.aggregate([
      { $group: { _id: '$categoryPage', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    categoryBreakdown.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} products`);
    });
    
  } catch (error) {
    console.error('Error processing products:', error);
  } finally {
    // Close database connection
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}); 