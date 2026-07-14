const mongoose = require('mongoose');
const { mongoUrl } = require('../config/config.js');
const { successColor, errorColor } = require('../utils/colors.js');
const seedAdmin = require('./adminSeeder.js');
const seedDestinations = require('./sample.js');

const run = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log(successColor, '✅ Database Connected successfully...');

    await seedAdmin();
    await seedDestinations();
  } catch (error) {
    console.log(errorColor, '❌ Seeding error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

run();
