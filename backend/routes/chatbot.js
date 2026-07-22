const express = require('express');
const router = express.Router();
const { getAllProducts } = require('../services/productService');
const ChatbotTraining = require('../models/ChatbotTraining');

// Enhanced AI-powered responses with training data and product data
async function getSmartResponse(message) {
  const msg = message.toLowerCase();
  
  try {
    // First, check training data for custom responses
    const trainingMatches = await ChatbotTraining.findBestMatch(msg);
    
    if (trainingMatches.length > 0) {
      const bestMatch = trainingMatches[0];
      // Increment usage count
      await bestMatch.incrementUsage();
      
      return {
        response: bestMatch.answer + (bestMatch.followUpSuggestions.length > 0 
          ? `\n\nYou might also want to know:\n• ${bestMatch.followUpSuggestions.join('\n• ')}` 
          : ''),
        actionLinks: bestMatch.actionLinks || []
      };
    }
    
    // Fallback to rule-based responses with product data
    const products = await getAllProducts();
    const categories = [...new Set(products.map(p => p.category))];
    const materials = [...new Set(products.map(p => p.material))];
    
    // Greetings
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('good')) {
      return `Hello! Welcome to our jewelry store. We have ${products.length} beautiful pieces including ${categories.slice(0, 3).join(', ')} and more. How can I help you today?`;
    }
    
    // Product categories
    if (msg.includes('ring')) {
      const rings = products.filter(p => p.category.toLowerCase().includes('ring') || p.categoryPage === 'rings');
      if (rings.length > 0) {
        const sample = rings.slice(0, 3);
        return `We have ${rings.length} beautiful rings! Here are some popular ones:\n${sample.map(r => `• ${r.name} - ₹${r.price} (${r.material})`).join('\n')}\n\nWould you like to see more rings or need help choosing?`;
      }
    }
    
    if (msg.includes('necklace')) {
      const necklaces = products.filter(p => p.category.toLowerCase().includes('necklace') || p.categoryPage === 'necklaces');
      if (necklaces.length > 0) {
        const sample = necklaces.slice(0, 3);
        return `We have ${necklaces.length} stunning necklaces! Here are some favorites:\n${sample.map(n => `• ${n.name} - ₹${n.price} (${n.material})`).join('\n')}\n\nWould you like to explore more necklaces?`;
      }
    }
    
    if (msg.includes('earring')) {
      const earrings = products.filter(p => p.category.toLowerCase().includes('earring') || p.categoryPage === 'earrings');
      if (earrings.length > 0) {
        const sample = earrings.slice(0, 3);
        return `We have ${earrings.length} gorgeous earrings! Check these out:\n${sample.map(e => `• ${e.name} - ₹${e.price} (${e.material})`).join('\n')}\n\nWant to see more earring styles?`;
      }
    }
    
    if (msg.includes('bracelet')) {
      const bracelets = products.filter(p => p.category.toLowerCase().includes('bracelet') || p.categoryPage === 'bracelets');
      if (bracelets.length > 0) {
        const sample = bracelets.slice(0, 3);
        return `We have ${bracelets.length} elegant bracelets! Here are some popular ones:\n${sample.map(b => `• ${b.name} - ₹${b.price} (${b.material})`).join('\n')}\n\nInterested in seeing more bracelet designs?`;
      }
    }
    
    // Materials
    if (msg.includes('gold')) {
      const goldItems = products.filter(p => p.material.toLowerCase().includes('gold'));
      if (goldItems.length > 0) {
        const sample = goldItems.slice(0, 3);
        return `We have ${goldItems.length} beautiful gold jewelry pieces! Here are some highlights:\n${sample.map(g => `• ${g.name} - ₹${g.price} (${g.category})`).join('\n')}\n\nGold is perfect for special occasions and daily wear. What type of gold jewelry are you looking for?`;
      }
    }
    
    if (msg.includes('silver')) {
      const silverItems = products.filter(p => p.material.toLowerCase().includes('silver'));
      if (silverItems.length > 0) {
        const sample = silverItems.slice(0, 3);
        return `Our silver collection has ${silverItems.length} stunning pieces! Here are some popular ones:\n${sample.map(s => `• ${s.name} - ₹${s.price} (${s.category})`).join('\n')}\n\nSilver jewelry is versatile and elegant. What silver piece interests you?`;
      }
    }
    
    // Special collections
    if (msg.includes('bridal') || msg.includes('wedding')) {
      const bridalItems = products.filter(p => p.categoryPage === 'bridal' || p.description.toLowerCase().includes('bridal'));
      if (bridalItems.length > 0) {
        const sample = bridalItems.slice(0, 3);
        return `Our bridal collection is absolutely stunning! We have ${bridalItems.length} pieces perfect for your special day:\n${sample.map(b => `• ${b.name} - ₹${b.price} (${b.material})`).join('\n')}\n\nWould you like to see more bridal recommendations?`;
      }
      return `Our bridal collection features elegant necklace sets, beautiful earrings, and stunning rings perfect for your special day. Would you like to see our bridal recommendations?`;
    }
    
    if (msg.includes('personalized') || msg.includes('custom')) {
      const personalizedItems = products.filter(p => p.isPersonalized);
      if (personalizedItems.length > 0) {
        const sample = personalizedItems.slice(0, 3);
        return `We offer ${personalizedItems.length} personalizable jewelry pieces! Here are some options:\n${sample.map(p => `• ${p.name} - ₹${p.price} (${p.category})`).join('\n')}\n\nYou can add custom engraving, choose fonts, and personalize with names or messages. Perfect for gifts! What would you like to personalize?`;
      }
      return `We offer personalized jewelry with custom engraving, font choices, and personal messages. Perfect for gifts! What type of personalized jewelry are you interested in?`;
    }
    
    if (msg.includes('gift') || msg.includes('birthday') || msg.includes('anniversary')) {
      const giftItems = products.filter(p => p.categoryPage.includes('gifts') || p.categoryPage.includes('birthday') || p.categoryPage.includes('anniversary'));
      if (giftItems.length > 0) {
        const sample = giftItems.slice(0, 3);
        return `We have amazing gift collections! Here are some perfect gift ideas:\n${sample.map(g => `• ${g.name} - ₹${g.price} (${g.category})`).join('\n')}\n\nOur gift categories include birthday gifts, anniversary gifts, festive gifts, and personalized pieces. What's the occasion you're shopping for?`;
      }
      return `We have amazing gift collections including birthday gifts, anniversary gifts, festive gifts, and personalized pieces. What's the occasion you're shopping for?`;
    }
    
    // Price inquiries
    if (msg.includes('price') || msg.includes('cost') || msg.includes('budget')) {
      const prices = products.map(p => p.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const midRange = products.filter(p => p.price >= 1000 && p.price <= 5000).slice(0, 3);
      
      let response = `Our jewelry ranges from ₹${minPrice} to ₹${maxPrice}. We have pieces for every budget!`;
      
      if (midRange.length > 0) {
        response += `\n\nHere are some popular mid-range options:\n${midRange.map(m => `• ${m.name} - ₹${m.price} (${m.category})`).join('\n')}`;
      }
      
      response += `\n\nWhat's your price range? I can help you find something perfect within your budget.`;
      return response;
    }
    
    // Orders and shipping
    if (msg.includes('order') || msg.includes('track') || msg.includes('delivery') || msg.includes('shipping')) {
      return `For order tracking, please visit your profile page and check the "My Orders" section. You can track your order status, view delivery details, and download invoices there. Need help finding it?`;
    }
    
    // Stock inquiries
    if (msg.includes('stock') || msg.includes('available')) {
      const inStockCount = products.filter(p => p.inStock).length;
      return `We currently have ${inStockCount} items in stock! Most of our popular pieces are readily available. Which specific item are you looking for? I can check its availability.`;
    }
    
    // Featured and new arrivals
    if (msg.includes('new') || msg.includes('latest') || msg.includes('featured')) {
      const featured = products.filter(p => p.isFeatured || p.isNewArrival).slice(0, 4);
      if (featured.length > 0) {
        return `Check out our latest arrivals and featured pieces:\n${featured.map(f => `• ${f.name} - ₹${f.price} (${f.category})`).join('\n')}\n\nThese are trending right now!`;
      }
      return `We regularly update our collection with new and featured pieces. Check our homepage for the latest arrivals!`;
    }
    
    // General product inquiry
    if (msg.includes('product') || msg.includes('jewelry') || msg.includes('show') || msg.includes('collection')) {
      return `We have an amazing collection of ${products.length} jewelry pieces! Our categories include:\n• ${categories.join('\n• ')}\n\nMaterials: ${materials.join(', ')}\n\nWhat type of jewelry are you interested in?`;
    }
    
    // Search for specific products
    const searchResults = products.filter(product => {
      return (
        product.name.toLowerCase().includes(msg) ||
        product.description.toLowerCase().includes(msg) ||
        product.category.toLowerCase().includes(msg) ||
        product.material.toLowerCase().includes(msg)
      );
    }).slice(0, 3);
    
    if (searchResults.length > 0) {
      return `I found these items that might interest you:\n${searchResults.map(r => `• ${r.name} - ₹${r.price} (${r.category}, ${r.material})`).join('\n')}\n\nWould you like more details about any of these?`;
    }
    
    // Default response with helpful suggestions
    return `I'm here to help you find the perfect jewelry! You can ask me about:\n• Specific jewelry types (rings, necklaces, earrings, bracelets)\n• Materials (gold, silver, etc.)\n• Special collections (bridal, personalized, gifts)\n• Prices and availability\n• Order tracking\n\nWhat would you like to know?`;
    
  } catch (error) {
    console.error('Error in smart response:', error);
    return "I'm here to help with your jewelry needs! What are you looking for today?";
  }
}

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const botResponse = await getSmartResponse(message);

    // Handle both string and object responses
    if (typeof botResponse === 'string') {
      res.json({
        success: true,
        response: botResponse,
        actionLinks: []
      });
    } else {
      res.json({
        success: true,
        response: botResponse.response,
        actionLinks: botResponse.actionLinks || []
      });
    }

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get response from chatbot'
    });
  }
});

// Get product recommendations endpoint
router.post('/recommendations', async (req, res) => {
  try {
    const { category, priceRange, material } = req.body;
    
    let products = await getAllProducts();
    
    // Filter based on criteria
    if (category) {
      products = products.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
    }
    
    if (material) {
      products = products.filter(p => p.material.toLowerCase().includes(material.toLowerCase()));
    }
    
    if (priceRange) {
      products = products.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);
    }
    
    // Get top 6 recommendations
    const recommendations = products.slice(0, 6).map(p => ({
      id: p._id,
      name: p.name,
      price: p.price,
      category: p.category,
      material: p.material,
      imageUrl: p.imageUrl,
      inStock: p.inStock
    }));
    
    res.json({
      success: true,
      recommendations
    });
    
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get recommendations'
    });
  }
});

module.exports = router;