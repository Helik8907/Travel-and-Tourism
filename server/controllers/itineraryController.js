const asyncHandler = require('../middleware/asyncHandler');
const Itinerary = require('../models/itinerary_model');

const validateItineraryPayload = (body) => {
  const { title, startDate, endDate, avg_cost, cost_range, days } = body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return 'title is required';
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 'startDate and endDate must be valid dates';
  }
  if (end < start) {
    return 'endDate must be the same or after startDate';
  }

  if (!Number.isFinite(Number(avg_cost)) || Number(avg_cost) <= 0) {
    return 'avg_cost must be a number greater than 0';
  }

  if (!cost_range || typeof cost_range !== 'object') {
    return 'cost_range is required';
  }

  const minCost = Number(cost_range.min);
  const maxCost = Number(cost_range.max);
  if (!Number.isFinite(minCost) || !Number.isFinite(maxCost)) {
    return 'cost_range.min and cost_range.max must be valid numbers';
  }
  if (minCost <= 0) {
    return 'cost_range.min must be greater than 0';
  }
  if (maxCost < 0) {
    return 'cost_range.max cannot be negative';
  }
  if (maxCost !== 0 && maxCost <= minCost) {
    return 'cost_range.max must be 0 or greater than cost_range.min';
  }

  if (!Array.isArray(days) || days.length === 0) {
    return 'days is required and must contain at least one day';
  }

  for (const day of days) {
    if (!Number.isFinite(Number(day.dayNumber)) || Number(day.dayNumber) <= 0) {
      return 'each day must have a valid dayNumber greater than 0';
    }
    if (!Array.isArray(day.entries)) {
      return 'each day must include an entries array';
    }
    for (const entry of day.entries) {
      if (!entry.destinationId) {
        return 'each stop must include a destinationId';
      }
      if (!entry.time || typeof entry.time !== 'string') {
        return 'each stop must include a valid time';
      }
      if (!Number.isFinite(Number(entry.cost)) || Number(entry.cost) < 0) {
        return 'each stop cost must be a number greater than or equal to 0';
      }
    }
  }

  return null;
};

const createItinerary = asyncHandler(async (req, res) => {
  const validationError = validateItineraryPayload(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }
  const itinerary = await Itinerary.create({ ...req.body, userId: req.user._id });

  req.user.itineraries.push(itinerary._id);
  await req.user.save();

  res.status(201).json({ itinerary });
});

const myItineraries = asyncHandler(async (req, res) => {
  const itineraries = await Itinerary.find({ userId: req.user._id }).sort('-createdAt');
  res.status(200).json({ itineraries });
});

const getItinerary = asyncHandler(async (req, res) => {
  const itinerary = await Itinerary.findById(req.params.id);
  if (!itinerary) {
    return res.status(404).json({ message: 'Itinerary not found' });
  }

  if (!itinerary.userId.equals(req.user._id)) {
    return res.status(403).json({ message: 'Not authorized to view this itinerary' });
  }

  res.status(200).json({ itinerary });
});

const updateItinerary = asyncHandler(async (req, res) => {
  const itinerary = await Itinerary.findById(req.params.id);
  if (!itinerary) {
    return res.status(404).json({ message: 'Itinerary not found' });
  }

  if (!itinerary.userId.equals(req.user._id)) {
    return res.status(403).json({ message: 'Not authorized to edit this itinerary' });
  }

  const validationError = validateItineraryPayload(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  Object.assign(itinerary, req.body);
  await itinerary.save();

  res.status(200).json({ itinerary });
});

const deleteItinerary = asyncHandler(async (req, res) => {
  const itinerary = await Itinerary.findById(req.params.id);
  if (!itinerary) {
    return res.status(404).json({ message: 'Itinerary not found' });
  }

  if (!itinerary.userId.equals(req.user._id)) {
    return res.status(403).json({ message: 'Not authorized to delete this itinerary' });
  }

  await itinerary.deleteOne();

  req.user.itineraries.pull(itinerary._id);
  await req.user.save();

  res.status(200).json({ message: 'Itinerary deleted' });
});

module.exports = {
  createItinerary,
  myItineraries,
  getItinerary,
  updateItinerary,
  deleteItinerary,
};
