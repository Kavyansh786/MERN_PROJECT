const mongoose = require('mongoose');

const seasonalPageSchema = new mongoose.Schema({
  // Page Identity
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  
  // Content
  subtitle: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  
  
  // Visual Design
  colors: {
    primary: {
      type: String,
      default: '#dc2626' // red-600
    },
    secondary: {
      type: String,
      default: '#ec4899' // pink-500
    },
    background: {
      type: String,
      default: 'from-red-50 via-pink-50 to-red-100'
    },
    text: {
      type: String,
      default: '#7f1d1d' // red-900
    }
  },
  
  // Product Filter
  productFilter: {
    category: String,
    isSpecial: String, // e.g., 'isRakhi', 'isDiwali', etc.
    tags: [String]
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Admin Info
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
seasonalPageSchema.index({ slug: 1 });
seasonalPageSchema.index({ isActive: 1 });

module.exports = mongoose.model('SeasonalPage', seasonalPageSchema);
