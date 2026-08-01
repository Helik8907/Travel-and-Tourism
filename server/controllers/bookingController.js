const asyncHandler = require('../middleware/asyncHandler');
const Booking = require('../models/booking_model');
const Itinerary = require('../models/itinerary_model');

const ROUNDING_TOLERANCE = 0.01;

const validateParticipants = (participants, totalCost, splitMethod) => {
  if (!Array.isArray(participants) || participants.length === 0) {
    return 'participants array is required and must have at least one participant';
  }

  // Check if organizer is included
  const hasOrganizer = participants.some(p => p.isOrganizer);
  if (!hasOrganizer) {
    return 'organizer must be included as a participant';
  }

  // Check for duplicate emails
  const emails = participants.map(p => p.email.toLowerCase());
  const uniqueEmails = new Set(emails);
  if (uniqueEmails.size !== emails.length) {
    return 'duplicate participant emails are not allowed';
  }

  // Validate individual participants
  for (const participant of participants) {
    if (!participant.name || typeof participant.name !== 'string' || !participant.name.trim()) {
      return 'each participant must have a valid name';
    }
    if (!participant.email || typeof participant.email !== 'string' || !participant.email.trim()) {
      return 'each participant must have a valid email';
    }
    if (!Number.isFinite(Number(participant.shareAmount)) || Number(participant.shareAmount) < 0) {
      return 'each participant must have a valid shareAmount >= 0';
    }
  }

  // Validate split method specific rules
  if (splitMethod === 'equal') {
    // For equal split, shares should be computed and summed
    const computedShares = computeEqualSplit(participants.length, totalCost);
    const totalShares = computedShares.reduce((sum, share) => sum + share, 0);
    if (Math.abs(totalShares - totalCost) > ROUNDING_TOLERANCE) {
      return 'equal split calculation error: shares do not sum to totalCost';
    }
  } else if (splitMethod === 'custom') {
    // For custom, sum of shareAmount must equal totalCost
    const totalShares = participants.reduce((sum, p) => sum + Number(p.shareAmount), 0);
    if (Math.abs(totalShares - totalCost) > ROUNDING_TOLERANCE) {
      return `total of shared amounts (${totalShares}) must equal trip cost (${totalCost})`;
    }
  }

  return null;
};

const computeEqualSplit = (participantCount, totalCost) => {
  const baseShare = Math.floor((totalCost * 100) / participantCount) / 100;
  const remainder = Math.round((totalCost * 100) - (baseShare * participantCount * 100)) / 100;
  
  const shares = Array(participantCount).fill(baseShare);
  if (remainder > 0) {
    shares[0] += remainder;
  }
  return shares;
};

const createBooking = asyncHandler(async (req, res) => {
  const { itineraryId } = req.body;

  if (!itineraryId) {
    return res.status(400).json({ message: 'itineraryId is required' });
  }

  const itinerary = await Itinerary.findById(itineraryId);
  if (!itinerary) {
    return res.status(404).json({ message: 'Itinerary not found' });
  }

  if (!itinerary.userId.equals(req.user._id)) {
    return res.status(403).json({ message: 'Not authorized to book this itinerary' });
  }

  // Create draft booking with organizer as sole participant
  const booking = await Booking.create({
    itineraryId,
    organizerId: req.user._id,
    totalCost: itinerary.avg_cost,
    currency: 'INR',
    status: 'draft',
    splitEnabled: false,
    splitMethod: 'equal',
    participants: [
      {
        name: req.user.name,
        email: req.user.email.toLowerCase(),
        userId: req.user._id,
        isOrganizer: true,
        shareAmount: itinerary.avg_cost,
        paymentStatus: 'pending',
      },
    ],
  });

  res.status(201).json({ booking });
});

const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('itineraryId')
    .populate('organizerId', 'name email');

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  // Check access: organizer or listed participant
  const isOrganizer = booking.organizerId._id.equals(req.user._id);
  const isParticipant = booking.participants.some(p => p.userId && p.userId.equals(req.user._id));

  if (!isOrganizer && !isParticipant) {
    return res.status(403).json({ message: 'Not authorized to view this booking' });
  }

  res.status(200).json({ booking });
});

const updateSplit = asyncHandler(async (req, res) => {
  const { splitEnabled, splitMethod, participants } = req.body;

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  if (!booking.organizerId.equals(req.user._id)) {
    return res.status(403).json({ message: 'Not authorized to update this booking' });
  }

  if (booking.status !== 'draft') {
    return res.status(400).json({ message: 'Can only modify draft bookings' });
  }

  // Validate input
  if (typeof splitEnabled !== 'boolean') {
    return res.status(400).json({ message: 'splitEnabled must be a boolean' });
  }

  if (!['equal', 'custom'].includes(splitMethod)) {
    return res.status(400).json({ message: 'splitMethod must be "equal" or "custom"' });
  }

  // If split enabled, compute shares based on method
  let finalParticipants = participants;
  if (splitEnabled) {
    const validationError = validateParticipants(participants, booking.totalCost, splitMethod);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    // Compute shares if equal split
    if (splitMethod === 'equal') {
      const shares = computeEqualSplit(participants.length, booking.totalCost);
      finalParticipants = participants.map((p, idx) => ({
        ...p,
        shareAmount: shares[idx],
      }));
    }
  } else {
    // If split disabled, only organizer is participant with full cost
    finalParticipants = [
      {
        name: booking.participants[0].name,
        email: booking.participants[0].email,
        userId: booking.participants[0].userId,
        isOrganizer: true,
        shareAmount: booking.totalCost,
        paymentStatus: 'pending',
      },
    ];
  }

  booking.splitEnabled = splitEnabled;
  booking.splitMethod = splitMethod;
  booking.participants = finalParticipants;
  await booking.save();

  res.status(200).json({ booking });
});

const confirmBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  if (!booking.organizerId.equals(req.user._id)) {
    return res.status(403).json({ message: 'Not authorized to confirm this booking' });
  }

  if (booking.status !== 'draft') {
    return res.status(400).json({ message: 'Only draft bookings can be confirmed' });
  }

  // Validate split totals
  const totalShares = booking.participants.reduce((sum, p) => sum + Number(p.shareAmount), 0);
  if (Math.abs(totalShares - booking.totalCost) > ROUNDING_TOLERANCE) {
    return res.status(400).json({
      message: `total of shared amounts (${totalShares}) must equal trip cost (${booking.totalCost})`,
    });
  }

  booking.status = 'confirmed';
  await booking.save();

  res.status(200).json({ booking });
});

const markParticipantPaid = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  if (!booking.organizerId.equals(req.user._id)) {
    return res.status(403).json({ message: 'Not authorized to update this booking' });
  }

  const participant = booking.participants.id(req.params.participantId);
  if (!participant) {
    return res.status(404).json({ message: 'Participant not found' });
  }

  participant.paymentStatus = 'paid';
  participant.paidAt = new Date();
  await booking.save();

  res.status(200).json({ booking });
});

module.exports = {
  createBooking,
  getBooking,
  updateSplit,
  confirmBooking,
  markParticipantPaid,
};
