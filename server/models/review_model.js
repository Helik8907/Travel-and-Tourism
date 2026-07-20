const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  destinationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination'
  },

  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  },
  
  rating: {
    type: Number,
    required: true,
    min: 0,
  max: 5,
  },
  comment: String,
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
