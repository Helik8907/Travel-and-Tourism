const jwt = require('jsonwebtoken');
const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/user_model');
const { jwtSecret, env } = require('../config/config');

const cookieOptions = {
  httpOnly: true,
  secure: env === 'production',
  sameSite: env === 'production' ? 'none' : 'lax',
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

const toSafeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const sendAuthResponse = (res, status, user) => {
  const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1d' });
  res.cookie('token', token, cookieOptions);
  res.status(status).json({ user: toSafeUser(user) });
};

const signup = asyncHandler(async (req, res) => {
  const { name, email, password, resident } = req.body;

  if (!name || !email || !password || !resident) {
    return res.status(400).json({ message: 'Name, email, password and resident are required' });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(409).json({ message: 'An account with this email already exists' });
  }

  const user = await User.create({ name, email: email.toLowerCase(), password, resident });

  sendAuthResponse(res, 201, user);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  sendAuthResponse(res, 200, user);
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', cookieOptions);
  res.status(200).json({ message: 'Logged out successfully' });
});

const me = asyncHandler(async (req, res) => {
  res.status(200).json({ user: toSafeUser(req.user) });
});

module.exports = { signup, login, logout, me };