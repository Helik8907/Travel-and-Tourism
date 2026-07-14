const express = require('express');
const {
  getDestinationReviews,
  createReview,
  editReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/destination/:destinationId', getDestinationReviews);
router.post('/destination/:destinationId', protect, createReview);
router.put('/:id', protect, editReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
