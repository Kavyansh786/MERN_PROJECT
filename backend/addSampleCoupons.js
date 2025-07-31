const mongoose = require('mongoose');
const Coupon = require('./models/coupon');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jewelry-store')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sample coupons
const sampleCoupons = [
  {
    code: 'SAVE20',
    discount: 20,
    maxUsage: 100,
    usage: 45,
    expiryDate: new Date('2024-12-31'),
    isActive: true
  },
  {
    code: 'WELCOME10',
    discount: 10,
    maxUsage: 200,
    usage: 123,
    expiryDate: new Date('2024-06-30'),
    isActive: true
  },
  {
    code: 'EXPIRED50',
    discount: 50,
    maxUsage: 200,
    usage: 200,
    expiryDate: new Date('2024-01-01'),
    isActive: true
  },
  {
    code: 'NEWUSER15',
    discount: 15,
    maxUsage: 50,
    usage: 0,
    expiryDate: new Date('2024-08-15'),
    isActive: true
  },
  {
    code: 'FLASH25',
    discount: 25,
    maxUsage: 75,
    usage: 30,
    expiryDate: new Date('2024-05-20'),
    isActive: true
  }
];

async function addSampleCoupons() {
  try {
    // Clear existing coupons
    await Coupon.deleteMany({});
    console.log('Cleared existing coupons');

    // Add new coupons
    const createdCoupons = await Coupon.insertMany(sampleCoupons);
    console.log(`✅ Added ${createdCoupons.length} sample coupons!`);
    
    // Display the coupons
    createdCoupons.forEach(coupon => {
      console.log(`- ${coupon.code}: ${coupon.discount}% off (${coupon.usage}/${coupon.maxUsage} used) - Expires: ${coupon.expiryDate.toLocaleDateString()}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding sample coupons:', error);
    process.exit(1);
  }
}

addSampleCoupons(); 