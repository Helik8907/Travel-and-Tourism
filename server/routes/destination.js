const express = require('express');
const {
  destinationLoader,
  getDestination,
  createDestination,
  editDestination,
  deleteDestination,
} = require('../controllers/destinationsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', destinationLoader);
router.get('/:id', getDestination);
router.post('/', protect, createDestination);
router.put('/:id', protect, editDestination);
router.delete('/:id', protect, deleteDestination);

module.exports = router;
