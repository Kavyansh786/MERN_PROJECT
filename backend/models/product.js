const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  material: {
    type: String,
    required: [true, 'Material is required']
  },
  stone: {
    type: String,
    required: false
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    minlength: [10, 'Description must be at least 10 characters']
  },
  model3d: {
    type: String,
    default: null,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow null/empty
        return /\.(glb|gltf)$/i.test(v); // Must be GLB or GLTF file
      },
      message: '3D model must be a .glb or .gltf file'
    }
  },
  isPersonalized: {
    type: Boolean,
    default: false
  },
  customizationOptions: {
    engraving: {
      type: Boolean,
      default: false
    },
    fontStyle: {
      type: [String],
      default: []
    },
    nameText: {
      type: Boolean,
      default: false
    },
    metalFinish: {
      type: [String],
      default: []
    }
  },
  // Inventory fields
  currentStock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  reserved: {
    type: Number,
    default: 0,
    min: [0, 'Reserved cannot be negative']
  },
  inStock: {
    type: Boolean,
    default: true
  },
  sku: {
    type: String,
    unique: true,
    required: [true, 'SKU is required']
  },
  isRakhi: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  rakhiType: {
    type: String,
    enum: ['traditional', 'designer', 'premium'],
    default: 'traditional'
  },
  categoryPage: {
    type: String,
    enum: ['rings', 'necklaces', 'earrings', 'bracelets', 'bridal', 'birthday-gifts', 'zodiac-jewelry', 'anniversary-gifts', 'anniversary', 'festive-gifts', 'personalized-gifts', 'raksha-bandhan', 'shop', 'seasonal'],
    default: 'shop'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for available stock
productSchema.virtual('available').get(function() {
  return Math.max(this.currentStock - this.reserved, 0);
});

// Ensure virtuals are serialized
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
