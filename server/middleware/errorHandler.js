const { errorColor } = require('../utils/colors');

const errorHandler = (err, req, res, next) => {
  console.log(errorColor, '❌ Error:', err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(', ');
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = `Duplicate value for field: ${Object.keys(err.keyValue).join(', ')}`;
  }

  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
