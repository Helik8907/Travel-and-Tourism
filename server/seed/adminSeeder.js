const mongoose = require('mongoose');
const { mongoUrl } = require('../config/config.js');
const { successColor, errorColor } = require('../utils/colors.js');
const User = require('../models/user_model.js');

const adminData = {
  name: 'Admin',
  email: 'admin@gmail.com',
  password: 'admin123',
  role: 'admin',
  resident: 'India',
};

const seedAdmin = async () => {
  const existingAdmin = await User.findOne({ email: adminData.email });
  if (existingAdmin) {
    console.log(successColor, 'ℹ️  Admin already exists, skipping seeding.');
    return;
  }

  await User.create(adminData);
  console.log(successColor, '✅ Admin user seeded successfully...');
};

const run = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log(successColor, '✅ Database Connected successfully...');
    await seedAdmin();
  } catch (error) {
    console.log(errorColor, '❌ Admin seeding error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

if (require.main === module) {
  run();
}

module.exports = seedAdmin;