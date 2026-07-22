const mongoose = require('mongoose');

const chatbotTrainingSchema = new mongoose.Schema({
  // Question-Answer pairs
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  },
  
  // Keywords for better matching
  keywords: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  
  // Category for organization
  category: {
    type: String,
    required: true,
    enum: [
      'products',
      'orders',
      'shipping',
      'returns',
      'pricing',
      'materials',
      'customization',
      'care_instructions',
      'general',
      'greetings',
      'support',
      'payment',
      'account',
      'services',
      'care',
      'education',
      'sizing',
      'warranty',
      'security',
      'insurance',
      'promotions',
      'quality',
      'loyalty',
      'consultation',
      'health',
      'trends',
      'styling',
      'authentication',
      'gifting',
      'etiquette',
      'travel',
      'valuation',
      'lifestyle',
      'investment'
    ],
    default: 'general'
  },
  
  // Priority for response selection
  priority: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Usage statistics
  usageCount: {
    type: Number,
    default: 0
  },
  
  // Confidence threshold for matching
  confidenceThreshold: {
    type: Number,
    default: 0.7,
    min: 0,
    max: 1
  },
  
  // Context for when this response should be used
  context: {
    type: String,
    trim: true
  },
  
  // Follow-up questions or suggestions
  followUpSuggestions: [{
    type: String,
    trim: true
  }],
  
  // Action links for navigation
  actionLinks: [{
    text: {
      type: String,
      trim: true
    },
    url: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      enum: ['internal', 'external'],
      default: 'internal'
    }
  }],
  
  // Admin info
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

// Indexes for better search performance
chatbotTrainingSchema.index({ keywords: 1 });
chatbotTrainingSchema.index({ category: 1 });
chatbotTrainingSchema.index({ isActive: 1 });
chatbotTrainingSchema.index({ question: 'text', answer: 'text', keywords: 'text' });

// Method to increment usage count
chatbotTrainingSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  return this.save();
};

// Static method to find best match
chatbotTrainingSchema.statics.findBestMatch = async function(query, category = null) {
  const searchQuery = {
    isActive: true,
    $or: [
      { question: { $regex: query, $options: 'i' } },
      { keywords: { $in: [new RegExp(query, 'i')] } },
      { answer: { $regex: query, $options: 'i' } }
    ]
  };
  
  if (category) {
    searchQuery.category = category;
  }
  
  return this.find(searchQuery)
    .sort({ priority: -1, usageCount: -1 })
    .limit(5);
};

module.exports = mongoose.model('ChatbotTraining', chatbotTrainingSchema);
