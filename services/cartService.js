const Cart = require('./models/Cart');

async function getCart(userId) {
  try {
    return await Cart.findOne({ user: userId }).populate('items.product');
  } catch (error) {
    throw new Error('Could not fetch cart');
  }
}

async function addToCart(userId, productId, quantity) {
  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(item =>
        item.product.toString() === productId
      );

      if (itemIndex >= 0) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    return cart;
  } catch (error) {
    throw new Error('Failed to add to cart');
  }
}

async function removeFromCart(userId, productId) {
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error('Cart not found');

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();
    return cart;
  } catch (error) {
    throw new Error('Failed to remove item');
  }
}

async function clearCart(userId) {
  try {
    await Cart.findOneAndDelete({ user: userId });
    return { message: 'Cart cleared' };
  } catch (error) {
    throw new Error('Failed to clear cart');
  }
}

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
};
