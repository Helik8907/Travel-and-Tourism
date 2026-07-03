// Placeholder Mongoose model
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  passwordHash: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
