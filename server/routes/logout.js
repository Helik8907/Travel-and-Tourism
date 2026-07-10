const express = require('express');
const { logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, logout);

module.exports = router;
