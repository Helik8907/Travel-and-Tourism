const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
  destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' },
  notes: String,
  order: Number,
});

const daySchema = new mongoose.Schema({
  dayNumber: Number,
  stops: [stopSchema],
});

const itinerarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  startDate: Date,
  endDate: Date,
  days: [daySchema],
}, { timestamps: true });

module.exports = mongoose.model('Itinerary', itinerarySchema);
