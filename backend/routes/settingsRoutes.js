const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for logo upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/logos');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// GET /api/settings - Get all settings
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings'
    });
  }
});

// PUT /api/settings - Update settings
router.put('/', async (req, res) => {
  try {
    const updates = req.body;
    
    // Remove sensitive fields that shouldn't be updated via this route
    delete updates._id;
    delete updates.__v;
    delete updates.createdAt;
    delete updates.updatedAt;
    
    const settings = await Settings.updateSettings(updates);
    
    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings'
    });
  }
});

// POST /api/settings/logo - Upload store logo
router.post('/logo', upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const logoUrl = `/uploads/logos/${req.file.filename}`;
    
    // Update settings with new logo URL
    const settings = await Settings.updateSettings({ storeLogo: logoUrl });
    
    res.json({
      success: true,
      message: 'Logo uploaded successfully',
      data: {
        logoUrl: logoUrl,
        settings: settings
      }
    });
  } catch (error) {
    console.error('Error uploading logo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload logo'
    });
  }
});

// GET /api/settings/store - Get store settings only
router.get('/store', async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    const storeSettings = {
      storeName: settings.storeName,
      storeEmail: settings.storeEmail,
      storeDescription: settings.storeDescription,
      storeLogo: settings.storeLogo,
      storeAddress: settings.storeAddress,
      storePhone: settings.storePhone
    };
    
    res.json({
      success: true,
      data: storeSettings
    });
  } catch (error) {
    console.error('Error fetching store settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch store settings'
    });
  }
});

// GET /api/settings/payment - Get payment settings only
router.get('/payment', async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    const paymentSettings = {
      razorpayEnabled: settings.razorpayEnabled,
      razorpayKeyId: settings.razorpayKeyId,
      codEnabled: settings.codEnabled
    };
    
    res.json({
      success: true,
      data: paymentSettings
    });
  } catch (error) {
    console.error('Error fetching payment settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment settings'
    });
  }
});

// GET /api/settings/shipping - Get shipping settings only
router.get('/shipping', async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    const shippingSettings = {
      freeShippingThreshold: settings.freeShippingThreshold,
      standardShippingRate: settings.standardShippingRate,
      expressShippingRate: settings.expressShippingRate,
      shippingZones: settings.shippingZones
    };
    
    res.json({
      success: true,
      data: shippingSettings
    });
  } catch (error) {
    console.error('Error fetching shipping settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shipping settings'
    });
  }
});

// GET /api/settings/tax - Get tax settings only
router.get('/tax', async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    const taxSettings = {
      taxEnabled: settings.taxEnabled,
      gstRate: settings.gstRate,
      cgstRate: settings.cgstRate,
      sgstRate: settings.sgstRate
    };
    
    res.json({
      success: true,
      data: taxSettings
    });
  } catch (error) {
    console.error('Error fetching tax settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tax settings'
    });
  }
});

// GET /api/settings/email - Get email settings only (without sensitive data)
router.get('/email', async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    const emailSettings = {
      smtpHost: settings.smtpHost,
      smtpPort: settings.smtpPort,
      smtpUser: settings.smtpUser,
      fromEmail: settings.fromEmail,
      fromName: settings.fromName
    };
    
    res.json({
      success: true,
      data: emailSettings
    });
  } catch (error) {
    console.error('Error fetching email settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch email settings'
    });
  }
});

// PUT /api/settings/store - Update store settings only
router.put('/store', async (req, res) => {
  try {
    const { storeName, storeEmail, storeDescription, storeAddress, storePhone } = req.body;
    
    const updates = {
      storeName,
      storeEmail,
      storeDescription,
      storeAddress,
      storePhone
    };
    
    // Remove undefined values
    Object.keys(updates).forEach(key => {
      if (updates[key] === undefined) {
        delete updates[key];
      }
    });
    
    const settings = await Settings.updateSettings(updates);
    
    res.json({
      success: true,
      message: 'Store settings updated successfully',
      data: settings
    });
  } catch (error) {
    console.error('Error updating store settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update store settings'
    });
  }
});

// PUT /api/settings/payment - Update payment settings only
router.put('/payment', async (req, res) => {
  try {
    const { razorpayEnabled, razorpayKeyId, razorpayKeySecret, codEnabled } = req.body;
    
    const updates = {
      razorpayEnabled,
      razorpayKeyId,
      razorpayKeySecret,
      codEnabled
    };
    
    // Remove undefined values
    Object.keys(updates).forEach(key => {
      if (updates[key] === undefined) {
        delete updates[key];
      }
    });
    
    const settings = await Settings.updateSettings(updates);
    
    res.json({
      success: true,
      message: 'Payment settings updated successfully',
      data: settings
    });
  } catch (error) {
    console.error('Error updating payment settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment settings'
    });
  }
});

// PUT /api/settings/shipping - Update shipping settings only
router.put('/shipping', async (req, res) => {
  try {
    const { freeShippingThreshold, standardShippingRate, expressShippingRate, shippingZones } = req.body;
    
    const updates = {
      freeShippingThreshold,
      standardShippingRate,
      expressShippingRate,
      shippingZones
    };
    
    // Remove undefined values
    Object.keys(updates).forEach(key => {
      if (updates[key] === undefined) {
        delete updates[key];
      }
    });
    
    const settings = await Settings.updateSettings(updates);
    
    res.json({
      success: true,
      message: 'Shipping settings updated successfully',
      data: settings
    });
  } catch (error) {
    console.error('Error updating shipping settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update shipping settings'
    });
  }
});

// PUT /api/settings/tax - Update tax settings only
router.put('/tax', async (req, res) => {
  try {
    const { taxEnabled, gstRate, cgstRate, sgstRate } = req.body;
    
    const updates = {
      taxEnabled,
      gstRate,
      cgstRate,
      sgstRate
    };
    
    // Remove undefined values
    Object.keys(updates).forEach(key => {
      if (updates[key] === undefined) {
        delete updates[key];
      }
    });
    
    const settings = await Settings.updateSettings(updates);
    
    res.json({
      success: true,
      message: 'Tax settings updated successfully',
      data: settings
    });
  } catch (error) {
    console.error('Error updating tax settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update tax settings'
    });
  }
});

// PUT /api/settings/email - Update email settings only
router.put('/email', async (req, res) => {
  try {
    const { smtpHost, smtpPort, smtpUser, smtpPassword, fromEmail, fromName } = req.body;
    
    const updates = {
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPassword,
      fromEmail,
      fromName
    };
    
    // Remove undefined values
    Object.keys(updates).forEach(key => {
      if (updates[key] === undefined) {
        delete updates[key];
      }
    });
    
    const settings = await Settings.updateSettings(updates);
    
    res.json({
      success: true,
      message: 'Email settings updated successfully',
      data: settings
    });
  } catch (error) {
    console.error('Error updating email settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update email settings'
    });
  }
});

module.exports = router;
