const express = require('express');
const { me } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, me);

module.exports = router;
