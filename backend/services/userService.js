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

module.exports = {
  getUserById,
  getUserWishlist,
  addToWishlist
};
