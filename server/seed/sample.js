const mongoose = require('mongoose');
const { mongoUrl } = require('../config/config.js');
const { successColor, errorColor } = require('../utils/colors.js');
const Destination = require('../models/destination_model.js');
const User = require('../models/user_model.js');

const destinationsData = [
               {
    _id: "65cb76e4f3a2b1cd4e890101",
    name: "Taj Mahal and Agra Fort",
    city: "Agra",
    country: "India",
    type: ["Historical", "Cultural"],
    description: "The iconic white marble mausoleum built by Shah Jahan, paired with the massive red sandstone Agra Fort.",
    images: ["https://example.com/taj1.jpg", "https://example.com/agrafort.jpg"],
    cost_range: { min: 15, max: 100 },
    best_months: ["October", "November", "December", "January", "February"],
    weather: { min_temp: 10, max_temp: 32, condition: "Clear and Pleasant" },
    entry_req: ["Passport/ID required", "Ticket needed for monument entry"],
    avg_rating: 4.9,
    reviews: ["65cb7785f3a2b1cd4e890201"],
    review_count: 1,
    time_take: "1 Day"
  },

  // 2. Goa (Beach/Adventure)
  {
    _id: "65cb76e4f3a2b1cd4e890102",
    name: "Calangute Beach and Water Sports",
    city: "Goa",
    country: "India",
    type: ["Beach", "Adventure"],
    description: "One of Goa's busiest beaches, famous for parasailing, jet-skiing, and lively shacks.",
    images: ["https://example.com/goa_beach.jpg"],
    cost_range: { min: 30, max: 250 },
    best_months: ["November", "December", "January", "February"],
    weather: { min_temp: 24, max_temp: 33, condition: "Sunny and Humid" },
    entry_req: ["Free entry to beach", "Paid water sports packages"],
    avg_rating: 4.4,
    reviews: [],
    review_count: 0,
    time_take: "1-2 Days"
  },

  // 3. Leh Ladakh (Mountain/Adventure/Nature)
  {
    _id: "65cb76e4f3a2b1cd4e890103",
    name: "Pangong Tso Lake",
    city: "Leh Ladakh",
    country: "India",
    type: ["Mountain", "Adventure", "Nature"],
    description: "A breathtaking high-altitude endorheic lake famous for changing colors from blue to green.",
    images: ["https://example.com/pangong.jpg"],
    cost_range: { min: 60, max: 350 },
    best_months: ["June", "July", "August", "September"],
    weather: { min_temp: -5, max_temp: 15, condition: "Cold and Windy" },
    entry_req: ["Inner Line Permit (ILP) required for domestic/foreign tourists"],
    avg_rating: 4.8,
    reviews: ["65cb7785f3a2b1cd4e890202"],
    review_count: 1,
    time_take: "2 Days"
  },

  // 4. Jaipur (Cultural/Historical/City)
  {
    _id: "65cb76e4f3a2b1cd4e890104",
    name: "Amer Fort and Hawa Mahal",
    city: "Jaipur",
    country: "India",
    type: ["Historical", "Cultural", "City"],
    description: "Immerse yourself in royal Rajasthani heritage exploring grand palaces and the famous Palace of Winds.",
    images: ["https://example.com/hawamahal.jpg"],
    cost_range: { min: 20, max: 150 },
    best_months: ["October", "November", "January", "February"],
    weather: { min_temp: 12, max_temp: 30, condition: "Sunny" },
    entry_req: ["Composite entry ticket recommended"],
    avg_rating: 4.7,
    reviews: [],
    review_count: 0,
    time_take: "1-2 Days"
  },

  // 5. Munnar (Nature/Mountain)
  {
    _id: "65cb76e4f3a2b1cd4e890105",
    name: "Tata Tea Plantations & Eravikulam",
    city: "Munnar",
    country: "India",
    type: ["Nature", "Mountain"],
    description: "Lush green rolling hills draped in tea estates, home to the endangered Nilgiri Tahr.",
    images: ["https://example.com/munnar_tea.jpg"],
    cost_range: { min: 25, max: 180 },
    best_months: ["September", "October", "November", "December", "January", "March"],
    weather: { min_temp: 15, max_temp: 25, condition: "Misty and Cool" },
    entry_req: ["National Park entry fee applies"],
    avg_rating: 4.6,
    reviews: [],
    review_count: 0,
    time_take: "2 Days"
  },

  // 6. Varanasi (Cultural/Historical)
  {
    _id: "65cb76e4f3a2b1cd4e890106",
    name: "Ganga Aarti at Dashashwamedh Ghat",
    city: "Varanasi",
    country: "India",
    type: ["Cultural", "Historical"],
    description: "Experience the profound spiritual ceremony performed every evening on the banks of the sacred Ganges River.",
    images: ["https://example.com/ganga_aarti.jpg"],
    cost_range: { min: 5, max: 80 },
    best_months: ["October", "November", "December", "January", "February"],
    weather: { min_temp: 11, max_temp: 29, condition: "Foggy Mornings, Clear Evenings" },
    entry_req: ["Free public viewing", "Paid boat rides available"],
    avg_rating: 4.9,
    reviews: [],
    review_count: 0,
    time_take: "1 Day"
  },

  // 7. Ranthambore (Nature/Adventure)
  {
    _id: "65cb76e4f3a2b1cd4e890107",
    name: "Ranthambore National Park Tiger Safari",
    city: "Sawai Madhopur",
    country: "India",
    type: ["Nature", "Adventure"],
    description: "One of the best places in India to spot Bengal Tigers in their natural desert-forest habitat.",
    images: ["https://example.com/tiger.jpg"],
    cost_range: { min: 40, max: 200 },
    best_months: ["November", "December", "January", "February", "March", "April"],
    weather: { min_temp: 14, max_temp: 38, condition: "Dry and Warm" },
    entry_req: ["Advance online safari booking mandatory"],
    avg_rating: 4.5,
    reviews: [],
    review_count: 0,
    time_take: "2 Days"
  },

  // 8. Rishikesh (Adventure/Cultural)
  {
    _id: "65cb76e4f3a2b1cd4e890108",
    name: "White Water Rafting and Yoga Ashrams",
    city: "Rishikesh",
    country: "India",
    type: ["Adventure", "Cultural"],
    description: "The Yoga Capital of the World, offering intense Himalayan river rafting mixed with tranquil spirituality.",
    images: ["https://example.com/rafting.jpg"],
    cost_range: { min: 20, max: 120 },
    best_months: ["March", "April", "May", "September", "October", "November"],
    weather: { min_temp: 15, max_temp: 35, condition: "Clear Skies" },
    entry_req: ["Medical fitness self-declaration for rafting"],
    avg_rating: 4.7,
    reviews: [],
    review_count: 0,
    time_take: "2-3 Days"
  },

  // 9. Alleppey (Nature/Other)
  {
    _id: "65cb76e4f3a2b1cd4e890109",
    name: "Kerala Backwaters Houseboat Cruise",
    city: "Alleppey",
    country: "India",
    type: ["Nature", "Other"],
    description: "Glide through palm-fringed canals, serene lakes, and emerald paddy fields in a traditional Kettuvallam.",
    images: ["https://example.com/houseboat.jpg"],
    cost_range: { min: 80, max: 500 },
    best_months: ["October", "November", "December", "January", "February"],
    weather: { min_temp: 23, max_temp: 32, condition: "Tropical Coastline" },
    entry_req: ["Prior houseboat booking highly recommended"],
    avg_rating: 4.6,
    reviews: [],
    review_count: 0,
    time_take: "1-2 Days"
  },

  // 10. Hampi (Historical/Cultural)
  {
    _id: "65cb76e4f3a2b1cd4e890110",
    name: "Virupaksha Temple and Ruins",
    city: "Hampi",
    country: "India",
    type: ["Historical", "Cultural"],
    description: "A UNESCO World Heritage site showcasing the majestic boulder-strewn ruins of the Vijayanagara Empire.",
    images: ["https://example.com/hampi.jpg"],
    cost_range: { min: 10, max: 90 },
    best_months: ["October", "November", "December", "January", "February"],
    weather: { min_temp: 18, max_temp: 34, condition: "Hot and Dry" },
    entry_req: ["ASI Monument entry ticket required"],
    avg_rating: 4.8,
    reviews: [],
    review_count: 0,
    time_take: "2-3 Days"
  },
  //11.mumbai
  {
    _id: "65cb76e4f3a2b1cd4e890501",
    name: "Gateway of India and Marine Drive",
    city: "Mumbai",
    country: "India",
    type: ["City", "Cultural"],
    description: "The monumental arch facing the Arabian Sea, paired with the iconic seaside promenade known as the Queen's Necklace.",
    images: ["https://example.com/gateway.jpg", "https://example.com/marinedrive.jpg"],
    cost_range: { min: 20, max: 400 },
    best_months: ["October", "November", "December", "January", "February", "March"],
    weather: { min_temp: 20, max_temp: 32, condition: "Pleasant Coastal Breeze" },
    entry_req: ["Free public access", "Security screening at Gateway"],
    avg_rating: 4.6,
    reviews: [],
    review_count: 0,
    time_take: "1 Day"
  },

  // 12. Darjeeling (Mountain/Nature)
  {
    _id: "65cb76e4f3a2b1cd4e890502",
    name: "Tiger Hill Sunrise and Toy Train",
    city: "Darjeeling",
    country: "India",
    type: ["Mountain", "Nature"],
    description: "Witness the panoramic sunrise over Mt. Kanchenjunga and ride the historic UNESCO Himalayan steam railway.",
    images: ["https://example.com/darjeeling_sunrise.jpg"],
    cost_range: { min: 30, max: 150 },
    best_months: ["October", "November", "December", "March", "April", "May"],
    weather: { min_temp: 5, max_temp: 18, condition: "Chilly and Misty" },
    entry_req: ["Toy train tickets must be booked via IRCTC"],
    avg_rating: 4.7,
    reviews: [],
    review_count: 0,
    time_take: "2 Days"
  },

  // 13. Jaisalmer (Historical/Adventure/Cultural)
  {
    _id: "65cb76e4f3a2b1cd4e890503",
    name: "Sam Sand Dunes Camping & Desert Safari",
    city: "Jaisalmer",
    country: "India",
    type: ["Historical", "Adventure", "Cultural"],
    description: "Experience camel safaris, Rajasthani folk dance performances, and luxury tent stays amidst the Thar Desert.",
    images: ["https://example.com/jaisalmer_desert.jpg"],
    cost_range: { min: 45, max: 220 },
    best_months: ["November", "December", "January", "February"],
    weather: { min_temp: 8, max_temp: 28, condition: "Dry and Cool Nights" },
    entry_req: ["Prior booking for desert camps required"],
    avg_rating: 4.5,
    reviews: [],
    review_count: 0,
    time_take: "1-2 Days"
  },

  // 14. Amritsar (Cultural/Historical)
  {
    _id: "65cb76e4f3a2b1cd4e890504",
    name: "The Golden Temple (Harmandir Sahib)",
    city: "Amritsar",
    country: "India",
    type: ["Cultural", "Historical"],
    description: "The preeminent spiritual shrine of Sikhism, famous for its golden architecture and massive community kitchen (Langar).",
    images: ["https://example.com/goldentemple.jpg"],
    cost_range: { min: 0, max: 50 },
    best_months: ["October", "November", "January", "February", "March"],
    weather: { min_temp: 7, max_temp: 30, condition: "Clear Skies" },
    entry_req: ["Head covering required", "Feet must be washed before entry"],
    avg_rating: 5.0,
    reviews: [],
    review_count: 0,
    time_take: "1 Day"
  },

  // 15. Havelock Island (Beach/Adventure/Nature)
  {
    _id: "65cb76e4f3a2b1cd4e890505",
    name: "Radhanagar Beach and Scuba Diving",
    city: "Andaman and Nicobar",
    country: "India",
    type: ["Beach", "Adventure", "Nature"],
    description: "Consistently rated among Asia's best beaches, offering pristine white sand and world-class coral reef diving.",
    images: ["https://example.com/radhanagar.jpg"],
    cost_range: { min: 70, max: 500 },
    best_months: ["November", "December", "January", "February", "March", "April"],
    weather: { min_temp: 23, max_temp: 31, condition: "Sunny and Tropical" },
    entry_req: ["Ferry booking from Port Blair required", "Scuba requires medical form"],
    avg_rating: 4.9,
    reviews: [],
    review_count: 0,
    time_take: "3 Days"
  },

  // 16. Udaipur (Historical/Cultural/City)
  {
    _id: "65cb76e4f3a2b1cd4e890506",
    name: "Lake Pichola Boat Cruise & City Palace",
    city: "Udaipur",
    country: "India",
    type: ["Historical", "Cultural", "City"],
    description: "The Venice of the East, boasting serene lakes and the massive, ornate City Palace complex.",
    images: ["https://example.com/udaipur_palace.jpg"],
    cost_range: { min: 25, max: 300 },
    best_months: ["October", "November", "December", "January", "February"],
    weather: { min_temp: 11, max_temp: 30, condition: "Pleasant" },
    entry_req: ["Palace entry ticket separate from boat cruise"],
    avg_rating: 4.8,
    reviews: [],
    review_count: 0,
    time_take: "2 Days"
  },

  // 17. Kaziranga (Nature/Adventure)
  {
    _id: "65cb76e4f3a2b1cd4e890507",
    name: "One-Horned Rhinoceros Wildlife Safari",
    city: "Kaziranga",
    country: "India",
    type: ["Nature", "Adventure"],
    description: "A sanctuary hosting two-thirds of the world's great one-horned rhinoceroses, located on the Brahmaputra plains.",
    images: ["https://example.com/rhino.jpg"],
    cost_range: { min: 35, max: 180 },
    best_months: ["November", "December", "January", "February", "March", "April"],
    weather: { min_temp: 10, max_temp: 28, condition: "Humid/Subtropical" },
    entry_req: ["Park closed during monsoon months"],
    avg_rating: 4.6,
    reviews: [],
    review_count: 0,
    time_take: "2 Days"
  },

  // 18. Ooty (Mountain/Nature)
  {
    _id: "65cb76e4f3a2b1cd4e890508",
    name: "Botanical Gardens and Doddabetta Peak",
    city: "Ooty",
    country: "India",
    type: ["Mountain", "Nature"],
    description: "The Queen of Hill Stations in South India, featuring terraced tea gardens and high panoramic viewpoints.",
    images: ["https://example.com/ooty.jpg"],
    cost_range: { min: 15, max: 120 },
    best_months: ["April", "May", "June", "September", "October", "November"],
    weather: { min_temp: 12, max_temp: 22, condition: "Cool and Crisp" },
    entry_req: ["Nominal eco-tax at city boundary"],
    avg_rating: 4.3,
    reviews: [],
    review_count: 0,
    time_take: "1-2 Days"
  },

  // 19. Khajuraho (Historical/Cultural)
  {
    _id: "65cb76e4f3a2b1cd4e890509",
    name: "Erotic Temples Complex",
    city: "Khajuraho",
    country: "India",
    type: ["Historical", "Cultural"],
    description: "Famous UNESCO group of Hindu and Jain temples known for their stunning, intricate nagara-style architectural carvings.",
    images: ["https://example.com/khajuraho.jpg"],
    cost_range: { min: 10, max: 80 },
    best_months: ["October", "November", "December", "January", "February"],
    weather: { min_temp: 9, max_temp: 32, condition: "Dry and Sunny" },
    entry_req: ["ASI ticket needed for Western Group of temples"],
    avg_rating: 4.6,
    reviews: [],
    review_count: 0,
    time_take: "1 Day"
  },

  // 20. Pondicherry (Cultural/Beach/Other)
  {
    _id: "65cb76e4f3a2b1cd4e890510",
    name: "French Quarter and Promenade Beach",
    city: "Pondicherry",
    country: "India",
    type: ["Cultural", "Beach", "Other"],
    description: "Explore the colonial French heritage streets with mustard-colored villas, cozy cafes, and rocky shorelines.",
    images: ["https://example.com/pondicherry.jpg"],
    cost_range: { min: 20, max: 200 },
    best_months: ["October", "November", "December", "January", "February"],
    weather: { min_temp: 22, max_temp: 31, condition: "Warm and Coastal" },
    entry_req: ["Free access", "Vehicles barred from promenade after 6 PM"],
    avg_rating: 4.5,
    reviews: [],
    review_count: 0,
    time_take: "2 Days"
  },
  // 21. Shimla (Mountain/Nature/Historical)
  {
    _id: "65cb76e4f3a2b1cd4e890701",
    name: "The Ridge and Kalka-Shimla Toy Train",
    city: "Shimla",
    country: "India",
    type: ["Mountain", "Nature", "Historical"],
    description: "The erstwhile summer capital of British India, famous for its colonial architecture, pine-covered hills, and panoramic mountain views.",
    images: ["https://example.com/shimla_ridge.jpg", "https://example.com/shimla_hills.jpg"],
    cost_range: { min: 25, max: 200 },
    best_months: ["March", "April", "May", "October", "November", "December"],
    weather: { min_temp: 4, max_temp: 22, condition: "Cool Alpine Climate" },
    entry_req: ["Free access to city landmarks", "Toy train tickets required via IRCTC"],
    avg_rating: 4.4,
    reviews: [],
    review_count: 0,
    time_take: "2 Days"
  },

  // 22. Mysore (Cultural/Historical)
  {
    _id: "65cb76e4f3a2b1cd4e890702",
    name: "Mysore Palace and Chamundi Hill",
    city: "Mysore",
    country: "India",
    type: ["Cultural", "Historical"],
    description: "An incredibly grand Indo-Saracenic palace that lights up spectacularly on weekends with nearly 100,000 light bulbs.",
    images: ["https://example.com/mysore_palace.jpg"],
    cost_range: { min: 10, max: 120 },
    best_months: ["October", "November", "December", "January", "February"],
    weather: { min_temp: 16, max_temp: 31, condition: "Pleasant and Sunny" },
    entry_req: ["Palace entry fee applicable", "Footwear must be deposited outside"],
    avg_rating: 4.8,
    reviews: [],
    review_count: 0,
    time_take: "1-2 Days"
  },

  // 23. Khajjiar (Nature/Mountain)
  {
    _id: "65cb76e4f3a2b1cd4e890703",
    name: "Khajjiar Lake and Cedar Forests",
    city: "Chamba",
    country: "India",
    type: ["Nature", "Mountain"],
    description: "Often dubbed the 'Mini Switzerland of India', this spot features a stunning saucer-shaped glade surrounded by dense deodar trees.",
    images: ["https://example.com/khajjiar.jpg"],
    cost_range: { min: 15, max: 90 },
    best_months: ["March", "April", "May", "June", "September", "October", "November"],
    weather: { min_temp: 8, max_temp: 24, condition: "Crisp Mountain Air" },
    entry_req: ["Eco-tourism fee at entrance"],
    avg_rating: 4.5,
    reviews: [],
    review_count: 0,
    time_take: "1 Day"
  },

  // 24. Mahabalipuram (Historical/Cultural/Beach)
  {
    _id: "65cb76e4f3a2b1cd4e890704",
    name: "Shore Temple and Five Rathas",
    city: "Mahabalipuram",
    country: "India",
    type: ["Historical", "Cultural", "Beach"],
    description: "7th-century rock-cut monolithic temples and relief carvings showcasing the exceptional architectural brilliance of the Pallava dynasty.",
    images: ["https://example.com/shore_temple.jpg"],
    cost_range: { min: 12, max: 80 },
    best_months: ["October", "November", "December", "January", "February"],
    weather: { min_temp: 22, max_temp: 33, condition: "Warm and Coastal" },
    entry_req: ["Single ASI ticket grants entry to all core monuments"],
    avg_rating: 4.7,
    reviews: [],
    review_count: 0,
    time_take: "1 Day"
  },

  // 25. Gulmarg (Mountain/Adventure)
  {
    _id: "65cb76e4f3a2b1cd4e890705",
    name: "Gulmarg Gondola and Ski Resort",
    city: "Gulmarg",
    country: "India",
    type: ["Mountain", "Adventure"],
    description: "Home to one of the highest cable cars in the world and pristine, snow-covered slopes that attract skiers globally.",
    images: ["https://example.com/gulmarg.jpg"],
    cost_range: { min: 50, max: 400 },
    best_months: ["December", "January", "February", "March"],
    weather: { min_temp: -8, max_temp: 8, condition: "Heavy Snowfall / Freezing" },
    entry_req: ["Gondola tickets must be booked online well in advance"],
    avg_rating: 4.9,
    reviews: [],
    review_count: 0,
    time_take: "2 Days"
  },

  // 26. Pushkar (Cultural/Other)
  {
    _id: "65cb76e4f3a2b1cd4e890706",
    name: "Pushkar Lake and Brahma Temple",
    city: "Pushkar",
    country: "India",
    type: ["Cultural", "Other"],
    description: "A sacred lakeside town featuring one of the world's very few temples dedicated to the Hindu creator god Brahma.",
    images: ["https://example.com/pushkar_lake.jpg"],
    cost_range: { min: 10, max: 100 },
    best_months: ["October", "November", "December", "January", "February"],
    weather: { min_temp: 11, max_temp: 30, condition: "Arid and Clear" },
    entry_req: ["No footwear allowed near the lake ghats", "Alcohol & non-veg banned in town"],
    avg_rating: 4.3,
    reviews: [],
    review_count: 0,
    time_take: "1-2 Days"
  },

  // 27. Jim Corbett (Nature/Adventure)
  {
    _id: "65cb76e4f3a2b1cd4e890707",
    name: "Dhikala Zone Jungle Safari",
    city: "Ramnagar",
    country: "India",
    type: ["Nature", "Adventure"],
    description: "India's oldest national park, offering classic jeep safaris through dense Sal forests to spot wild elephants and tigers.",
    images: ["https://example.com/corbett_safari.jpg"],
    cost_range: { min: 40, max: 250 },
    best_months: ["November", "December", "January", "February", "March", "April", "May"],
    weather: { min_temp: 9, max_temp: 35, condition: "Forest Subtropical" },
    entry_req: ["Night stay permits inside the forest zone must be reserved months prior"],
    avg_rating: 4.6,
    reviews: [],
    review_count: 0,
    time_take: "2 Days"
  },

  // 28. Gokarna (Beach/Nature)
  {
    _id: "65cb76e4f3a2b1cd4e890708",
    name: "Om Beach and Half Moon Beach Trek",
    city: "Gokarna",
    country: "India",
    type: ["Beach", "Nature"],
    description: "A laid-back alternative to Goa, popular for its pristine, cliff-side beaches shaped naturally like the religious 'Om' symbol.",
    images: ["https://example.com/gokarna_obeach.jpg"],
    cost_range: { min: 20, max: 150 },
    best_months: ["October", "November", "December", "January", "February", "March"],
    weather: { min_temp: 22, max_temp: 32, condition: "Sunny Coastline" },
    entry_req: ["Free beach access", "Inter-beach ferries require nominal cash fee"],
    avg_rating: 4.5,
    reviews: [],
    review_count: 0,
    time_take: "2 Days"
  },

  // 29. Ajanta and Ellora (Historical/Cultural)
  {
    _id: "65cb76e4f3a2b1cd4e890709",
    name: "Kailash Temple and Rock-Cut Caves",
    city: "Aurangabad",
    country: "India",
    type: ["Historical", "Cultural"],
    description: "Magnificent rock-cut caves featuring ancient Buddhist paintings and the monolithic Kailash Temple, carved out of a single giant rock.",
    images: ["https://example.com/ellora.jpg"],
    cost_range: { min: 10, max: 70 },
    best_months: ["October", "November", "December", "January", "February", "March"],
    weather: { min_temp: 14, max_temp: 33, condition: "Sunny and Warm" },
    entry_req: ["Caves remain closed on specific weekdays (Ajanta on Mondays, Ellora on Tuesdays)"],
    avg_rating: 4.9,
    reviews: [],
    review_count: 0,
    time_take: "2 Days"
  },

  // 30. Cherrapunji (Nature/Adventure)
  {
    _id: "65cb76e4f3a2b1cd4e890710",
    name: "Double Decker Living Root Bridges",
    city: "Cherrapunji",
    country: "India",
    type: ["Nature", "Adventure"],
    description: "Deep in the northeastern rainforests, discover incredible bio-engineering marvels woven from the roots of living rubber trees.",
    images: ["https://example.com/root_bridge.jpg"],
    cost_range: { min: 15, max: 110 },
    best_months: ["October", "November", "December", "January", "February", "May"],
    weather: { min_temp: 10, max_temp: 23, condition: "Highly Misty / Humid" },
    entry_req: ["Requires a steep downhill trek of roughly 3,000 steps"],
    avg_rating: 4.8,
    reviews: [],
    review_count: 0,
    time_take: "1-2 Days"
  },
  //outside india
  //31.peru(mach picchu)
  {
    "_id": "65cb76e4f3a2b1cd4e890711",
    "name": "Machu Picchu",
    "city": "Cusco Region",
    "country": "Peru",
    "type": ["History", "Adventure", "Nature"],
    "description": "An ancient Incan citadel set high in the Andes Mountains, famed for its sophisticated dry-stone walls and panoramic views.",
    "images": ["https://example.com/machu_picchu.jpg"],
    "cost_range": { "min": 70, "max": 350 },
    "best_months": ["May", "June", "July", "August", "September"],
    "weather": { "min_temp": 11, "max_temp": 25, "condition": "Sunny / Cool Nights" },
    "entry_req": ["Valid Passport", "Pre-booked Circuit Ticket", "Optional Inca Trail Permit"],
    "avg_rating": 4.9,
    "reviews": [],
    "review_count": 0,
    "time_take": "1 Day"
  },

  //32.Oia
  {
    "_id": "65cb76e4f3a2b1cd4e890712",
    "name": "Santorini Caldera",
    "city": "Oia",
    "country": "Greece",
    "type": ["Romance", "Relaxation", "Photography"],
    "description": "World-famous whitewashed houses clinging to volcanic cliffs, offering legendary sunset views over the Aegean Sea.",
    "images": ["https://example.com/santorini.jpg"],
    "cost_range": { "min": 120, "max": 800 },
    "best_months": ["April", "May", "September", "October"],
    "weather": { "min_temp": 15, "max_temp": 29, "condition": "Sunny / Windy" },
    "entry_req": ["Schengen Visa (if applicable)", "Comfortable walking shoes for steep steps"],
    "avg_rating": 4.7,
    "reviews": [],
    "review_count": 0,
    "time_take": "2-3 Days"
  },

  //33.Kyoto
  {
    "_id": "65cb76e4f3a2b1cd4e890713",
    "name": "Fushimi Inari Shrine",
    "city": "Kyoto",
    "country": "Japan",
    "type": ["Culture", "History", "Spirituality"],
    "description": "An iconic Shinto shrine famous for its path of thousands of vibrant vermilion torii gates winding up Mount Inari.",
    "images": ["https://example.com/fushimi_inari.jpg"],
    "cost_range": { "min": 0, "max": 20 },
    "best_months": ["March", "April", "October", "November"],
    "weather": { "min_temp": 5, "max_temp": 22, "condition": "Mild / Clear" },
    "entry_req": ["Free Entry", "Requires a moderate uphill walk to reach the summit"],
    "avg_rating": 4.8,
    "reviews": [],
    "review_count": 0,
    "time_take": "2-4 Hours"
  },

  //34.Alberta
  {
    "_id": "65cb76e4f3a2b1cd4e890714",
    "name": "Banff National Park",
    "city": "Alberta",
    "country": "Canada",
    "type": ["Nature", "Adventure", "Wildlife"],
    "description": "Canada's oldest national park, encompassing mountainous terrain, glacier-fed turquoise lakes, and dense coniferous forests.",
    "images": ["https://example.com/banff.jpg"],
    "cost_range": { "min": 15, "max": 250 },
    "best_months": ["June", "July", "August", "December", "January"],
    "weather": { "min_temp": -10, "max_temp": 22, "condition": "Snowy in Winter / Alpine Crisp in Summer" },
    "entry_req": ["Parks Canada Discovery Pass"],
    "avg_rating": 4.9,
    "reviews": [],
    "review_count": 0,
    "time_take": "3-5 Days"
  },
  //34.
  {
    "_id": "65cb76e4f3a2b1cd4e890715",
    "name": "The Great Pyramids of Giza",
    "city": "Cairo",
    "country": "Egypt",
    "type": ["History", "Culture"],
    "description": "The oldest of the Seven Wonders of the Ancient World, standing tall as a testament to ancient Egyptian engineering.",
    "images": ["https://example.com/pyramids.jpg"],
    "cost_range": { "min": 20, "max": 150 },
    "best_months": ["October", "November", "December", "January", "February"],
    "weather": { "min_temp": 10, "max_temp": 26, "condition": "Dry / Desert Sunny" },
    "entry_req": ["Giza Plateau Ticket", "Separate fee for inside-pyramid access"],
    "avg_rating": 4.6,
    "reviews": [],
    "review_count": 0,
    "time_take": "1 Day"
  },
  //35
  {
    "_id": "65cb76e4f3a2b1cd4e890716",
    "name": "Eiffel Tower",
    "city": "Paris",
    "country": "France",
    "type": ["City Life", "Romance", "Architecture"],
    "description": "The globally recognized wrought-iron lattice tower on the Champ de Mars, offering unmatched views of Paris.",
    "images": ["https://example.com/eiffel_tower.jpg"],
    "cost_range": { "min": 15, "max": 40 },
    "best_months": ["April", "May", "September", "October"],
    "weather": { "min_temp": 8, "max_temp": 24, "condition": "Variable / Mostly Mild" },
    "entry_req": ["Security screening", "Pre-booked timed entry recommended"],
    "avg_rating": 4.7,
    "reviews": [],
    "review_count": 0,
    "time_take": "2-3 Hours"
  },
  //36
  {
    "_id": "65cb76e4f3a2b1cd4e890717",
    "name": "Serengeti National Park",
    "city": "Arusha Region",
    "country": "Tanzania",
    "type": ["Wildlife", "Adventure", "Nature"],
    "description": "Famed for its massive annual migration of wildebeest and zebras, and its vast, golden savanna plains.",
    "images": ["https://example.com/serengeti.jpg"],
    "cost_range": { "min": 80, "max": 1200 },
    "best_months": ["January", "February", "June", "July", "August", "September"],
    "weather": { "min_temp": 15, "max_temp": 28, "condition": "Warm / Dry Seasonal" },
    "entry_req": ["National Park Conservation Fees", "Yellow Fever Vaccination Certificate"],
    "avg_rating": 4.9,
    "reviews": [],
    "review_count": 0,
    "time_take": "3-4 Days"
  },
  //37
  {
    "_id": "65cb76e4f3a2b1cd4e890718",
    "name": "Sydney Opera House",
    "city": "Sydney",
    "country": "Australia",
    "type": ["Architecture", "City Life", "Arts"],
    "description": "A multi-venue performing arts centre identified by its iconic sail-like architectural design over Sydney Harbour.",
    "images": ["https://example.com/opera_house.jpg"],
    "cost_range": { "min": 25, "max": 200 },
    "best_months": ["September", "October", "November", "March", "April"],
    "weather": { "min_temp": 12, "max_temp": 26, "condition": "Sunny / Coastal Breeze" },
    "entry_req": ["Free to view from outside", "Ticket required for internal tours or shows"],
    "avg_rating": 4.7,
    "reviews": [],
    "review_count": 0,
    "time_take": "2-3 Hours"
  },
  //38
  {
    "_id": "65cb76e4f3a2b1cd4e890719",
    "name": "Petra",
    "city": "Ma'an",
    "country": "Jordan",
    "type": ["History", "Adventure", "Archaeology"],
    "description": "The famous archaeological site in Jordan's southwestern desert, featuring tombs and temples carved into pink sandstone cliffs.",
    "images": ["https://example.com/petra.jpg"],
    "cost_range": { "min": 70, "max": 150 },
    "best_months": ["March", "April", "May", "September", "October", "November"],
    "weather": { "min_temp": 9, "max_temp": 28, "condition": "Arid / Sunny" },
    "entry_req": ["Jordan Pass or Entrance Ticket", "Extensive walking required through the Siq"],
    "avg_rating": 4.8,
    "reviews": [],
    "review_count": 0,
    "time_take": "1-2 Days"
  },
  //39
  {
    "_id": "65cb76e4f3a2b1cd4e89071a",
    "name": "Reykjavík Northern Lights",
    "city": "Reykjavík",
    "country": "Iceland",
    "type": ["Nature", "Adventure", "Phenomenon"],
    "description": "Experience the surreal Aurora Borealis illuminating the dark winter skies over dramatic volcanic landscapes.",
    "images": ["https://example.com/northern_lights.jpg"],
    "cost_range": { "min": 40, "max": 220 },
    "best_months": ["September", "October", "November", "December", "January", "February", "March"],
    "weather": { "min_temp": -5, "max_temp": 5, "condition": "Freezing / High Chance of Wind" },
    "entry_req": ["Requires clear, dark night skies and solar activity"],
    "avg_rating": 4.6,
    "reviews": [],
    "review_count": 0,
    "time_take": "1-3 Nights"
  },
  //40
  {
    "_id": "65cb76e4f3a2b1cd4e89071b",
    "name": "Grand Canyon National Park",
    "city": "Arizona",
    "country": "USA",
    "type": ["Nature", "Adventure"],
    "description": "A massive, powerful canyon carved over millions of years by the Colorado River, boasting immense geological scale.",
    "images": ["https://example.com/grand_canyon.jpg"],
    "cost_range": { "min": 20, "max": 110 },
    "best_months": ["March", "April", "May", "September", "October", "November"],
    "weather": { "min_temp": 4, "max_temp": 29, "condition": "Dry / Hot in Canyon Base" },
    "entry_req": ["National Park Vehicle Permit"],
    "avg_rating": 4.9,
    "reviews": [],
    "review_count": 0,
    "time_take": "1-2 Days"
  },
  //41
  {
    "_id": "65cb76e4f3a2b1cd4e89071c",
    "name": "Ha Long Bay",
    "city": "Quang Ninh",
    "country": "Vietnam",
    "type": ["Nature", "Relaxation", "Cruise"],
    "description": "Emerald waters punctuated by thousands of towering limestone islands topped with dense rainforests.",
    "images": ["https://example.com/ha_long_bay.jpg"],
    "cost_range": { "min": 45, "max": 300 },
    "best_months": ["March", "April", "September", "October", "November"],
    "weather": { "min_temp": 18, "max_temp": 28, "condition": "Misty / Tropical Warm" },
    "entry_req": ["Cruise or Boat Tour Ticket"],
    "avg_rating": 4.7,
    "reviews": [],
    "review_count": 0,
    "time_take": "1-2 Days"
  },
  //42
  {
    "_id": "65cb76e4f3a2b1cd4e89071d",
    "name": "Colosseum",
    "city": "Rome",
    "country": "Italy",
    "type": ["History", "Architecture", "Culture"],
    "description": "The largest ancient amphitheater ever built, reflecting the grandeur and architectural might of the Roman Empire.",
    "images": ["https://example.com/colosseum.jpg"],
    "cost_range": { "min": 18, "max": 60 },
    "best_months": ["April", "May", "September", "October"],
    "weather": { "min_temp": 10, "max_temp": 27, "condition": "Sunny / Mediterranean" },
    "entry_req": ["Identity verification matching the pre-booked ticket name"],
    "avg_rating": 4.8,
    "reviews": [],
    "review_count": 0,
    "time_take": "3-4 Hours"
  },
  //43
  {
    "_id": "65cb76e4f3a2b1cd4e89071e",
    "name": "Phi Phi Islands",
    "city": "Krabi",
    "country": "Thailand",
    "type": ["Beach", "Adventure", "Nightlife"],
    "description": "A stunning island group featuring pristine white sand beaches, vibrant coral reefs, and sheer limestone cliffs.",
    "images": ["https://example.com/phi_phi.jpg"],
    "cost_range": { "min": 25, "max": 180 },
    "best_months": ["November", "December", "January", "February", "March"],
    "weather": { "min_temp": 24, "max_temp": 33, "condition": "Tropical / Humid" },
    "entry_req": ["National Park Entry Fee collected upon arrival at Maya Bay / Bamboo Island"],
    "avg_rating": 4.6,
    "reviews": [],
    "review_count": 0,
    "time_take": "1-3 Days"
  },
  //44
  {
    "_id": "65cb76e4f3a2b1cd4e89071f",
    "name": "Bagan Archaeological Zone",
    "city": "Bagan",
    "country": "Myanmar",
    "type": ["History", "Spirituality", "Photography"],
    "description": "An ancient city where the remains of over 2,000 Buddhist temples and pagodas dot the vast green plains.",
    "images": ["https://example.com/bagan.jpg"],
    "cost_range": { "min": 20, "max": 45 },
    "best_months": ["November", "December", "January", "February"],
    "weather": { "min_temp": 16, "max_temp": 31, "condition": "Dry / Warm" },
    "entry_req": ["Bagan Zone Fee ticket"],
    "avg_rating": 4.8,
    "reviews": [],
    "review_count": 0,
    "time_take": "2 Days"
  },
  //45
  {
    "_id": "65cb76e4f3a2b1cd4e890720",
    "name": "Table Mountain",
    "city": "Cape Town",
    "country": "South Africa",
    "type": ["Nature", "Adventure", "City Life"],
    "description": "A prominent flat-topped mountain overlooking the city of Cape Town, offering spectacular coastal views.",
    "images": ["https://example.com/table_mountain.jpg"],
    "cost_range": { "min": 10, "max": 30 },
    "best_months": ["November", "December", "January", "February", "March"],
    "weather": { "min_temp": 14, "max_temp": 27, "condition": "Windy / Clear Skies" },
    "entry_req": ["Cableway ticket or open-access hiking trail permit"],
    "avg_rating": 4.8,
    "reviews": [],
    "review_count": 0,
    "time_take": "3-5 Hours"
  },
  //46
  {
    "_id": "65cb76e4f3a2b1cd4e890721",
    "name": "Salar de Uyuni",
    "city": "Daniel Campos",
    "country": "Bolivia",
    "type": ["Nature", "Photography", "Adventure"],
    "description": "The world's largest salt flat, which transforms into a giant sky-reflecting mirror during the rainy season.",
    "images": ["https://example.com/salt_flats.jpg"],
    "cost_range": { "min": 60, "max": 400 },
    "best_months": ["December", "January", "February", "March", "April"],
    "weather": { "min_temp": -3, "max_temp": 20, "condition": "High Altitude Cold / Sun Intensity" },
    "entry_req": ["4x4 guided tour recommended due to lack of navigation landmarks"],
    "avg_rating": 4.9,
    "reviews": [],
    "review_count": 0,
    "time_take": "1-3 Days"
  },
  //47
  {
    "_id": "65cb76e4f3a2b1cd4e890722",
    "name": "Jeju Island Scenic Coast",
    "city": "Jeju Province",
    "country": "South Korea",
    "type": ["Nature", "Relaxation"],
    "description": "A volcanic island characterized by craters, majestic waterfalls, and unique black sand beaches.",
    "images": ["https://example.com/jeju.jpg"],
    "cost_range": { "min": 15, "max": 140 },
    "best_months": ["April", "May", "September", "October"],
    "weather": { "min_temp": 12, "max_temp": 25, "condition": "Temperate / Coastal Breezes" },
    "entry_req": ["Visa-free entry policy for many nationalities on direct flights"],
    "avg_rating": 4.6,
    "reviews": [],
    "review_count": 0,
    "time_take": "2-3 Days"
  },
  //48
  {
    "_id": "65cb76e4f3a2b1cd4e890723",
    "name": "Plitvice Lakes National Park",
    "city": "Lika-Senj",
    "country": "Croatia",
    "type": ["Nature", "Photography"],
    "description": "A forest reserve world-renowned for its 16 terraced lakes joined by waterfalls and limestone canyons.",
    "images": ["https://example.com/plitvice.jpg"],
    "cost_range": { "min": 15, "max": 45 },
    "best_months": ["May", "June", "September", "October"],
    "weather": { "min_temp": 10, "max_temp": 24, "condition": "Fresh / Shaded Forest Humid" },
    "entry_req": ["Pre-booked timed park admission ticket required online"],
    "avg_rating": 4.8,
    "reviews": [],
    "review_count": 0,
    "time_take": "1 Day"
  },
  //49
  {
    "_id": "65cb76e4f3a2b1cd4e890724",
    "name": "Milford Sound",
    "city": "Fiordland",
    "country": "New Zealand",
    "type": ["Nature", "Adventure", "Cruise"],
    "description": "A breathtaking fiord known for towering Mitre Peak, rainforests, and dramatic cascading waterfalls like Stirling and Bowen falls.",
    "images": ["https://example.com/milford_sound.jpg"],
    "cost_range": { "min": 60, "max": 250 },
    "best_months": ["November", "December", "January", "February", "March"],
    "weather": { "min_temp": 8, "max_temp": 19, "condition": "Highly Rainy / Dramatic Clears" },
    "entry_req": ["Long remote drive or coach tour booking from Queenstown"],
    "avg_rating": 4.9,
    "reviews": [],
    "review_count": 0,
    "time_take": "1 Day"
  },
  //50
  {
    "_id": "65cb76e4f3a2b1cd4e890725",
    "name": "Chichen Itza",
    "city": "Yucatan",
    "country": "Mexico",
    "type": ["History", "Architecture", "Culture"],
    "description": "A vibrant and massive ruined Mayan city dominated by the step-pyramid known as El Castillo.",
    "images": ["https://example.com/chichen_itza.jpg"],
    "cost_range": { "min": 35, "max": 90 },
    "best_months": ["November", "December", "January", "February", "March"],
    "weather": { "min_temp": 19, "max_temp": 34, "condition": "Hot / Tropical Sunshine" },
    "entry_req": ["State and Federal double-ticket entry fee payment at gate"],
    "avg_rating": 4.7,
    "reviews": [],
    "review_count": 0,
    "time_take": "4-6 Hours"
  },
  //51
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
  //52
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
  //53
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
  //54
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
  //55
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
  //56
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
  //57
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
  //58
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
  //59
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
  //60
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
  //61
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
  //62
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
  //63
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
  //64
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
  //65
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
  //66
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
  //67
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
  //68
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
  //69
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

  const newDestinations = destinationsData
    .filter((destination) => !existingNames.has(destination.name))
    .map((destination) => ({ ...destination, created_by: admin._id }));

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
