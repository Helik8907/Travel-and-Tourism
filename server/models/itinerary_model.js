const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
  destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' },
  notes: String,
  order: Number,
  time: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
});

const daySchema = new mongoose.Schema({
  dayNumber: {
    type:Number,
    required:true
  },
  entries: [stopSchema],
});

const itinerarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required:true,
  },
  title: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },

  avg_cost: {
    type: Number,
    required: true,
  },

  cost_range: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
    },

  days: [daySchema],
}, { timestamps: true });

module.exports = mongoose.model('Itinerary', itinerarySchema);
