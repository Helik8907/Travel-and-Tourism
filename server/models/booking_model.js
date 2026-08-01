const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    optional: true,
  },
  isOrganizer: {
    type: Boolean,
    default: false,
  },
  shareAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending',
  },
  paidAt: {
    type: Date,
    optional: true,
  },
});

const bookingSchema = new mongoose.Schema({
  itineraryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Itinerary',
    required: true,
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  totalCost: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  status: {
    type: String,
    enum: ['draft', 'confirmed', 'cancelled'],
    default: 'draft',
  },
  splitEnabled: {
    type: Boolean,
    default: false,
  },
  splitMethod: {
    type: String,
    enum: ['equal', 'custom'],
    default: 'equal',
  },
  participants: [participantSchema],
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
