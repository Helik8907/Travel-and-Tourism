const jwt = require('jsonwebtoken');
const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/user_model');
const Destination = require('../models/destination_model');
const Review = require('../models/review_model');
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
  destinations_liked: user.destinations_liked,
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

const updateMe = asyncHandler(async (req, res) => {
  const { name, resident } = req.body;

  if (!name || !resident) {
    return res.status(400).json({ message: 'Name and resident are required' });
  }

  req.user.name = name;
  req.user.resident = resident;
  await req.user.save();

  res.status(200).json({ user: toSafeUser(req.user) });
});

const profile = asyncHandler(async (req, res) => {
  const user = await req.user.populate({
    path: 'destinations_liked',
    select: 'name city country images avg_rating',
  });

  // created_by/userId are the source of truth for authorship; destinations_created
  // and reviews_created can miss entries created before those fields were wired up.
  const [destinationsCreated, reviewsCreated] = await Promise.all([
    Destination.find({ created_by: user._id })
      .select('name city country images avg_rating')
      .sort({ createdAt: -1 }),
    Review.find({ userId: user._id })
      .select('rating comment createdAt destinationId')
      .populate('destinationId', 'name city country images')
      .sort({ createdAt: -1 }),
  ]);

  res.status(200).json({
    user: {
      ...toSafeUser(user),
      resident: user.resident,
      createdAt: user.createdAt,
      destinations_created: destinationsCreated,
      reviews_created: reviewsCreated,
    },
  });
});

module.exports = { signup, login, logout, me, updateMe, profile };