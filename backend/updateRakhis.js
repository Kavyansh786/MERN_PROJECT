const mongoose = require('mongoose');
const Product = require('./models/product');
const connectDB = require('./db/connect');

async function updateExistingRakhis() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Find all existing rakhis
    const existingRakhis = await Product.find({ category: 'rakhi' });
    console.log(`Found ${existingRakhis.length} existing rakhis`);

    // Update each rakhi with missing fields
    for (const rakhi of existingRakhis) {
      const updates = {};

      // Add material if missing
      if (!rakhi.material) {
        updates.material = rakhi.name.toLowerCase().includes('silk') ? 'Silk' : 'Cotton';
      }

      // Add currentStock if missing
      if (rakhi.currentStock === undefined) {
        updates.currentStock = Math.floor(Math.random() * 50) + 20; // Random stock between 20-70
      }

      // Add reserved if missing
      if (rakhi.reserved === undefined) {
        updates.reserved = 0;
      }

      // Add SKU if missing
      if (!rakhi.sku) {
        const designNumber = rakhi.name.match(/\d+/)?.[0] || '001';
        updates.sku = `RAKHI-${designNumber.padStart(3, '0')}`;
      }

      // Add isFeatured if missing
      if (rakhi.isFeatured === undefined) {
        updates.isFeatured = rakhi.price > 400; // Premium rakhis as featured
      }

      // Add isNewArrival if missing
      if (rakhi.isNewArrival === undefined) {
        updates.isNewArrival = false; // Set to false for existing products
      }

      // Add categoryPage if missing
      if (!rakhi.categoryPage) {
        updates.categoryPage = 'raksha-bandhan';
      }

      // Add isRakhi if missing
      if (rakhi.isRakhi === undefined) {
        updates.isRakhi = true;
      }

      // Add rakhiType if missing
      if (!rakhi.rakhiType) {
        if (rakhi.price > 500) {
          updates.rakhiType = 'premium';
        } else if (rakhi.name.toLowerCase().includes('designer')) {
          updates.rakhiType = 'designer';
        } else {
          updates.rakhiType = 'traditional';
        }
      }

      // Update the product if there are changes
      if (Object.keys(updates).length > 0) {
        await Product.findByIdAndUpdate(rakhi._id, updates);
        console.log(`Updated rakhi: ${rakhi.name}`);
      }
    }

    console.log('All rakhis updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating rakhis:', error);
    process.exit(1);
  }
}

// Run the update
updateExistingRakhis(); 