const jwt = require('jsonwebtoken');
const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/user_model');
const Destination = require('../models/destination_model');
const Review = require('../models/review_model');
const Blog = require('../models/blog_model');
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
  destinations_disliked: user.destinations_disliked,
  reviews_liked: user.reviews_liked,
  reviews_disliked: user.reviews_disliked,
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

const DESTINATION_FIELDS = 'name city country images avg_rating';
const BLOG_FIELDS = 'title description createdAt';
const REVIEW_FIELDS = 'rating comment createdAt destinationId userId';

const profile = asyncHandler(async (req, res) => {
  const user = await req.user.populate([
    { path: 'destinations_liked', select: DESTINATION_FIELDS },
    { path: 'destinations_disliked', select: DESTINATION_FIELDS },
    { path: 'blogs_liked', select: BLOG_FIELDS },
    { path: 'blogs_disliked', select: BLOG_FIELDS },
    {
      path: 'reviews_liked',
      select: REVIEW_FIELDS,
      populate: [
        { path: 'destinationId', select: 'name city country images' },
        { path: 'userId', select: 'name' },
      ],
    },
    {
      path: 'reviews_disliked',
      select: REVIEW_FIELDS,
      populate: [
        { path: 'destinationId', select: 'name city country images' },
        { path: 'userId', select: 'name' },
      ],
    },
  ]);

  // created_by/userId/author are the source of truth for authorship; destinations_created,
  // reviews_created and blogs_created can miss entries created before those fields were wired up.
  const [destinationsCreated, reviewsCreated, blogsCreated] = await Promise.all([
    Destination.find({ created_by: user._id })
      .select(DESTINATION_FIELDS)
      .sort({ createdAt: -1 }),
    Review.find({ userId: user._id })
      .select(REVIEW_FIELDS)
      .populate('destinationId', 'name city country images')
      .sort({ createdAt: -1 }),
    Blog.find({ author: user._id })
      .select(BLOG_FIELDS)
      .sort({ createdAt: -1 }),
  ]);

  res.status(200).json({
    user: {
      ...toSafeUser(user),
      resident: user.resident,
      createdAt: user.createdAt,
      destinations_created: destinationsCreated,
      destinations_liked: user.destinations_liked,
      destinations_disliked: user.destinations_disliked,
      reviews_created: reviewsCreated,
      reviews_liked: user.reviews_liked,
      reviews_disliked: user.reviews_disliked,
      blogs_created: blogsCreated,
      blogs_liked: user.blogs_liked,
      blogs_disliked: user.blogs_disliked,
    },
  });
});

module.exports = { signup, login, logout, me, updateMe, profile };