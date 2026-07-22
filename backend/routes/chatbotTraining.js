const express = require('express');
const router = express.Router();
const ChatbotTraining = require('../models/ChatbotTraining');
const auth = require('../middleware/auth');

// Get all training data (with pagination and filtering)
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, category, isActive, search } = req.query;
    
    const query = {};
    
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { answer: { $regex: search, $options: 'i' } },
        { keywords: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const trainingData = await ChatbotTraining.find(query)
      .populate('createdBy', 'name email')
      .populate('lastUpdatedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await ChatbotTraining.countDocuments(query);
    
    res.json({
      success: true,
      data: trainingData,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching training data:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch training data' });
  }
});

// Get single training data by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const trainingData = await ChatbotTraining.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('lastUpdatedBy', 'name email');
    
    if (!trainingData) {
      return res.status(404).json({ success: false, error: 'Training data not found' });
    }
    
    res.json({ success: true, data: trainingData });
  } catch (error) {
    console.error('Error fetching training data:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch training data' });
  }
});

// Create new training data
router.post('/', auth, async (req, res) => {
  try {
    const {
      question,
      answer,
      keywords,
      category,
      priority,
      confidenceThreshold,
      context,
      followUpSuggestions
    } = req.body;
    
    if (!question || !answer) {
      return res.status(400).json({ 
        success: false, 
        error: 'Question and answer are required' 
      });
    }
    
    const trainingData = new ChatbotTraining({
      question,
      answer,
      keywords: keywords || [],
      category: category || 'general',
      priority: priority || 1,
      confidenceThreshold: confidenceThreshold || 0.7,
      context,
      followUpSuggestions: followUpSuggestions || [],
      createdBy: req.user.userId,
      lastUpdatedBy: req.user.userId
    });
    
    await trainingData.save();
    
    const populatedData = await ChatbotTraining.findById(trainingData._id)
      .populate('createdBy', 'name email')
      .populate('lastUpdatedBy', 'name email');
    
    res.status(201).json({ 
      success: true, 
      data: populatedData,
      message: 'Training data created successfully' 
    });
  } catch (error) {
    console.error('Error creating training data:', error);
    res.status(500).json({ success: false, error: 'Failed to create training data' });
  }
});

// Update training data
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      question,
      answer,
      keywords,
      category,
      priority,
      isActive,
      confidenceThreshold,
      context,
      followUpSuggestions
    } = req.body;
    
    const trainingData = await ChatbotTraining.findById(req.params.id);
    
    if (!trainingData) {
      return res.status(404).json({ success: false, error: 'Training data not found' });
    }
    
    // Update fields
    if (question !== undefined) trainingData.question = question;
    if (answer !== undefined) trainingData.answer = answer;
    if (keywords !== undefined) trainingData.keywords = keywords;
    if (category !== undefined) trainingData.category = category;
    if (priority !== undefined) trainingData.priority = priority;
    if (isActive !== undefined) trainingData.isActive = isActive;
    if (confidenceThreshold !== undefined) trainingData.confidenceThreshold = confidenceThreshold;
    if (context !== undefined) trainingData.context = context;
    if (followUpSuggestions !== undefined) trainingData.followUpSuggestions = followUpSuggestions;
    
    trainingData.lastUpdatedBy = req.user.userId;
    
    await trainingData.save();
    
    const populatedData = await ChatbotTraining.findById(trainingData._id)
      .populate('createdBy', 'name email')
      .populate('lastUpdatedBy', 'name email');
    
    res.json({ 
      success: true, 
      data: populatedData,
      message: 'Training data updated successfully' 
    });
  } catch (error) {
    console.error('Error updating training data:', error);
    res.status(500).json({ success: false, error: 'Failed to update training data' });
  }
});

// Delete training data
router.delete('/:id', auth, async (req, res) => {
  try {
    const trainingData = await ChatbotTraining.findById(req.params.id);
    
    if (!trainingData) {
      return res.status(404).json({ success: false, error: 'Training data not found' });
    }
    
    await ChatbotTraining.findByIdAndDelete(req.params.id);
    
    res.json({ 
      success: true, 
      message: 'Training data deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting training data:', error);
    res.status(500).json({ success: false, error: 'Failed to delete training data' });
  }
});

// Bulk import training data
router.post('/bulk-import', auth, async (req, res) => {
  try {
    const { trainingData } = req.body;
    
    if (!Array.isArray(trainingData) || trainingData.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Training data array is required' 
      });
    }
    
    const processedData = trainingData.map(item => ({
      ...item,
      createdBy: req.user.userId,
      lastUpdatedBy: req.user.userId
    }));
    
    const result = await ChatbotTraining.insertMany(processedData);
    
    res.json({ 
      success: true, 
      data: result,
      message: `${result.length} training entries imported successfully` 
    });
  } catch (error) {
    console.error('Error importing training data:', error);
    res.status(500).json({ success: false, error: 'Failed to import training data' });
  }
});

// Clear all training data
router.delete('/clear-all', auth, async (req, res) => {
  try {
    const result = await ChatbotTraining.deleteMany({});
    res.json({ 
      success: true, 
      message: `${result.deletedCount} training entries deleted successfully` 
    });
  } catch (error) {
    console.error('Error clearing training data:', error);
    res.status(500).json({ success: false, error: 'Failed to clear training data' });
  }
});

// Get training statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const totalEntries = await ChatbotTraining.countDocuments();
    const activeEntries = await ChatbotTraining.countDocuments({ isActive: true });
    const inactiveEntries = await ChatbotTraining.countDocuments({ isActive: false });
    
    const categoryStats = await ChatbotTraining.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const topUsed = await ChatbotTraining.find({ isActive: true })
      .sort({ usageCount: -1 })
      .limit(10)
      .select('question usageCount category');
    
    res.json({
      success: true,
      stats: {
        totalEntries,
        activeEntries,
        inactiveEntries,
        categoryStats,
        topUsed
      }
    });
  } catch (error) {
    console.error('Error fetching training stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch training statistics' });
  }
});

// Test training data matching
router.post('/test-match', auth, async (req, res) => {
  try {
    const { query, category } = req.body;
    
    if (!query) {
      return res.status(400).json({ 
        success: false, 
        error: 'Query is required' 
      });
    }
    
    const matches = await ChatbotTraining.findBestMatch(query, category);
    
    res.json({
      success: true,
      matches: matches.map(match => ({
        id: match._id,
        question: match.question,
        answer: match.answer,
        category: match.category,
        priority: match.priority,
        usageCount: match.usageCount,
        keywords: match.keywords
      }))
    });
  } catch (error) {
    console.error('Error testing match:', error);
    res.status(500).json({ success: false, error: 'Failed to test matching' });
  }
});

module.exports = router;
