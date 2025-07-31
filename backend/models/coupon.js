const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  discount: {
    type: Number,
    required: [true, 'Discount percentage is required'],
    min: [1, 'Discount must be at least 1%'],
    max: [100, 'Discount cannot exceed 100%']
  },
  maxUsage: {
    type: Number,
    required: [true, 'Maximum usage is required'],
    min: [1, 'Maximum usage must be at least 1']
  },
  usage: {
    type: Number,
    default: 0,
    min: [0, 'Usage cannot be negative']
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual to check if coupon is expired
couponSchema.virtual('isExpired').get(function() {
  return new Date() > this.expiryDate;
});

// Virtual to check if coupon is maxed out
couponSchema.virtual('isMaxedOut').get(function() {
  return this.usage >= this.maxUsage;
});

// Virtual to check if coupon is valid
couponSchema.virtual('isValid').get(function() {
  return this.isActive && !this.isExpired && !this.isMaxedOut;
});

// Ensure virtuals are serialized
couponSchema.set('toJSON', { virtuals: true });
couponSchema.set('toObject', { virtuals: true });

module.exports = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema); 