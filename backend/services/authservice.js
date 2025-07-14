const User = require('./models/User');
const jwt = require('jsonwebtoken');

async function registerUser(data) {
  try {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) throw new Error('User already exists');

    const newUser = await User.create(data);
    return newUser;
  } catch (error) {
    throw new Error(error.message || 'Registration failed');
  }
}

async function loginUser(email, password) {
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    return { user, token };
  } catch (error) {
    throw new Error(error.message || 'Login failed');
  }
}

module.exports = {
  registerUser,
  loginUser,
};
