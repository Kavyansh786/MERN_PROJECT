const mongoose = require('mongoose');

const virtualTryOnSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  sessionData: {
    mode: {
      type: String,
      enum: ['earrings', 'necklace', 'bracelet', 'ring'],
      required: true
    },
    duration: {
      type: Number, // in seconds
      default: 0
    },
    capturedImages: [{
      imageData: String, // base64 encoded image
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],
    interactions: [{
      action: {
        type: String,
        enum: ['mode_change', 'capture', 'share', 'zoom', 'rotate']
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      details: mongoose.Schema.Types.Mixed
    }]
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    userAgent: String,
    ip: String,
    deviceType: {
      type: String,
      enum: ['mobile', 'tablet', 'desktop'],
      default: 'desktop'
    },
    cameraResolution: {
      width: Number,
      height: Number
    }
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    wouldRecommend: Boolean
  }
}, {
  timestamps: true
});

// Index for efficient queries
virtualTryOnSessionSchema.index({ userId: 1, timestamp: -1 });
virtualTryOnSessionSchema.index({ productId: 1, timestamp: -1 });
virtualTryOnSessionSchema.index({ 'sessionData.mode': 1 });

// Virtual for session duration in minutes
virtualTryOnSessionSchema.virtual('durationInMinutes').get(function() {
  return Math.round(this.sessionData.duration / 60);
});

// Static method to get user's favorite try-on mode
virtualTryOnSessionSchema.statics.getUserFavoriteMode = async function(userId) {
  const result = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: '$sessionData.mode', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ]);
  
  return result.length > 0 ? result[0]._id : null;
};

// Instance method to add interaction
virtualTryOnSessionSchema.methods.addInteraction = function(action, details = {}) {
  this.sessionData.interactions.push({
    action,
    details,
    timestamp: new Date()
  });
  return this.save();
};

// Pre-save middleware to detect device type from user agent
virtualTryOnSessionSchema.pre('save', function(next) {
  if (this.metadata.userAgent) {
    const ua = this.metadata.userAgent.toLowerCase();
    if (ua.includes('mobile')) {
      this.metadata.deviceType = 'mobile';
    } else if (ua.includes('tablet') || ua.includes('ipad')) {
      this.metadata.deviceType = 'tablet';
    } else {
      this.metadata.deviceType = 'desktop';
    }
  }
  next();
});

module.exports = mongoose.model('VirtualTryOnSession', virtualTryOnSessionSchema);