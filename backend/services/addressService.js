const Address = require('../models/address');

const createAddress = async (userId, addressData) => {
  const address = new Address({ ...addressData, userId });
  return await address.save();
};

const getUserAddresses = async (userId) => {
  return await Address.find({ userId }).sort({ createdAt: -1 });
};

const getAddressById = async (addressId, userId) => {
  return await Address.findOne({ _id: addressId, userId });
};

const updateAddress = async (addressId, userId, updatedData) => {
  return await Address.findOneAndUpdate(
    { _id: addressId, userId },
    updatedData,
    { new: true, runValidators: true }
  );
};

const deleteAddress = async (addressId, userId) => {
  return await Address.findOneAndDelete({ _id: addressId, userId });
};

module.exports = {
  createAddress,
  getUserAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
};
