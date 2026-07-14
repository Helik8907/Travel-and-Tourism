// Express endpoint using free OpenStreetMap data

const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Ensures your React app can talk to this backend
require('dotenv').config(); // Loads your API key from a .env file securely
const router = express.Router();
const searchHoteal=require("../controllers/serchController");


router.post('/', searchHoteal);


module.exports = router;