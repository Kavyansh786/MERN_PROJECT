const mongoose = require('mongoose');
const Product = require('./models/product');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/jewelry_store', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleProducts = [
  {
    name: 'Silver Lotus Necklace',
    description: 'Elegant lotus-inspired pendant with intricate detailing',
    price: 3499,
    originalPrice: 4299,
    category: 'Necklaces',
    material: 'Sterling Silver',
    imageUrl: '/necklace1.jpg',
    stock: 10
  },
  {
    name: 'Gold Chain Pendant',
    description: 'Classic gold chain with elegant pendant design',
    price: 5999,
    originalPrice: 6999,
    category: 'Necklaces',
    material: '18K Gold Plated',
    imageUrl: '/necklace2.jpg',
    stock: 15
  },
  {
    name: 'Rose Gold Ring',
    description: 'Beautiful rose gold ring with diamond accent',
    price: 2499,
    originalPrice: 2999,
    category: 'Rings',
    material: 'Rose Gold',
    imageUrl: '/ring1.jpg',
    stock: 8
  },
  {
    name: 'Pearl Earrings',
    description: 'Elegant freshwater pearl earrings',
    price: 1899,
    originalPrice: 2299,
    category: 'Earrings',
    material: 'Freshwater Pearl',
    imageUrl: '/earrings1.jpg',
    stock: 12
  },
  {
    name: 'Silver Bracelet',
    description: 'Delicate silver bracelet with charm',
    price: 1299,
    originalPrice: 1599,
    category: 'Bracelets',
    material: 'Sterling Silver',
    imageUrl: '/bracelet1.jpg',
    stock: 20
  },
  {
    name: 'Platinum Anklet',
    description: 'Elegant platinum anklet with gemstone',
    price: 3999,
    originalPrice: 4499,
    category: 'Anklets',
    material: 'Platinum',
    imageUrl: '/anklet1.jpg',
    stock: 5
  }
];

async function addSampleProducts() {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Add sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Added ${products.length} sample products`);

    // Log the products
    products.forEach(product => {
      console.log(`- ${product.name}: ₹${product.price} (${product.category}, ${product.material})`);
    });

    mongoose.connection.close();
  } catch (error) {
    console.error('Error adding sample products:', error);
    mongoose.connection.close();
  }
}

addSampleProducts(); 