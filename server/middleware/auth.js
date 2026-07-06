const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const User = require('../models/user_model');

const getToken = (req) => {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    return header.split(' ')[1];
  }
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  return null;
};

const protect = asyncHandler(async (req, res, next) => {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, invalid or expired token' });
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(401).json({ message: 'Not authorized, user no longer exists' });
  }

  req.user = user;
  next();
});

module.exports = { protect };
