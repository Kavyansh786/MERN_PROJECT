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

const seedProducts = async () => {
  try {
    await connectDB();
    
    // Sample anniversary products - add more as needed
    const anniversaryProducts = [
      {
        sku: "AN001",
        name: "Anniversary Jewel 1",
        category: "Anniversary",
        price: 3014,
        material: "Sterling Silver",
        stone: "Ruby",
        description: "Elegant anniversary jewelry piece number 1, ideal for commemorating love.",
        imageUrl: "https://example.com/images/anniversary_1.jpg",
        isPersonalized: true,
        customizationOptions: {
          engraving: true,
          fontStyle: ["Italic", "Elegant"],
          nameText: true,
          metalFinish: ["Gold", "White Gold"]
        },
        inStock: true,
        currentStock: 59,
        reserved: 1,
        isRakhi: false,
        isFeatured: false,
        isNewArrival: false,
        categoryPage: "anniversary",
        createdAt: new Date("2025-08-01T00:00:00")
      },
      {
        sku: "AN002",
        name: "Anniversary Jewel 2",
        category: "Anniversary",
        price: 3029,
        material: "Platinum Plated",
        stone: "Ruby",
        description: "Elegant anniversary jewelry piece number 2, ideal for commemorating love.",
        imageUrl: "https://example.com/images/anniversary_2.jpg",
        isPersonalized: false,
        customizationOptions: {
          engraving: false,
          fontStyle: [],
          nameText: false,
          metalFinish: []
        },
        inStock: true,
        currentStock: 58,
        reserved: 2,
        isRakhi: false,
        isFeatured: false,
        isNewArrival: false,
        categoryPage: "anniversary",
        createdAt: new Date("2025-08-01T00:00:00")
      }
    ];

    // Clear existing anniversary products
    await Product.deleteMany({ category: 'Anniversary' });
    console.log('Cleared existing anniversary products');

    // Insert new products
    const result = await Product.insertMany(anniversaryProducts);
    console.log(`Successfully seeded ${result.length} anniversary products`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
