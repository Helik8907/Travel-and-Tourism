const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: String,
  city: String,
  country: String,
  type: String,
  description: String,
  images: [String],
}, { timestamps: true });

module.exports = mongoose.model('Destination', destinationSchema);
