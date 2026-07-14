const asyncHandler = require('../middleware/asyncHandler');
const Review = require('../models/review_model');
const Destination = require('../models/destination_model');
const User = require('../models/user_model');

const recalculateDestinationRating = async (destinationId) => {
  const reviews = await Review.find({ destinationId });
  const review_count = reviews.length;
  const avg_rating = review_count
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / review_count
    : 0;

  await Destination.findByIdAndUpdate(destinationId, { avg_rating, review_count });
};

const getDestinationReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ destinationId: req.params.destinationId }).populate('userId', 'name');
  res.status(200).json({ reviews });
});

const createReview = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.destinationId);
  if (!destination) {
    return res.status(404).json({ message: 'Destination not found' });
  }

  const review = await Review.create({
    ...req.body,
    userId: req.user._id,
    destinationId: destination._id,
  });

  destination.reviews.push(review._id);
  await destination.save();
  await recalculateDestinationRating(destination._id);

  req.user.reviews_created.push(review._id);
  await req.user.save();

  res.status(201).json({ review });
});

const editReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }

  if (req.user.role !== 'admin' && !review.userId.equals(req.user._id)) {
    return res.status(403).json({ message: 'Not authorized to edit this review' });
  }

  Object.assign(review, { rating: req.body.rating, comment: req.body.comment });
  await review.save();
  await recalculateDestinationRating(review.destinationId);

  res.status(200).json({ review });
});

const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }

  if (req.user.role !== 'admin' && !review.userId.equals(req.user._id)) {
    return res.status(403).json({ message: 'Not authorized to delete this review' });
  }

  await review.deleteOne();
  await Destination.findByIdAndUpdate(review.destinationId, { $pull: { reviews: review._id } });
  await User.findByIdAndUpdate(review.userId, { $pull: { reviews_created: review._id } });
  await recalculateDestinationRating(review.destinationId);

  res.status(200).json({ message: 'Review deleted' });
});

module.exports = {
  getDestinationReviews,
  createReview,
  editReview,
  deleteReview,
};
