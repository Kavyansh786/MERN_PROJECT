const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Cart must be linked to a user']
  },
  items: [
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
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);
