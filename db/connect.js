const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/jwellerydb');
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('Connection error:', err);
  }
}

module.exports = connectDB;
