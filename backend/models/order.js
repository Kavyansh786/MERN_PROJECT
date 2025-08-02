const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Order must be linked to a user']
  },
  orderItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product is required']
      },
      quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1']
      }
    }
  ],
  shippingAddress: {
    fullName: { type: String, required: [true, 'Full name is required'] },
    phone: { type: String, required: [true, 'Phone is required'] },
    email: { type: String, required: [true, 'Email is required'] },
    street: { type: String, required: [true, 'Street address is required'] },
    city: { type: String, required: [true, 'City is required'] },
    state: { type: String, required: [true, 'State is required'] },
    postalCode: { type: String, required: [true, 'Postal Code is required'] },
    country: { type: String, required: [true, 'Country is required'] }
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['cod', 'razorpay']
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending'
  },
  orderStatus: {
    type: String,
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing'
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total must be positive']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price must be positive']
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: [0, 'Discount amount cannot be negative']
  },
  couponCode: {
    type: String,
    uppercase: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
