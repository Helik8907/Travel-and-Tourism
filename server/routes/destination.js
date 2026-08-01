const express = require('express');
const {
  destinationLoader,
  getDestination,
  createDestination,
  editDestination,
  deleteDestination,
  toggleLike,
  toggleDislike,
} = require('../controllers/destinationsController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.get('/', destinationLoader);
router.get('/:id', getDestination);
router.post('/', protect, createDestination);
router.put('/:id', protect, editDestination);
router.delete('/:id', protect, deleteDestination);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/dislike', protect, toggleDislike);

module.exports = router;
