const express = require('express');
const router = express.Router();
const Coupon = require('../models/coupon');

// GET /api/coupons - Get all coupons
router.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    console.error('Failed to fetch coupons:', err.message);
    res.status(500).json({ message: 'Failed to fetch coupons' });
  }
});

// POST /api/coupons - Create new coupon
router.post('/', async (req, res) => {
  try {
    const { code, discount, maxUsage, expiryDate, isActive } = req.body;

    // Validate required fields
    if (!code || !discount || !maxUsage || !expiryDate) {
      return res.status(400).json({ 
        message: 'Code, discount, maxUsage, and expiryDate are required' 
      });
    }

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ 
        message: 'Coupon code already exists' 
      });
    }

    const newCoupon = await Coupon.create({
      code: code.toUpperCase(),
      discount,
      maxUsage,
      expiryDate,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json(newCoupon);
  } catch (err) {
    console.error('Failed to create coupon:', err.message);
    res.status(500).json({ message: 'Failed to create coupon' });
  }
});

// PATCH /api/coupons/:id - Update coupon
router.patch('/:id', async (req, res) => {
  try {
    const { code, discount, maxUsage, expiryDate, isActive } = req.body;
    const couponId = req.params.id;

    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    // Check if new code conflicts with existing coupon
    if (code && code.toUpperCase() !== coupon.code) {
      const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
      if (existingCoupon) {
        return res.status(400).json({ 
          message: 'Coupon code already exists' 
        });
      }
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      couponId,
      {
        code: code ? code.toUpperCase() : coupon.code,
        discount: discount || coupon.discount,
        maxUsage: maxUsage || coupon.maxUsage,
        expiryDate: expiryDate || coupon.expiryDate,
        isActive: isActive !== undefined ? isActive : coupon.isActive
      },
      { new: true }
    );

    res.json(updatedCoupon);
  } catch (err) {
    console.error('Failed to update coupon:', err.message);
    res.status(500).json({ message: 'Failed to update coupon' });
  }
});

// DELETE /api/coupons/:id - Delete coupon
router.delete('/:id', async (req, res) => {
  try {
    const couponId = req.params.id;
    const coupon = await Coupon.findById(couponId);
    
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    await Coupon.findByIdAndDelete(couponId);
    res.json({ message: 'Coupon deleted successfully' });
  } catch (err) {
    console.error('Failed to delete coupon:', err.message);
    res.status(500).json({ message: 'Failed to delete coupon' });
  }
});

// GET /api/coupons/validate/:code - Validate coupon code
router.get('/validate/:code', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return res.status(404).json({ 
        valid: false, 
        message: 'Coupon not found' 
      });
    }

    // Check if coupon is valid
    if (!coupon.isValid) {
      let message = 'Coupon is invalid';
      if (coupon.isExpired) {
        message = 'Coupon has expired';
      } else if (coupon.isMaxedOut) {
        message = 'Coupon usage limit reached';
      } else if (!coupon.isActive) {
        message = 'Coupon is inactive';
      }

      return res.status(400).json({ 
        valid: false, 
        message 
      });
    }

    res.json({ 
      valid: true, 
      coupon: {
        code: coupon.code,
        discount: coupon.discount,
        usage: coupon.usage,
        maxUsage: coupon.maxUsage
      }
    });
  } catch (err) {
    console.error('Failed to validate coupon:', err.message);
    res.status(500).json({ message: 'Failed to validate coupon' });
  }
});

// POST /api/coupons/use/:code - Use coupon (increment usage)
router.post('/use/:code', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return res.status(404).json({ 
        success: false, 
        message: 'Coupon not found' 
      });
    }

    // Check if coupon is valid
    if (!coupon.isValid) {
      let message = 'Coupon is invalid';
      if (coupon.isExpired) {
        message = 'Coupon has expired';
      } else if (coupon.isMaxedOut) {
        message = 'Coupon usage limit reached';
      } else if (!coupon.isActive) {
        message = 'Coupon is inactive';
      }

      return res.status(400).json({ 
        success: false, 
        message 
      });
    }

    // Increment usage
    coupon.usage += 1;
    await coupon.save();

    res.json({ 
      success: true, 
      message: 'Coupon used successfully',
      coupon: {
        code: coupon.code,
        discount: coupon.discount,
        usage: coupon.usage,
        maxUsage: coupon.maxUsage
      }
    });
  } catch (err) {
    console.error('Failed to use coupon:', err.message);
    res.status(500).json({ message: 'Failed to use coupon' });
  }
});

module.exports = router; 