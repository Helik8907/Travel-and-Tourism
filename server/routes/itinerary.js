const express = require('express');
const {
  createItinerary,
  myItineraries,
  getItinerary,
  updateItinerary,
  deleteItinerary,
} = require('../controllers/itineraryController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, myItineraries);
router.get('/:id', protect, getItinerary);
router.post('/', protect, createItinerary);
router.put('/:id', protect, updateItinerary);
router.delete('/:id', protect, deleteItinerary);

module.exports = router;
