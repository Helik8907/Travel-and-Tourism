const asyncHandler = require('../middleware/asyncHandler');
const Destination = require('../models/destination_model');

const validateDestinationPayload = (body) => {
  const { cost_range, time_take, weather } = body;

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

  if (!time_take || typeof time_take !== 'object') {
    return 'time_take is required';
  }

  const minTime = Number(time_take.min);
  const maxTime = Number(time_take.max);

  if (!Number.isFinite(minTime) || !Number.isFinite(maxTime)) {
    return 'time_take.min and time_take.max must be valid numbers';
  }
  if (minTime <= 0) {
    return 'time_take.min must be greater than 0';
  }
  if (maxTime < 0) {
    return 'time_take.max cannot be negative';
  }
  if (maxTime !== 0 && maxTime <= minTime) {
    return 'time_take.max must be 0 or greater than time_take.min';
  }

  if (weather && typeof weather === 'object') {
    const minTemp = weather.min_temp;
    const maxTemp = weather.max_temp;
    if (minTemp !== undefined && maxTemp !== undefined) {
      const minTempNum = Number(minTemp);
      const maxTempNum = Number(maxTemp);
      if (!Number.isFinite(minTempNum) || !Number.isFinite(maxTempNum)) {
        return 'weather.min_temp and weather.max_temp must be valid numbers';
      }
      if (maxTempNum !== 0 && maxTempNum <= minTempNum) {
        return 'weather.max_temp must be 0 or greater than weather.min_temp';
      }
    }
  }

  return null;
};

const destinationLoader = asyncHandler(async (req, res) => {
  try {
    const city = req.query.city;

    // 1. IF EMPTY: Return all destinations
    if (!city || city.trim() === "") {
      const destinations = await Destination.find();
      return res.status(200).json({ destinations });
    }

    // 2. IF NOT EMPTY: Run your exact Atlas Search pipeline
    const destinations = await Destination.aggregate([
      {
        $search: {
          index: "default",
          text: {
            query: city,
            path: ["name", "city"],
            fuzzy: {
              maxEdits: 2,
              prefixLength: 1
            }
          }
        }
      }
    ]);

    return res.status(200).json({ destinations });

  } catch (error) {
    console.error("Atlas Search Error:", error);
    return res.status(500).json({ message: "Failed to fetch destinations" });
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
  const validationError = validateDestinationPayload(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

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

  const validationError = validateDestinationPayload(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
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