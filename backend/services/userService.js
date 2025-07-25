const User = require('../models/user.js');

async function getUserById(id) {
  return await User.findById(id).select('-password');
}

async function getUserWishlist(userId) {
  const user = await User.findById(userId).populate('wishlist');
  return user?.wishlist || [];
}

async function addToWishlist(userId, productId) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  if (!user.wishlist.includes(productId)) {
    user.wishlist.push(productId);
    await user.save();
  }

  return user.wishlist;
}

async function removeFromWishlist(userId, productId) {
  console.log('removeFromWishlist called with:', { userId, productId });
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  user.wishlist = user.wishlist.filter(
    id => id.toString() !== productId.toString()
  );
  await user.save();
  return user.wishlist;
}

async function updateUserProfile(userId, updates) {
  // Only allow certain fields to be updated
  const allowedFields = ['name', 'email', 'phone', 'dob', 'profilePic'];
  const updateData = {};
  for (const key of allowedFields) {
    if (updates[key] !== undefined) updateData[key] = updates[key];
  }
  return await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select('-password');
}

module.exports = {
  getUserById,
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  updateUserProfile
};
