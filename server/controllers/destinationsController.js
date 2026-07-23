const asyncHandler = require('../middleware/asyncHandler');
const Destination = require('../models/destination_model');

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
            query: city, //val from serch bar  
            path: ["name", "city","state","country"], //path  where you want to check
            fuzzy: {
              maxEdits: 2,       
              prefixLength: 0    
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