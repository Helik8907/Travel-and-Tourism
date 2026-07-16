const asyncHandler = require('../middleware/asyncHandler');
const Itinerary = require('../models/itinerary_model');

const createItinerary = asyncHandler(async (req, res) => {
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
