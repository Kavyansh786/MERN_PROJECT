// routes/addressRoutes.js
const express = require('express');
const router = express.Router();
const Address = require('../models/address');

// GET /api/address/:userId - Get all addresses for a user
router.get('/:userId', async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.params.userId });
    res.json({ addresses });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching addresses', error: error.message });
  }
});

// POST /api/address - Create a new address
router.post('/', async (req, res) => {
  try {
    const address = new Address(req.body);
    await address.save();
    res.status(201).json({ message: 'Address saved successfully', address });
  } catch (error) {
    res.status(400).json({ message: 'Error saving address', error: error.message });
  }
});

// PUT /api/address/:id - Update an address
router.put('/:id', async (req, res) => {
  try {
    const address = await Address.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.json({ message: 'Address updated successfully', address });
  } catch (error) {
    res.status(400).json({ message: 'Error updating address', error: error.message });
  }
});

// DELETE /api/address/:id - Delete an address
router.delete('/:id', async (req, res) => {
  try {
    const address = await Address.findByIdAndDelete(req.params.id);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting address', error: error.message });
  }
});

module.exports = router;
