const express = require('express');
const { me, updateMe, profile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, me);
router.put('/', protect, updateMe);
router.get('/profile', protect, profile);

module.exports = router;
