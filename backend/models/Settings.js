const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Store Settings
  storeName: {
    type: String,
    default: 'Auréa Jewelry Store'
  },
  storeEmail: {
    type: String,
    default: 'info@aurea.com'
  },
  storeDescription: {
    type: String,
    default: 'Premium jewelry collection with exquisite craftsmanship'
  },
  storeLogo: {
    type: String,
    default: null
  },
  storeAddress: {
    type: String,
    default: ''
  },
  storePhone: {
    type: String,
    default: ''
  },

  // Payment Settings
  razorpayEnabled: {
    type: Boolean,
    default: true
  },
  razorpayKeyId: {
    type: String,
    default: ''
  },
  razorpayKeySecret: {
    type: String,
    default: ''
  },
  codEnabled: {
    type: Boolean,
    default: true
  },

  // Shipping Settings
  freeShippingThreshold: {
    type: Number,
    default: 500
  },
  standardShippingRate: {
    type: Number,
    default: 50
  },
  expressShippingRate: {
    type: Number,
    default: 100
  },
  shippingZones: [{
    name: String,
    rate: Number,
    states: [String]
  }],

  // Tax Settings
  taxEnabled: {
    type: Boolean,
    default: true
  },
  gstRate: {
    type: Number,
    default: 18
  },
  cgstRate: {
    type: Number,
    default: 9
  },
  sgstRate: {
    type: Number,
    default: 9
  },

  // Email Settings
  smtpHost: {
    type: String,
    default: 'smtp.gmail.com'
  },
  smtpPort: {
    type: Number,
    default: 587
  },
  smtpUser: {
    type: String,
    default: ''
  },
  smtpPassword: {
    type: String,
    default: ''
  },
  fromEmail: {
    type: String,
    default: ''
  },
  fromName: {
    type: String,
    default: 'Auréa Jewelry'
  },

  // Notification Settings
  orderNotifications: {
    type: Boolean,
    default: true
  },
  lowStockNotifications: {
    type: Boolean,
    default: true
  },
  lowStockThreshold: {
    type: Number,
    default: 5
  },

  // SEO Settings
  metaTitle: {
    type: String,
    default: 'Auréa Jewelry - Premium Jewelry Collection'
  },
  metaDescription: {
    type: String,
    default: 'Discover exquisite jewelry pieces at Auréa. Premium quality rings, necklaces, earrings and more.'
  },
  metaKeywords: {
    type: String,
    default: 'jewelry, rings, necklaces, earrings, gold, silver, diamonds'
  },

  // Social Media Settings
  facebookUrl: {
    type: String,
    default: ''
  },
  instagramUrl: {
    type: String,
    default: ''
  },
  twitterUrl: {
    type: String,
    default: ''
  },
  youtubeUrl: {
    type: String,
    default: ''
  },

  // Business Settings
  businessHours: {
    monday: { 
      open: { type: String, default: '09:00' }, 
      close: { type: String, default: '18:00' }, 
      closed: { type: Boolean, default: false }
    },
    tuesday: { 
      open: { type: String, default: '09:00' }, 
      close: { type: String, default: '18:00' }, 
      closed: { type: Boolean, default: false }
    },
    wednesday: { 
      open: { type: String, default: '09:00' }, 
      close: { type: String, default: '18:00' }, 
      closed: { type: Boolean, default: false }
    },
    thursday: { 
      open: { type: String, default: '09:00' }, 
      close: { type: String, default: '18:00' }, 
      closed: { type: Boolean, default: false }
    },
    friday: { 
      open: { type: String, default: '09:00' }, 
      close: { type: String, default: '18:00' }, 
      closed: { type: Boolean, default: false }
    },
    saturday: { 
      open: { type: String, default: '10:00' }, 
      close: { type: String, default: '16:00' }, 
      closed: { type: Boolean, default: false }
    },
    sunday: { 
      open: { type: String, default: '10:00' }, 
      close: { type: String, default: '16:00' }, 
      closed: { type: Boolean, default: true }
    }
  },

  // Currency Settings
  currency: {
    type: String,
    default: 'INR'
  },
  currencySymbol: {
    type: String,
    default: '₹'
  },

  // Maintenance Mode
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  maintenanceMessage: {
    type: String,
    default: 'We are currently performing maintenance. Please check back soon.'
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

settingsSchema.statics.updateSettings = async function(updates) {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create(updates);
  } else {
    Object.assign(settings, updates);
    await settings.save();
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
