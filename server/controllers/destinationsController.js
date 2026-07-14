const asyncHandler = require('../middleware/asyncHandler');
const Destination = require('../models/destination_model');

const destinationLoader = asyncHandler(async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.status(200).json({ destinations });
  } catch (error) {
    console.log(error);
    
  }
});

const getDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  if (!destination) {
    return res.status(404).json({ message: 'Destination not found' });
    }
  res.status(200).json({ destination });
});

const createDestination = asyncHandler(async (req, res) => {
  const { cordinates } = req.body;

  if (cordinates?.lat != null && cordinates?.lng != null) {
    const existing = await Destination.findOne({
      'cordinates.lat': cordinates.lat,
      'cordinates.lng': cordinates.lng,
    });
    if (existing) {
      return res.status(409).json({ message: 'A destination with these coordinates already exists' });
    }
  }

  const destination = await Destination.create({ ...req.body, created_by: req.user._id });

  req.user.destinations_created.push(destination._id);
  await req.user.save();

  res.status(201).json({ destination });
});

const editDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  if (!destination) {
    return res.status(404).json({ message: 'Destination not found' });
  }

  if (req.user.role !== 'admin' && !destination.created_by.equals(req.user._id)) {
    return res.status(403).json({ message: 'Not authorized to edit this destination' });
  }

  Object.assign(destination, req.body);
  await destination.save();

  res.status(200).json({ destination });
});

const deleteDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  if (!destination) {
    return res.status(404).json({ message: 'Destination not found' });
  }

  if (req.user.role !== 'admin' && !destination.created_by.equals(req.user._id)) {
    return res.status(403).json({ message: 'Not authorized to delete this destination' });
  }

  await destination.deleteOne();

  res.status(200).json({ message: 'Destination deleted' });
});

const toggleLike = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  if (!destination) {
    return res.status(404).json({ message: 'Destination not found' });
  }

  const alreadyLiked = req.user.destinations_liked.some((id) => id.equals(destination._id));

  if (alreadyLiked) {
    req.user.destinations_liked.pull(destination._id);
    destination.like_count = Math.max(0, destination.like_count - 1);
  } else {
    req.user.destinations_liked.push(destination._id);
    destination.like_count += 1;
  }

  await req.user.save();
  await destination.save();

  res.status(200).json({ liked: !alreadyLiked, like_count: destination.like_count });
});

module.exports = {
  destinationLoader,
  getDestination,
  createDestination,
  editDestination,
  deleteDestination,
  toggleLike,
};