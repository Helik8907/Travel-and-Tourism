const mongoose = require('mongoose');
const { mongoUrl } = require('../config/config.js');
const { successColor, errorColor } = require('../utils/colors.js');
const Destination = require('../models/destination_model.js');
const User = require('../models/user_model.js');

const destinationsData = [
  {
    name: 'Eiffel Tower',
    city: 'Paris',
    country: 'France',
    type: ['City', 'Historical', 'Cultural'],
    description: 'Iconic iron lattice tower and the symbol of Paris.',
    images: [],
    cost_range: { min: 500, max: 2500 },
    best_months: ['April', 'May', 'June', 'September'],
    weather: { min_temp: 5, max_temp: 25, condition: 'Temperate' },
    entry_req: ['Valid Passport', 'Schengen Visa'],
    time_take: '3 Days',
  },
  {
    name: 'Bali Beaches',
    city: 'Denpasar',
    country: 'Indonesia',
    type: ['Beach', 'Nature', 'Adventure'],
    description: 'Tropical paradise known for beaches, temples and rice terraces.',
    images: [],
    cost_range: { min: 400, max: 2000 },
    best_months: ['May', 'June', 'July', 'August'],
    weather: { min_temp: 24, max_temp: 33, condition: 'Tropical' },
    entry_req: ['Valid Passport', 'Visa on Arrival'],
    time_take: '5 Days',
  },
  {
    name: 'Mount Fuji',
    city: 'Fujinomiya',
    country: 'Japan',
    type: ['Mountain', 'Nature', 'Adventure'],
    description: 'Japan\'s tallest peak and an iconic cultural symbol.',
    images: [],
    cost_range: { min: 600, max: 2200 },
    best_months: ['July', 'August', 'September'],
    weather: { min_temp: 0, max_temp: 20, condition: 'Cold' },
    entry_req: ['Valid Passport', 'Visa'],
    time_take: '2 Days',
  },
  {
    name: 'Grand Canyon',
    city: 'Arizona',
    country: 'United States',
    type: ['Nature', 'Adventure'],
    description: 'Massive steep-sided canyon carved by the Colorado River.',
    images: [],
    cost_range: { min: 700, max: 3000 },
    best_months: ['March', 'April', 'May', 'October'],
    weather: { min_temp: 5, max_temp: 35, condition: 'Arid' },
    entry_req: ['Valid Passport', 'US Visa'],
    time_take: '3 Days',
  },
  {
    name: 'Taj Mahal',
    city: 'Agra',
    country: 'India',
    type: ['Historical', 'Cultural'],
    description: 'Ivory-white marble mausoleum and UNESCO World Heritage Site.',
    images: [],
    cost_range: { min: 100, max: 800 },
    best_months: ['October', 'November', 'December', 'January', 'February'],
    weather: { min_temp: 10, max_temp: 30, condition: 'Temperate' },
    entry_req: ['Valid ID / Passport'],
    time_take: '1 Day',
  },
  {
    name: 'Santorini',
    city: 'Thira',
    country: 'Greece',
    type: ['Beach', 'City', 'Cultural'],
    description: 'Volcanic island famed for whitewashed, blue-domed buildings.',
    images: [],
    cost_range: { min: 600, max: 2800 },
    best_months: ['May', 'June', 'September', 'October'],
    weather: { min_temp: 15, max_temp: 30, condition: 'Mediterranean' },
    entry_req: ['Valid Passport', 'Schengen Visa'],
    time_take: '4 Days',
  },
  {
    name: 'Great Barrier Reef',
    city: 'Cairns',
    country: 'Australia',
    type: ['Beach', 'Nature', 'Adventure'],
    description: 'World\'s largest coral reef system, ideal for diving and snorkeling.',
    images: [],
    cost_range: { min: 800, max: 3500 },
    best_months: ['June', 'July', 'August', 'September'],
    weather: { min_temp: 20, max_temp: 30, condition: 'Tropical' },
    entry_req: ['Valid Passport', 'Australian Visa'],
    time_take: '5 Days',
  },
  {
    name: 'Machu Picchu',
    city: 'Cusco',
    country: 'Peru',
    type: ['Mountain', 'Historical', 'Adventure'],
    description: 'Ancient Incan citadel set high in the Andes Mountains.',
    images: [],
    cost_range: { min: 700, max: 2600 },
    best_months: ['May', 'June', 'July', 'August'],
    weather: { min_temp: 5, max_temp: 20, condition: 'Cool' },
    entry_req: ['Valid Passport'],
    time_take: '4 Days',
  },
  {
    name: 'Serengeti National Park',
    city: 'Arusha',
    country: 'Tanzania',
    type: ['Nature', 'Adventure'],
    description: 'Vast ecosystem famous for its annual wildebeest migration.',
    images: [],
    cost_range: { min: 900, max: 4000 },
    best_months: ['June', 'July', 'August', 'September'],
    weather: { min_temp: 15, max_temp: 28, condition: 'Savanna' },
    entry_req: ['Valid Passport', 'Visa', 'Yellow Fever Certificate'],
    time_take: '6 Days',
  },
  {
    name: 'Great Wall of China',
    city: 'Beijing',
    country: 'China',
    type: ['Historical', 'Cultural', 'Adventure'],
    description: 'Ancient series of fortifications stretching across northern China.',
    images: [],
    cost_range: { min: 500, max: 2200 },
    best_months: ['September', 'October', 'April', 'May'],
    weather: { min_temp: -5, max_temp: 30, condition: 'Continental' },
    entry_req: ['Valid Passport', 'Chinese Visa'],
    time_take: '2 Days',
  },
  {
    name: 'Petra',
    city: 'Ma\'an',
    country: 'Jordan',
    type: ['Historical', 'Cultural', 'Adventure'],
    description: 'Ancient city carved into rose-colored rock faces.',
    images: [],
    cost_range: { min: 500, max: 2000 },
    best_months: ['March', 'April', 'May', 'October'],
    weather: { min_temp: 10, max_temp: 30, condition: 'Arid' },
    entry_req: ['Valid Passport', 'Visa on Arrival'],
    time_take: '2 Days',
  },
  {
    name: 'Amazon Rainforest',
    city: 'Manaus',
    country: 'Brazil',
    type: ['Nature', 'Adventure'],
    description: 'The world\'s largest tropical rainforest, rich in biodiversity.',
    images: [],
    cost_range: { min: 800, max: 3200 },
    best_months: ['June', 'July', 'August'],
    weather: { min_temp: 22, max_temp: 33, condition: 'Tropical' },
    entry_req: ['Valid Passport', 'Visa'],
    time_take: '5 Days',
  },
  {
    name: 'Swiss Alps',
    city: 'Interlaken',
    country: 'Switzerland',
    type: ['Mountain', 'Nature', 'Adventure'],
    description: 'Breathtaking alpine scenery perfect for skiing and hiking.',
    images: [],
    cost_range: { min: 1000, max: 4500 },
    best_months: ['December', 'January', 'February', 'July', 'August'],
    weather: { min_temp: -10, max_temp: 20, condition: 'Alpine' },
    entry_req: ['Valid Passport', 'Schengen Visa'],
    time_take: '5 Days',
  },
  {
    name: 'Pyramids of Giza',
    city: 'Giza',
    country: 'Egypt',
    type: ['Historical', 'Cultural'],
    description: 'Ancient monumental pyramids and the Great Sphinx.',
    images: [],
    cost_range: { min: 400, max: 1800 },
    best_months: ['October', 'November', 'December', 'January', 'February'],
    weather: { min_temp: 10, max_temp: 30, condition: 'Arid' },
    entry_req: ['Valid Passport', 'Visa on Arrival'],
    time_take: '2 Days',
  },
  {
    name: 'Maldives Islands',
    city: 'Male',
    country: 'Maldives',
    type: ['Beach', 'Nature'],
    description: 'Idyllic overwater bungalows and pristine coral atolls.',
    images: [],
    cost_range: { min: 1200, max: 6000 },
    best_months: ['November', 'December', 'January', 'February', 'March'],
    weather: { min_temp: 25, max_temp: 32, condition: 'Tropical' },
    entry_req: ['Valid Passport', 'Visa on Arrival'],
    time_take: '4 Days',
  },
  {
    name: 'Iguazu Falls',
    city: 'Puerto Iguazu',
    country: 'Argentina',
    type: ['Nature', 'Adventure'],
    description: 'One of the largest and most spectacular waterfall systems.',
    images: [],
    cost_range: { min: 600, max: 2400 },
    best_months: ['March', 'April', 'May', 'September'],
    weather: { min_temp: 15, max_temp: 30, condition: 'Subtropical' },
    entry_req: ['Valid Passport', 'Visa'],
    time_take: '3 Days',
  },
  {
    name: 'Reykjavik & Northern Lights',
    city: 'Reykjavik',
    country: 'Iceland',
    type: ['Nature', 'Adventure', 'Other'],
    description: 'Land of fire and ice, famous for auroras and geothermal springs.',
    images: [],
    cost_range: { min: 1000, max: 4200 },
    best_months: ['September', 'October', 'February', 'March'],
    weather: { min_temp: -5, max_temp: 15, condition: 'Cold' },
    entry_req: ['Valid Passport', 'Schengen Visa'],
    time_take: '4 Days',
  },
  {
    name: 'Dubai Skyline',
    city: 'Dubai',
    country: 'United Arab Emirates',
    type: ['City', 'Adventure', 'Other'],
    description: 'Ultramodern city known for luxury shopping and the Burj Khalifa.',
    images: [],
    cost_range: { min: 700, max: 3800 },
    best_months: ['November', 'December', 'January', 'February', 'March'],
    weather: { min_temp: 15, max_temp: 40, condition: 'Arid' },
    entry_req: ['Valid Passport', 'Visa on Arrival'],
    time_take: '4 Days',
  },
  {
    name: 'Kyoto Temples',
    city: 'Kyoto',
    country: 'Japan',
    type: ['Cultural', 'Historical', 'City'],
    description: 'Former imperial capital famed for temples, shrines and gardens.',
    images: [],
    cost_range: { min: 600, max: 2600 },
    best_months: ['March', 'April', 'October', 'November'],
    weather: { min_temp: 5, max_temp: 28, condition: 'Temperate' },
    entry_req: ['Valid Passport', 'Visa'],
    time_take: '3 Days',
  },
  {
    name: 'Cape Town & Table Mountain',
    city: 'Cape Town',
    country: 'South Africa',
    type: ['Mountain', 'City', 'Nature'],
    description: 'Coastal city set beneath the iconic flat-topped Table Mountain.',
    images: [],
    cost_range: { min: 700, max: 3000 },
    best_months: ['November', 'December', 'January', 'February'],
    weather: { min_temp: 12, max_temp: 28, condition: 'Mediterranean' },
    entry_req: ['Valid Passport', 'Visa'],
    time_take: '4 Days',
  },
];

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
