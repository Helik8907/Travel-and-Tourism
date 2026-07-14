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
  const destination = await Destination.create({ ...req.body, created_by: req.user._id });

  req.user.destinations_id.push(destination._id);
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

module.exports = {
  destinationLoader,
  getDestination,
  createDestination,
  editDestination,
  deleteDestination,
};