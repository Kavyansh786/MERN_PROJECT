const mongoose = require('mongoose');
const Order = require('./models/order');
const Product = require('./models/product');
const User = require('./models/user');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const addSampleReportsData = async () => {
  try {
    console.log('Adding sample reports data...');

    // Get existing products and users
    const products = await Product.find();
    const users = await User.find();

    if (products.length === 0 || users.length === 0) {
      console.log('Please add some products and users first');
      return;
    }

    // Create sample orders for the last 6 months
    const sampleOrders = [];
    const months = [0, 1, 2, 3, 4, 5]; // Last 6 months
    const orderStatuses = ['Delivered', 'Processing', 'Shipped'];

    for (let month of months) {
      const date = new Date();
      date.setMonth(date.getMonth() - month);
      
      // Create 5-15 orders per month
      const ordersThisMonth = Math.floor(Math.random() * 10) + 5;
      
      for (let i = 0; i < ordersThisMonth; i++) {
        const orderDate = new Date(date);
        orderDate.setDate(Math.floor(Math.random() * 28) + 1);
        orderDate.setHours(Math.floor(Math.random() * 24));
        orderDate.setMinutes(Math.floor(Math.random() * 60));

        // Random user and products
        const user = users[Math.floor(Math.random() * users.length)];
        const numProducts = Math.floor(Math.random() * 3) + 1;
        const orderItems = [];
        let totalPrice = 0;

        for (let j = 0; j < numProducts; j++) {
          const product = products[Math.floor(Math.random() * products.length)];
          const quantity = Math.floor(Math.random() * 3) + 1;
          orderItems.push({
            product: product._id,
            quantity: quantity
          });
          totalPrice += product.price * quantity;
        }

        sampleOrders.push({
          user: user._id,
          orderItems: orderItems,
          shippingAddress: {
            street: 'Sample Street',
            city: 'Sample City',
            state: 'Sample State',
            zipCode: '123456',
            country: 'India'
          },
          paymentMethod: 'Online',
          totalPrice: totalPrice,
          originalPrice: totalPrice,
          discountAmount: 0,
          paymentStatus: 'Completed',
          orderStatus: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
          createdAt: orderDate
        });
      }
    }

    // Insert sample orders
    await Order.insertMany(sampleOrders);
    console.log(`Added ${sampleOrders.length} sample orders`);

    // Create some recent customers (last 30 days)
    const recentCustomers = [];
    for (let i = 0; i < 5; i++) {
      const customerDate = new Date();
      customerDate.setDate(customerDate.getDate() - Math.floor(Math.random() * 30));
      
      recentCustomers.push({
        name: `Customer ${i + 1}`,
        email: `customer${i + 1}@example.com`,
        password: 'password123',
        phone: `98765432${i.toString().padStart(2, '0')}`,
        createdAt: customerDate
      });
    }

    await User.insertMany(recentCustomers);
    console.log(`Added ${recentCustomers.length} recent customers`);

    console.log('Sample reports data added successfully!');
    console.log('You can now view the Reports page to see the analytics.');

  } catch (error) {
    console.error('Error adding sample reports data:', error);
  } finally {
    mongoose.connection.close();
  }
};

addSampleReportsData(); 