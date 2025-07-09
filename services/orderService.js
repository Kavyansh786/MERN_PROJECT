const Order = require('./models/Order');

async function createOrder(orderData) {
  try {
    const newOrder = await Order.create(orderData);
    return newOrder;
  } catch (error) {
    throw new Error('Order creation failed');
  }
}

async function getOrdersByUser(userId) {
  try {
    return await Order.find({ user: userId }).populate('orderItems.product');
  } catch (error) {
    throw new Error('Could not fetch user orders');
  }
}

async function getAllOrders() {
  try {
    return await Order.find().populate('user', 'name email');
  } catch (error) {
    throw new Error('Could not fetch orders');
  }
}

async function updateOrderStatus(id, status) {
  try {
    const order = await Order.findById(id);
    if (!order) throw new Error('Order not found');

    order.orderStatus = status;
    if (status === 'Delivered') order.deliveredAt = Date.now();
    await order.save();

    return order;
  } catch (error) {
    throw new Error('Could not update order status');
  }
}

module.exports = {
  createOrder,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus,
};
