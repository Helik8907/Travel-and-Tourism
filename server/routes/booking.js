const express = require('express');
const {
  createBooking,
  getBooking,
  updateSplit,
  confirmBooking,
  markParticipantPaid,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/:id', protect, getBooking);
router.put('/:id/split', protect, updateSplit);
router.post('/:id/confirm', protect, confirmBooking);
router.patch('/:id/participants/:participantId/pay', protect, markParticipantPaid);

module.exports = router;
