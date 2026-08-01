const express = require('express');
const {
  getDestinationReviews,
  createReview,
  getBlogReviews,
  createBlogReview,
  editReview,
  deleteReview,
  toggleLike,
  toggleDislike,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/destination/:destinationId', getDestinationReviews);
router.post('/destination/:destinationId', protect, createReview);
router.get('/blog/:blogId', getBlogReviews);
router.post('/blog/:blogId', protect, createBlogReview);
router.put('/:id', protect, editReview);
router.delete('/:id', protect, deleteReview);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/dislike', protect, toggleDislike);

module.exports = router;
