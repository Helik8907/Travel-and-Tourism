const mongoose = require('mongoose');
const { mongoUrl } = require('../config/config.js');
const { successColor, errorColor } = require('../utils/colors.js');
const Destination = require('../models/destination_model.js');
const User = require('../models/user_model.js');

const destinationsData = require("./sample.js");

const seedDestinations = async () => {
  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    console.log(errorColor, '❌ No admin user found. Run adminSeeder.js before seeding destinations.');
    return;
  }

  const destinationNames = destinationsData.map((destination) => destination.name);
  const existingDestinations = await Destination.find({ name: { $in: destinationNames } }).select('name');
  const existingNames = new Set(existingDestinations.map((destination) => destination.name));

  const newDestinations = destinationsData.filter((destination) => !existingNames.has(destination.name));

  if (newDestinations.length === 0) {
    console.log(successColor, 'ℹ️  All destinations already exist, skipping seeding.');
    return;
  }

  const insertedDestinations = await Destination.insertMany(newDestinations);

  admin.destinations_id.push(...insertedDestinations.map((destination) => destination._id));
  await admin.save();

  console.log(successColor, `✅ ${insertedDestinations.length} destination(s) added by admin (${admin.email}) seeded successfully...`);
};

const run = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log(successColor, '✅ Database Connected successfully...');
    await seedDestinations();
  } catch (error) {
    console.log(errorColor, '❌ Destination seeding error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

if (require.main === module) {
  run();
}

module.exports = seedDestinations;
