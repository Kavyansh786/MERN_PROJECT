const express = require('express');
const router = express.Router();
const SeasonalPage = require('../models/SeasonalPage');
const auth = require('../middleware/auth');

// Get active seasonal page
router.get('/active', async (req, res) => {
  try {
    const seasonalPage = await SeasonalPage.findOne({ isActive: true });
    res.json({
      success: true,
      data: seasonalPage
    });
  } catch (error) {
    console.error('Error fetching active seasonal page:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch seasonal page'
    });
  }
});

// Get seasonal page by slug
router.get('/:slug', async (req, res) => {
  try {
    const seasonalPage = await SeasonalPage.findOne({ 
      slug: req.params.slug,
      isActive: true 
    });
    
    if (!seasonalPage) {
      return res.status(404).json({
        success: false,
        error: 'Seasonal page not found'
      });
    }
    
    res.json({
      success: true,
      data: seasonalPage
    });
  } catch (error) {
    console.error('Error fetching seasonal page:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch seasonal page'
    });
  }
});

// Admin routes (require authentication)
// Get all seasonal pages
router.get('/', auth, async (req, res) => {
  try {
    const seasonalPages = await SeasonalPage.find()
      .populate('createdBy', 'name email')
      .populate('lastUpdatedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: seasonalPages
    });
  } catch (error) {
    console.error('Error fetching seasonal pages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch seasonal pages'
    });
  }
});

// Create new seasonal page
router.post('/', auth, async (req, res) => {
  try {
    const seasonalPageData = {
      ...req.body,
      createdBy: req.user._id,
      lastUpdatedBy: req.user._id
    };
    
    const seasonalPage = new SeasonalPage(seasonalPageData);
    await seasonalPage.save();
    
    res.status(201).json({
      success: true,
      data: seasonalPage,
      message: 'Seasonal page created successfully'
    });
  } catch (error) {
    console.error('Error creating seasonal page:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'A seasonal page with this slug already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create seasonal page'
    });
  }
});

// Update seasonal page
router.put('/:id', auth, async (req, res) => {
  try {
    const seasonalPage = await SeasonalPage.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        lastUpdatedBy: req.user._id
      },
      { new: true, runValidators: true }
    );
    
    if (!seasonalPage) {
      return res.status(404).json({
        success: false,
        error: 'Seasonal page not found'
      });
    }
    
    res.json({
      success: true,
      data: seasonalPage,
      message: 'Seasonal page updated successfully'
    });
  } catch (error) {
    console.error('Error updating seasonal page:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update seasonal page'
    });
  }
});

// Delete seasonal page
router.delete('/:id', auth, async (req, res) => {
  try {
    const seasonalPage = await SeasonalPage.findByIdAndDelete(req.params.id);
    
    if (!seasonalPage) {
      return res.status(404).json({
        success: false,
        error: 'Seasonal page not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Seasonal page deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting seasonal page:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete seasonal page'
    });
  }
});

// Set active seasonal page (deactivate others)
router.patch('/:id/activate', auth, async (req, res) => {
  try {
    // Deactivate all seasonal pages
    await SeasonalPage.updateMany({}, { isActive: false });
    
    // Activate the selected one
    const seasonalPage = await SeasonalPage.findByIdAndUpdate(
      req.params.id,
      { 
        isActive: true,
        lastUpdatedBy: req.user._id
      },
      { new: true }
    );
    
    if (!seasonalPage) {
      return res.status(404).json({
        success: false,
        error: 'Seasonal page not found'
      });
    }
    
    res.json({
      success: true,
      data: seasonalPage,
      message: 'Seasonal page activated successfully'
    });
  } catch (error) {
    console.error('Error activating seasonal page:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to activate seasonal page'
    });
  }
});

module.exports = router;
