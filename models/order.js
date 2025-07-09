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
    city: { type: String, required: [true, 'City is required'] },
    postalCode: { type: String, required: [true, 'Postal Code is required'] },
    country: { type: String, required: [true, 'Country is required'] }
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
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
