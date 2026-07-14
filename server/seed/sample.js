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
    cordinates: { lat: 27.1751, lng: 78.0421 },
    type: ["Historical", "Cultural"],
    description: "The iconic white marble mausoleum built by Shah Jahan, paired with the massive red sandstone Agra Fort.",
    images: ["https://images.pexels.com/photos/27732630/pexels-photo-27732630.jpeg","https://images3.alphacoders.com/561/561698.jpg"],
    cost_range: { min: 15, max: 100 },
    best_months: ["October", "November", "December", "January", "February"],
    weather: { min_temp: 10, max_temp: 32, condition: "Clear and Pleasant" },
    entry_req: ["Passport/ID required", "Ticket needed for monument entry"],
    avg_rating: 4.9,
    review_count: 0,
    time_take: "1 Day"
  },

  // 2. Goa (Beach/Adventure)
  {
    _id: "65cb76e4f3a2b1cd4e890102",
    name: "Calangute Beach and Water Sports",
    city: "Goa",
    country: "India",
    cordinates: { lat: 15.5449, lng: 73.7636 },
    type: ["Beach", "Adventure"],
    description: "One of Goa's busiest beaches, famous for parasailing, jet-skiing, and lively shacks.",
    images: ["https://www.dreamandtravel.com/wp-content/uploads/2023/05/Visiting-Calangute-Beach-Goa-Heres-What-You-MUST-Know-Before-Reaching-The-Queen-Of-Beaches-1024x366.jpg"],
    cost_range: { min: 30, max: 250 },
    best_months: ["November", "December", "January", "February"],
    weather: { min_temp: 24, max_temp: 33, condition: "Sunny and Humid" },
    entry_req: ["Free entry to beach", "Paid water sports packages"],
    avg_rating: 4.4,
    review_count: 0,
    time_take: "1-2 Days"
  },

  // 3. Leh Ladakh (Mountain/Adventure/Nature)
  {
    _id: "65cb76e4f3a2b1cd4e890103",
    name: "Pangong Tso Lake",
    city: "Leh Ladakh",
    country: "India",
    cordinates: { lat: 33.75, lng: 78.6167 },
    type: ["Mountain", "Adventure", "Nature"],
    description: "A breathtaking high-altitude endorheic lake famous for changing colors from blue to green.",
    images: ["https://th.bing.com/th/id/R.4f6f6b87203327aa2782d45766ac6374?rik=m6t9QJQqXbqCSA&riu=http%3a%2f%2fwww.thelandofsnows.com%2fwp-content%2fuploads%2f2015%2f03%2fPangongLake-Ladakh-1024x681.jpg&ehk=NFFZuIPyYks%2fnvTui87q9JcRTTuCSCGWl%2fVB1dcPcbc%3d&risl=&pid=ImgRaw&r=0"],
    cost_range: { min: 60, max: 350 },
    best_months: ["June", "July", "August", "September"],
    weather: { min_temp: -5, max_temp: 15, condition: "Cold and Windy" },
    entry_req: ["Inner Line Permit (ILP) required for domestic/foreign tourists"],
    avg_rating: 4.8,
    review_count: 0,
    time_take: "2 Days"
  },

  // 4. Jaipur (Cultural/Historical/City)
  {
    _id: "65cb76e4f3a2b1cd4e890104",
    name: "Amer Fort and Hawa Mahal",
    city: "Jaipur",
    country: "India",
    cordinates: { lat: 26.9855, lng: 75.8513 },
    type: ["Historical", "Cultural", "City"],
    description: "Immerse yourself in royal Rajasthani heritage exploring grand palaces and the famous Palace of Winds.",
    images: ["https://wallpaperaccess.com/full/8548996.jpg"],
    cost_range: { min: 20, max: 150 },
    best_months: ["October", "November", "January", "February"],
    weather: { min_temp: 12, max_temp: 30, condition: "Sunny" },
    entry_req: ["Composite entry ticket recommended"],
    avg_rating: 4.7,
    review_count: 0,
    time_take: "1-2 Days"
  },

  // 5. Munnar (Nature/Mountain)
  {
    _id: "65cb76e4f3a2b1cd4e890105",
    name: "Tata Tea Plantations & Eravikulam",
    city: "Munnar",
    country: "India",
    cordinates: { lat: 10.0889, lng: 77.0595 },
    type: ["Nature", "Mountain"],
    description: "Lush green rolling hills draped in tea estates, home to the endangered Nilgiri Tahr.",
    images: ["https://thumbs.dreamstime.com/b/scenic-view-over-eravikulam-national-park-tea-plantations-kerala-south-india-sunny-day-178311495.jpg?w=768"],
    cost_range: { min: 25, max: 180 },
    best_months: ["September", "October", "November", "December", "January", "March"],
    weather: { min_temp: 15, max_temp: 25, condition: "Misty and Cool" },
    entry_req: ["National Park entry fee applies"],
    avg_rating: 4.6,
    review_count: 0,
    time_take: "2 Days"
  },

  // 6. Varanasi (Cultural/Historical)
  {
    _id: "65cb76e4f3a2b1cd4e890106",
    name: "Ganga Aarti at Dashashwamedh Ghat",
    city: "Varanasi",
    country: "India",
    cordinates: { lat: 25.3109, lng: 83.0107 },
    type: ["Cultural", "Historical"],
    description: "Experience the profound spiritual ceremony performed every evening on the banks of the sacred Ganges River.",
    images: ["https://thetravelshots.com/wp-content/uploads/2021/02/VAranasi.jpg"],
    cost_range: { min: 5, max: 80 },
    best_months: ["October", "November", "December", "January", "February"],
    weather: { min_temp: 11, max_temp: 29, condition: "Foggy Mornings, Clear Evenings" },
    entry_req: ["Free public viewing", "Paid boat rides available"],
    avg_rating: 4.9,
    review_count: 0,
    time_take: "1 Day"
  },

  // 7. Ranthambore (Nature/Adventure)
  {
    _id: "65cb76e4f3a2b1cd4e890107",
    name: "Ranthambore National Park Tiger Safari",
    city: "Sawai Madhopur",
    country: "India",
    cordinates: { lat: 26.0173, lng: 76.5026 },
    type: ["Nature", "Adventure"],
    description: "One of the best places in India to spot Bengal Tigers in their natural desert-forest habitat.",
    images: ["https://www.tourmyindia.com/socialimg/ranthambore-national-park.jpg"],
    cost_range: { min: 40, max: 200 },
    best_months: ["November", "December", "January", "February", "March", "April"],
    weather: { min_temp: 14, max_temp: 38, condition: "Dry and Warm" },
    entry_req: ["Advance online safari booking mandatory"],
    avg_rating: 4.5,
    review_count: 0,
    time_take: "2 Days"
  },

  // 8. Rishikesh (Adventure/Cultural)
  {
    _id: "65cb76e4f3a2b1cd4e890108",
    name: "White Water Rafting and Yoga Ashrams",
    city: "Rishikesh",
    country: "India",
    cordinates: { lat: 30.0869, lng: 78.2676 },
    type: ["Adventure", "Cultural"],
    description: "The Yoga Capital of the World, offering intense Himalayan river rafting mixed with tranquil spirituality.",
    images: ["https://kated.com/wp-content/uploads/2020/04/IN99a-White-Water-Rafting-Rishikesh.jpg"],
    cost_range: { min: 20, max: 120 },
    best_months: ["March", "April", "May", "September", "October", "November"],
    weather: { min_temp: 15, max_temp: 35, condition: "Clear Skies" },
    entry_req: ["Medical fitness self-declaration for rafting"],
    avg_rating: 4.7,
    review_count: 0,
    time_take: "2-3 Days"
  },

  // 9. Alleppey (Nature/Other)
  {
    _id: "65cb76e4f3a2b1cd4e890109",
    name: "Kerala Backwaters Houseboat Cruise",
    city: "Alleppey",
    country: "India",
    cordinates: { lat: 9.4981, lng: 76.3388 },
    type: ["Nature", "Other"],
    description: "Glide through palm-fringed canals, serene lakes, and emerald paddy fields in a traditional Kettuvallam.",
    images: ["https://res.cloudinary.com/ddjuftfy2/image/upload/f_webp,c_fill,q_auto/memphis/large/885cb89554ab38136db6ef6d44c9843b.jpg"],
    cost_range: { min: 80, max: 500 },
    best_months: ["October", "November", "December", "January", "February"],
    weather: { min_temp: 23, max_temp: 32, condition: "Tropical Coastline" },
    entry_req: ["Prior houseboat booking highly recommended"],
    avg_rating: 4.6,
    review_count: 0,
    time_take: "1-2 Days"
  },

  // 10. Hampi (Historical/Cultural)
  {
    _id: "65cb76e4f3a2b1cd4e890110",
    name: "Virupaksha Temple and Ruins",
    city: "Hampi",
    country: "India",
    cordinates: { lat: 15.335, lng: 76.46 },
    type: ["Historical", "Cultural"],
    description: "A UNESCO World Heritage site showcasing the majestic boulder-strewn ruins of the Vijayanagara Empire.",
    images: ["https://www.holidify.com/images/bgImages/HAMPI.jpg"],
    cost_range: { min: 10, max: 90 },
    best_months: ["October", "November", "December", "January", "February"],
    weather: { min_temp: 18, max_temp: 34, condition: "Hot and Dry" },
    entry_req: ["ASI Monument entry ticket required"],
    avg_rating: 4.8,
    review_count: 0,
    time_take: "2-3 Days"
  },
  //11.mumbai
  {
    _id: "65cb76e4f3a2b1cd4e890501",
    name: "Gateway of India and Marine Drive",
    city: "Mumbai",
    country: "India",
    cordinates: { lat: 18.922, lng: 72.8347 },
    type: ["City", "Cultural"],
    description: "The monumental arch facing the Arabian Sea, paired with the iconic seaside promenade known as the Queen's Necklace.",
    images: ["https://wallpapers.com/images/file/gateway-of-mumbai-pigeons-m201j3xju9sde4p7.jpg", "https://wallpapercave.com/wp/wp7009182.jpg"],
    cost_range: { min: 20, max: 400 },
    best_months: ["October", "November", "December", "January", "February", "March"],
    weather: { min_temp: 20, max_temp: 32, condition: "Pleasant Coastal Breeze" },
    entry_req: ["Free public access", "Security screening at Gateway"],
    avg_rating: 4.6,
    review_count: 0,
    time_take: "1 Day"
  },

  // 12. Darjeeling (Mountain/Nature)
  {
    _id: "65cb76e4f3a2b1cd4e890502",
    name: "Tiger Hill Sunrise and Toy Train",
    city: "Darjeeling",
    country: "India",
    cordinates: { lat: 27.041, lng: 88.2663 },
    type: ["Mountain", "Nature"],
    description: "Witness the panoramic sunrise over Mt. Kanchenjunga and ride the historic UNESCO Himalayan steam railway.",
    images: ["https://bikewalebhaiya.com/bike/assets/blog/blog_photo_69897409e8dac.jpg"],
    cost_range: { min: 30, max: 150 },
    best_months: ["October", "November", "December", "March", "April", "May"],
    weather: { min_temp: 5, max_temp: 18, condition: "Chilly and Misty" },
    entry_req: ["Toy train tickets must be booked via IRCTC"],
    avg_rating: 4.7,
    review_count: 0,
    time_take: "2 Days"
  },

  // 13. Jaisalmer (Historical/Adventure/Cultural)
  {
    _id: "65cb76e4f3a2b1cd4e890503",
    name: "Sam Sand Dunes Camping & Desert Safari",
    city: "Jaisalmer",
    country: "India",
    cordinates: { lat: 26.9157, lng: 70.9083 },
    type: ["Historical", "Adventure", "Cultural"],
    description: "Experience camel safaris, Rajasthani folk dance performances, and luxury tent stays amidst the Thar Desert.",
    images: ["https://media1.thrillophilia.com/filestore/xvd4ozgt7kym0p8fidwlw1m3k7n7_1571210999_1571207243_WhatsApp_Image_2019-10-11_at_4.27.36_PM(13).jpeg.jpg?w=753&h=450&dpr=1.0"],
    cost_range: { min: 45, max: 220 },
    best_months: ["November", "December", "January", "February"],
    weather: { min_temp: 8, max_temp: 28, condition: "Dry and Cool Nights" },
    entry_req: ["Prior booking for desert camps required"],
    avg_rating: 4.5,
    review_count: 0,
    time_take: "1-2 Days"
  },

  // 14. Amritsar (Cultural/Historical)
  {
    _id: "65cb76e4f3a2b1cd4e890504",
    name: "The Golden Temple (Harmandir Sahib)",
    city: "Amritsar",
    country: "India",
    cordinates: { lat: 31.62, lng: 74.8765 },
    type: ["Cultural", "Historical"],
    description: "The preeminent spiritual shrine of Sikhism, famous for its golden architecture and massive community kitchen (Langar).",
    images: ["https://upload.wikimedia.org/wikipedia/commons/9/9c/Golden_Temple_India.jpg"],
    cost_range: { min: 0, max: 50 },
    best_months: ["October", "November", "January", "February", "March"],
    weather: { min_temp: 7, max_temp: 30, condition: "Clear Skies" },
    entry_req: ["Head covering required", "Feet must be washed before entry"],
    avg_rating: 5.0,
    review_count: 0,
    time_take: "1 Day"
  },

  // 15. Havelock Island (Beach/Adventure/Nature)
  {
    _id: "65cb76e4f3a2b1cd4e890505",
    name: "Radhanagar Beach and Scuba Diving",
    city: "Andaman and Nicobar",
    country: "India",
    cordinates: { lat: 12.0325, lng: 92.953 },
    type: ["Beach", "Adventure", "Nature"],
    description: "Consistently rated among Asia's best beaches, offering pristine white sand and world-class coral reef diving.",
    images: ["https://ik.imagekit.io/shortpedia/Voices/wp-content/uploads/2022/02/havelock-island-1200x900@eternalandamans.jpg"],
    cost_range: { min: 70, max: 500 },
    best_months: ["November", "December", "January", "February", "March", "April"],
    weather: { min_temp: 23, max_temp: 31, condition: "Sunny and Tropical" },
    entry_req: ["Ferry booking from Port Blair required", "Scuba requires medical form"],
    avg_rating: 4.9,
    review_count: 0,
    time_take: "3 Days"
  },

  // 16. Udaipur (Historical/Cultural/City)
  {
    _id: "65cb76e4f3a2b1cd4e890506",
    name: "Lake Pichola Boat Cruise & City Palace",
    city: "Udaipur",
    country: "India",
    cordinates: { lat: 24.5854, lng: 73.6833 },
    type: ["Historical", "Cultural", "City"],
    description: "The Venice of the East, boasting serene lakes and the massive, ornate City Palace complex.",
    images: ["https://thumbs.dreamstime.com/b/city-palace-lake-pichola-sunset-udaipur-rajasthan-india-city-palace-lake-pichola-udaipur-rajasthan-india-421209817.jpg"],
    cost_range: { min: 25, max: 300 },
    best_months: ["October", "November", "December", "January", "February"],
    weather: { min_temp: 11, max_temp: 30, condition: "Pleasant" },
    entry_req: ["Palace entry ticket separate from boat cruise"],
    avg_rating: 4.8,
    review_count: 0,
    time_take: "2 Days"
  },

  // 17. Kaziranga (Nature/Adventure)
  {
    _id: "65cb76e4f3a2b1cd4e890507",
    name: "One-Horned Rhinoceros Wildlife Safari",
    city: "Kaziranga",
    country: "India",
    cordinates: { lat: 26.5775, lng: 93.1714 },
    type: ["Nature", "Adventure"],
    description: "A sanctuary hosting two-thirds of the world's great one-horned rhinoceroses, located on the Brahmaputra plains.",
    images: ["https://files.worldwildlife.org/wwfcmsprod/images/Greater_One_Horned_Rhino_8.6.2012_Hero_and_Circle_HI_107996.jpg/story_full_width/kvfvw1ho2_Greater_One_Horned_Rhino_8.6.2012_Hero_and_Circle_HI_107996.jpg"],
    cost_range: { min: 35, max: 180 },
    best_months: ["November", "December", "January", "February", "March", "April"],
    weather: { min_temp: 10, max_temp: 28, condition: "Humid/Subtropical" },
    entry_req: ["Park closed during monsoon months"],
    avg_rating: 4.6,
    review_count: 0,
    time_take: "2 Days"
  },

  // 18. Ooty (Mountain/Nature)
  {
    _id: "65cb76e4f3a2b1cd4e890508",
    name: "Botanical Gardens and Doddabetta Peak",
    city: "Ooty",
    country: "India",
    cordinates: { lat: 11.4064, lng: 76.6932 },
    type: ["Mountain", "Nature"],
    description: "The Queen of Hill Stations in South India, featuring terraced tea gardens and high panoramic viewpoints.",
    images: ["https://d2rdhxfof4qmbb.cloudfront.net/wp-content/uploads/2024/04/Doddabetta-Cover.jpg"],
    cost_range: { min: 15, max: 120 },
    best_months: ["April", "May", "June", "September", "October", "November"],
    weather: { min_temp: 12, max_temp: 22, condition: "Cool and Crisp" },
    entry_req: ["Nominal eco-tax at city boundary"],
    avg_rating: 4.3,
    review_count: 0,
    time_take: "1-2 Days"
  },

  // 19. Khajuraho (Historical/Cultural)
  {
    _id: "65cb76e4f3a2b1cd4e890509",
    name: "Erotic Temples Complex",
    city: "Khajuraho",
    country: "India",
    cordinates: { lat: 24.8318, lng: 79.9199 },
    type: ["Historical", "Cultural"],
    description: "Famous UNESCO group of Hindu and Jain temples known for their stunning, intricate nagara-style architectural carvings.",
    images: ["https://www.tripsavvy.com/thmb/m0UXW7btnS100RvrmI35bfOYWwg=/3000x2000/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-540115304-c91172725e8143898e263a3500b19d39.jpg"],
    cost_range: { min: 10, max: 80 },
    best_months: ["October", "November", "December", "January", "February"],
    weather: { min_temp: 9, max_temp: 32, condition: "Dry and Sunny" },
    entry_req: ["ASI ticket needed for Western Group of temples"],
    avg_rating: 4.6,
    review_count: 0,
    time_take: "1 Day"
  },

  // 20. Pondicherry (Cultural/Beach/Other)
  {
    _id: "65cb76e4f3a2b1cd4e890510",
    name: "French Quarter and Promenade Beach",
    city: "Pondicherry",
    country: "India",
    cordinates: { lat: 11.9139, lng: 79.8145 },
    type: ["Cultural", "Beach", "Other"],
    description: "Explore the colonial French heritage streets with mustard-colored villas, cozy cafes, and rocky shorelines.",
    images: ["https://thumbs.dreamstime.com/b/aerial-view-city-beach-promenade-des-anglais-nice-french-riviera-france-257230057.jpg"],
    cost_range: { min: 20, max: 200 },
    best_months: ["October", "November", "December", "January", "February"],
    weather: { min_temp: 22, max_temp: 31, condition: "Warm and Coastal" },
    entry_req: ["Free access", "Vehicles barred from promenade after 6 PM"],
    avg_rating: 4.5,
    review_count: 0,
    time_take: "2 Days"
  },
  // 21. Shimla (Mountain/Nature/Historical)
  {
    _id: "65cb76e4f3a2b1cd4e890701",
    name: "The Ridge and Kalka-Shimla Toy Train",
    city: "Shimla",
    country: "India",
    cordinates: { lat: 31.1048, lng: 77.1734 },
    type: ["Mountain", "Nature", "Historical"],
    description: "The erstwhile summer capital of British India, famous for its colonial architecture, pine-covered hills, and panoramic mountain views.",
    images: ["https://realhimachal.in/wp-content/uploads/2022/04/Kalka-Shimla-Toy-Train-Crossing-Iconic-Kanog-Bridge-541-A-Scenic-Journey-Through-Himachal-Pradesh-800x450.jpg"],
    cost_range: { min: 25, max: 200 },
    best_months: ["March", "April", "May", "October", "November", "December"],
    weather: { min_temp: 4, max_temp: 22, condition: "Cool Alpine Climate" },
    entry_req: ["Free access to city landmarks", "Toy train tickets required via IRCTC"],
    avg_rating: 4.4,
    review_count: 0,
    time_take: "2 Days"
  },

  // 22. Mysore (Cultural/Historical)
  {
    _id: "65cb76e4f3a2b1cd4e890702",
    name: "Mysore Palace and Chamundi Hill",
    city: "Mysore",
    country: "India",
    cordinates: { lat: 12.3052, lng: 76.6552 },
    type: ["Cultural", "Historical"],
    description: "An incredibly grand Indo-Saracenic palace that lights up spectacularly on weekends with nearly 100,000 light bulbs.",
    images: ["https://media.istockphoto.com/id/172124032/photo/mysore-palace-at-dusk.webp?a=1&b=1&s=612x612&w=0&k=20&c=tfzI-I3e4YpuOz95NFWfJ6VuPwR-njeJqd2s7MDjYtY="],
    cost_range: { min: 10, max: 120 },
    best_months: ["October", "November", "December", "January", "February"],
    weather: { min_temp: 16, max_temp: 31, condition: "Pleasant and Sunny" },
    entry_req: ["Palace entry fee applicable", "Footwear must be deposited outside"],
    avg_rating: 4.8,
    review_count: 0,
    time_take: "1-2 Days"
  },

  // 23. Khajjiar (Nature/Mountain)
  {
    _id: "65cb76e4f3a2b1cd4e890703",
    name: "Khajjiar Lake and Cedar Forests",
    city: "Chamba",
    country: "India",
    cordinates: { lat: 32.5468, lng: 76.0567 },
    type: ["Nature", "Mountain"],
    description: "Often dubbed the 'Mini Switzerland of India', this spot features a stunning saucer-shaped glade surrounded by dense deodar trees.",
    images: ["https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2018/05/Khajjiar_Feature.jpg"],
    cost_range: { min: 15, max: 90 },
    best_months: ["March", "April", "May", "June", "September", "October", "November"],
    weather: { min_temp: 8, max_temp: 24, condition: "Crisp Mountain Air" },
    entry_req: ["Eco-tourism fee at entrance"],
    avg_rating: 4.5,
    review_count: 0,
    time_take: "1 Day"
  },

  // 24. Mahabalipuram (Historical/Cultural/Beach)
  {
    _id: "65cb76e4f3a2b1cd4e890704",
    name: "Shore Temple and Five Rathas",
    city: "Mahabalipuram",
    country: "India",
    cordinates: { lat: 12.6208, lng: 80.1982 },
    type: ["Historical", "Cultural", "Beach"],
    description: "7th-century rock-cut monolithic temples and relief carvings showcasing the exceptional architectural brilliance of the Pallava dynasty.",
    images: ["https://vaneshwariholidays.com/assets/images/destination/mahabalipuram.jpg"],
    cost_range: { min: 12, max: 80 },
    best_months: ["October", "November", "December", "January", "February"],
    weather: { min_temp: 22, max_temp: 33, condition: "Warm and Coastal" },
    entry_req: ["Single ASI ticket grants entry to all core monuments"],
    avg_rating: 4.7,
    review_count: 0,
    time_take: "1 Day"
  },

  // 25. Gulmarg (Mountain/Adventure)
  {
    _id: "65cb76e4f3a2b1cd4e890705",
    name: "Gulmarg Gondola and Ski Resort",
    city: "Gulmarg",
    country: "India",
    cordinates: { lat: 34.0484, lng: 74.3805 },
    type: ["Mountain", "Adventure"],
    description: "Home to one of the highest cable cars in the world and pristine, snow-covered slopes that attract skiers globally.",
    images: ["https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2024/02/06152954/Gulmarg-Deepanshu-Nayak.jpg"],
    cost_range: { min: 50, max: 400 },
    best_months: ["December", "January", "February", "March"],
    weather: { min_temp: -8, max_temp: 8, condition: "Heavy Snowfall / Freezing" },
    entry_req: ["Gondola tickets must be booked online well in advance"],
    avg_rating: 4.9,
    review_count: 0,
    time_take: "2 Days"
  },

  // 26. Pushkar (Cultural/Other)
  {
    _id: "65cb76e4f3a2b1cd4e890706",
    name: "Pushkar Lake and Brahma Temple",
    city: "Pushkar",
    country: "India",
    cordinates: { lat: 26.4899, lng: 74.5511 },
    type: ["Cultural", "Other"],
    description: "A sacred lakeside town featuring one of the world's very few temples dedicated to the Hindu creator god Brahma.",
    images: ["https://tse2.mm.bing.net/th/id/OIP.qGYoFJPT4bZx--f6aQwc1QHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"],
    cost_range: { min: 10, max: 100 },
    best_months: ["October", "November", "December", "January", "February"],
    weather: { min_temp: 11, max_temp: 30, condition: "Arid and Clear" },
    entry_req: ["No footwear allowed near the lake ghats", "Alcohol & non-veg banned in town"],
    avg_rating: 4.3,
    review_count: 0,
    time_take: "1-2 Days"
  },

  // 27. Jim Corbett (Nature/Adventure)
  {
    _id: "65cb76e4f3a2b1cd4e890707",
    name: "Dhikala Zone Jungle Safari",
    city: "Ramnagar",
    country: "India",
    cordinates: { lat: 29.53, lng: 78.97 },
    type: ["Nature", "Adventure"],
    description: "India's oldest national park, offering classic jeep safaris through dense Sal forests to spot wild elephants and tigers.",
    images: ["https://www.dhikalazone.com/wp-content/uploads/2022/05/Dhela-Jungle-Safari-1024x683.jpg"],
    cost_range: { min: 40, max: 250 },
    best_months: ["November", "December", "January", "February", "March", "April", "May"],
    weather: { min_temp: 9, max_temp: 35, condition: "Forest Subtropical" },
    entry_req: ["Night stay permits inside the forest zone must be reserved months prior"],
    avg_rating: 4.6,
    review_count: 0,
    time_take: "2 Days"
  },

  // 28. Gokarna (Beach/Nature)
  {
    _id: "65cb76e4f3a2b1cd4e890708",
    name: "Om Beach and Half Moon Beach Trek",
    city: "Gokarna",
    country: "India",
    cordinates: { lat: 14.514, lng: 74.316 },
    type: ["Beach", "Nature"],
    description: "A laid-back alternative to Goa, popular for its pristine, cliff-side beaches shaped naturally like the religious 'Om' symbol.",
    images: ["https://thrillingtravel.in/wp-content/uploads/2015/08/17038811266_b95cdd7e18_z.jpg"],
    cost_range: { min: 20, max: 150 },
    best_months: ["October", "November", "December", "January", "February", "March"],
    weather: { min_temp: 22, max_temp: 32, condition: "Sunny Coastline" },
    entry_req: ["Free beach access", "Inter-beach ferries require nominal cash fee"],
    avg_rating: 4.5,
    review_count: 0,
    time_take: "2 Days"
  },

  // 29. Ajanta and Ellora (Historical/Cultural)
  {
    _id: "65cb76e4f3a2b1cd4e890709",
    name: "Kailash Temple and Rock-Cut Caves",
    city: "Aurangabad",
    country: "India",
    cordinates: { lat: 20.0258, lng: 75.178 },
    type: ["Historical", "Cultural"],
    description: "Magnificent rock-cut caves featuring ancient Buddhist paintings and the monolithic Kailash Temple, carved out of a single giant rock.",
    images: ["https://th.bing.com/th/id/R.594287df5705541f050ddf31d27645bb?rik=HbZi3AKUP%2bfdkA&riu=http%3a%2f%2fwww.mustseeglobal.com%2fwp-content%2fuploads%2f2020%2f11%2fShikhara-1-1024x963.jpg&ehk=puu%2fw9h7tHf9GABGhM6SHaXdpVtyqRp%2bVHpoRIbPa9o%3d&risl=&pid=ImgRaw&r=0"],
    cost_range: { min: 10, max: 70 },
    best_months: ["October", "November", "December", "January", "February", "March"],
    weather: { min_temp: 14, max_temp: 33, condition: "Sunny and Warm" },
    entry_req: ["Caves remain closed on specific weekdays (Ajanta on Mondays, Ellora on Tuesdays)"],
    avg_rating: 4.9,
    review_count: 0,
    time_take: "2 Days"
  },

  // 30. Cherrapunji (Nature/Adventure)
  {
    _id: "65cb76e4f3a2b1cd4e890710",
    name: "Double Decker Living Root Bridges",
    city: "Cherrapunji",
    country: "India",
    cordinates: { lat: 25.284, lng: 91.7273 },
    type: ["Nature", "Adventure"],
    description: "Deep in the northeastern rainforests, discover incredible bio-engineering marvels woven from the roots of living rubber trees.",
    images: ["https://www.naturediary.in/wp-content/uploads/2021/05/the-double-decker-living-root-bridge-in-Meghalaya.jpg"],
    cost_range: { min: 15, max: 110 },
    best_months: ["October", "November", "December", "January", "February", "May"],
    weather: { min_temp: 10, max_temp: 23, condition: "Highly Misty / Humid" },
    entry_req: ["Requires a steep downhill trek of roughly 3,000 steps"],
    avg_rating: 4.8,
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
    "cordinates": { "lat": -13.1631, "lng": -72.545 },
    "type": ["History", "Adventure", "Nature"],
    "description": "An ancient Incan citadel set high in the Andes Mountains, famed for its sophisticated dry-stone walls and panoramic views.",
    "images": ["https://tse3.mm.bing.net/th/id/OIP.bCsIINKJfbPIU3inoeohWwHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"],
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
    "cordinates": { "lat": 36.4614, "lng": 25.3753 },
    "type": ["Romance", "Relaxation", "Photography"],
    "description": "World-famous whitewashed houses clinging to volcanic cliffs, offering legendary sunset views over the Aegean Sea.",
    "images": ["https://i.pinimg.com/originals/6c/c7/d2/6cc7d2ccffda637c51eda0bff92c7fcd.jpg"],
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
    "cordinates": { "lat": 34.9671, "lng": 135.7727 },
    "type": ["Culture", "History", "Spirituality"],
    "description": "An iconic Shinto shrine famous for its path of thousands of vibrant vermilion torii gates winding up Mount Inari.",
    "images": ["https://www.agoda.com/wp-content/uploads/2024/07/Fushimi-Inari-Shrine-Kyoto-Japan.jpg"],
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
    "cordinates": { "lat": 51.4968, "lng": -115.9281 },
    "type": ["Nature", "Adventure", "Wildlife"],
    "description": "Canada's oldest national park, encompassing mountainous terrain, glacier-fed turquoise lakes, and dense coniferous forests.",
    "images": ["https://banffnationalpark.com/wp-content/uploads/2009/06/pexels-photo-417074.jpeg"],
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
    "cordinates": { "lat": 29.9792, "lng": 31.1342 },
    "type": ["History", "Culture"],
    "description": "The oldest of the Seven Wonders of the Ancient World, standing tall as a testament to ancient Egyptian engineering.",
    "images": ["https://www.thehistoryhub.com/wp-content/uploads/2014/10/Great-Pyramid-of-Giza-Photos.jpg"],
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
    "cordinates": { "lat": 48.8584, "lng": 2.2945 },
    "type": ["City Life", "Romance", "Architecture"],
    "description": "The globally recognized wrought-iron lattice tower on the Champ de Mars, offering unmatched views of Paris.",
    "images": ["https://tse2.mm.bing.net/th/id/OIP.dkUoahdILcMsJdcNFXVwowHaK7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"],
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
    "cordinates": { "lat": -2.3333, "lng": 34.8333 },
    "type": ["Wildlife", "Adventure", "Nature"],
    "description": "Famed for its massive annual migration of wildebeest and zebras, and its vast, golden savanna plains.",
    "images": ["https://tse1.mm.bing.net/th/id/OIP.bhLS5SvnODxhuA_vvromHwHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"],
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
    "cordinates": { "lat": -33.8568, "lng": 151.2153 },
    "type": ["Architecture", "City Life", "Arts"],
    "description": "A multi-venue performing arts centre identified by its iconic sail-like architectural design over Sydney Harbour.",
    "images": ["https://cdn.britannica.com/96/100196-050-C92064E0/Sydney-Opera-House-Port-Jackson.jpg"],
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
    "cordinates": { "lat": 30.3285, "lng": 35.4444 },
    "type": ["History", "Adventure", "Archaeology"],
    "description": "The famous archaeological site in Jordan's southwestern desert, featuring tombs and temples carved into pink sandstone cliffs.",
    "images": ["https://cdn.pixabay.com/photo/2020/03/29/21/44/petra-4982346_1280.jpg"],
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
    "cordinates": { "lat": 64.1466, "lng": -21.9426 },
    "type": ["Nature", "Adventure", "Phenomenon"],
    "description": "Experience the surreal Aurora Borealis illuminating the dark winter skies over dramatic volcanic landscapes.",
    "images": ["https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/87/13/1a/caption.jpg?w=2000&h=-1&s=1&cx=960&cy=540&chk=v1_75f6b6edaba5688c9034"],
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
    "cordinates": { "lat": 36.1069, "lng": -112.1129 },
    "type": ["Nature", "Adventure"],
    "description": "A massive, powerful canyon carved over millions of years by the Colorado River, boasting immense geological scale.",
    "images": ["https://wallpapercave.com/wp/wp2211531.jpg"],
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
    "cordinates": { "lat": 20.9101, "lng": 107.1839 },
    "type": ["Nature", "Relaxation", "Cruise"],
    "description": "Emerald waters punctuated by thousands of towering limestone islands topped with dense rainforests.",
    "images": ["https://www.paradisevietnam.com/public/backend/uploads/images/what-about-ha-long-bay-1.jpg"],
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
    "cordinates": { "lat": 41.8902, "lng": 12.4922 },
    "type": ["History", "Architecture", "Culture"],
    "description": "The largest ancient amphitheater ever built, reflecting the grandeur and architectural might of the Roman Empire.",
    "images": ["https://cdn.britannica.com/36/162636-050-932C5D49/Colosseum-Rome-Italy.jpg"],
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
    "cordinates": { "lat": 7.7407, "lng": 98.7784 },
    "type": ["Beach", "Adventure", "Nightlife"],
    "description": "A stunning island group featuring pristine white sand beaches, vibrant coral reefs, and sheer limestone cliffs.",
    "images": ["https://tse2.mm.bing.net/th/id/OIP.HgL2SQkQMig6QQkF4LsFAgHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"],
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
    "cordinates": { "lat": 21.1717, "lng": 94.8585 },
    "type": ["History", "Spirituality", "Photography"],
    "description": "An ancient city where the remains of over 2,000 Buddhist temples and pagodas dot the vast green plains.",
    "images": ["https://tse2.mm.bing.net/th/id/OIP.NgXp5sWl85-pfCI8WQwpYgAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"],
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
    "cordinates": { "lat": -33.9628, "lng": 18.4098 },
    "type": ["Nature", "Adventure", "City Life"],
    "description": "A prominent flat-topped mountain overlooking the city of Cape Town, offering spectacular coastal views.",
    "images": ["https://wallpaperaccess.com/full/5067318.jpg"],
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
    "cordinates": { "lat": -20.1338, "lng": -67.4891 },
    "type": ["Nature", "Photography", "Adventure"],
    "description": "The world's largest salt flat, which transforms into a giant sky-reflecting mirror during the rainy season.",
    "images": ["hhttps://tse3.mm.bing.net/th/id/OIP.W7dadKVxuTqsfkq7ih84AwHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"],
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
    "cordinates": { "lat": 33.4996, "lng": 126.5312 },
    "type": ["Nature", "Relaxation"],
    "description": "A volcanic island characterized by craters, majestic waterfalls, and unique black sand beaches.",
    "images": ["https://www.localspook.com/wp-content/uploads/2023/09/00053_Jusangjeolli-Cliff-at-Jeju-Island.jpg"],
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
    "cordinates": { "lat": 44.8654, "lng": 15.582 },
    "type": ["Nature", "Photography"],
    "description": "A forest reserve world-renowned for its 16 terraced lakes joined by waterfalls and limestone canyons.",
    "images": ["https://tse4.mm.bing.net/th/id/OIP.DKrRi4mkW3bHcIaCSeMhmgHaJQ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"],
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
    "cordinates": { "lat": -44.6714, "lng": 167.925 },
    "type": ["Nature", "Adventure", "Cruise"],
    "description": "A breathtaking fiord known for towering Mitre Peak, rainforests, and dramatic cascading waterfalls like Stirling and Bowen falls.",
    "images": ["https://vistapointe.net/images/milford-sound-5.jpg"],
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
    "cordinates": { "lat": 20.6843, "lng": -88.5678 },
    "type": ["History", "Architecture", "Culture"],
    "description": "A vibrant and massive ruined Mayan city dominated by the step-pyramid known as El Castillo.",
    "images": ["https://tse3.mm.bing.net/th/id/OIP.D4y9IitPLi0OmKftHZpj-AHaEb?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"],
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
    name: 'Bali Beaches',
    city: 'Denpasar',
    country: 'Indonesia',
    cordinates: { lat: -8.6705, lng: 115.2126 },
    type: ['Beach', 'Nature', 'Adventure'],
    description: 'Tropical paradise known for beaches, temples and rice terraces.',
    images: ["https://tse2.mm.bing.net/th/id/OIP.lAVSTtBznbMp-F8_KKaR9wHaEo?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"],
    cost_range: { min: 400, max: 2000 },
    best_months: ['May', 'June', 'July', 'August'],
    weather: { min_temp: 24, max_temp: 33, condition: 'Tropical' },
    entry_req: ['Valid Passport', 'Visa on Arrival'],
    time_take: '5 Days',
  },
  //52
  {
    name: 'Mount Fuji',
    city: 'Fujinomiya',
    country: 'Japan',
    cordinates: { lat: 35.3606, lng: 138.7274 },
    type: ['Mountain', 'Nature', 'Adventure'],
    description: 'Japan\'s tallest peak and an iconic cultural symbol.',
    images: ["https://static.vecteezy.com/system/resources/previews/030/608/654/large_2x/mt-fuji-at-kawaguchiko-lake-in-japan-beautiful-scenic-landscape-of-mountain-fuji-or-fujisan-with-reflection-on-shoji-lake-at-dawn-with-twilight-sky-japan-ai-generated-free-photo.jpg"],
    cost_range: { min: 600, max: 2200 },
    best_months: ['July', 'August', 'September'],
    weather: { min_temp: 0, max_temp: 20, condition: 'Cold' },
    entry_req: ['Valid Passport', 'Visa'],
    time_take: '2 Days',
  },
  //53
  {
    name: 'Grand Canyon',
    city: 'Arizona',
    country: 'United States',
    cordinates: { lat: 36.1069, lng: -112.1129 },
    type: ['Nature', 'Adventure'],
    description: 'Massive steep-sided canyon carved by the Colorado River.',
    images: ["https://images6.alphacoders.com/719/thumb-1920-719355.jpg"],
    cost_range: { min: 700, max: 3000 },
    best_months: ['March', 'April', 'May', 'October'],
    weather: { min_temp: 5, max_temp: 35, condition: 'Arid' },
    entry_req: ['Valid Passport', 'US Visa'],
    time_take: '3 Days',
  },
  //54
  {
    name: 'Santorini',
    city: 'Thira',
    country: 'Greece',
    cordinates: { lat: 36.3932, lng: 25.4615 },
    type: ['Beach', 'City', 'Cultural'],
    description: 'Volcanic island famed for whitewashed, blue-domed buildings.',
    images: ["https://tse2.mm.bing.net/th/id/OIP.ab9CobbWepMNp9UBWmcF1gHaE9?r=0&w=3872&h=2592&rs=1&pid=ImgDetMain&o=7&rm=3"],
    cost_range: { min: 600, max: 2800 },
    best_months: ['May', 'June', 'September', 'October'],
    weather: { min_temp: 15, max_temp: 30, condition: 'Mediterranean' },
    entry_req: ['Valid Passport', 'Schengen Visa'],
    time_take: '4 Days',
  },
  //55
  {
    name: 'Great Barrier Reef',
    city: 'Cairns',
    country: 'Australia',
    cordinates: { lat: -16.9186, lng: 145.7781 },
    type: ['Beach', 'Nature', 'Adventure'],
    description: 'World\'s largest coral reef system, ideal for diving and snorkeling.',
    images: ["https://tse4.mm.bing.net/th/id/OIP.uNeWCkU1xyLERAW1S0HLHAHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"],
    cost_range: { min: 800, max: 3500 },
    best_months: ['June', 'July', 'August', 'September'],
    weather: { min_temp: 20, max_temp: 30, condition: 'Tropical' },
    entry_req: ['Valid Passport', 'Australian Visa'],
    time_take: '5 Days',
  },
  //56
  {
    name: 'Great Wall of China',
    city: 'Beijing',
    country: 'China',
    cordinates: { lat: 40.4319, lng: 116.5704 },
    type: ['Historical', 'Cultural', 'Adventure'],
    description: 'Ancient series of fortifications stretching across northern China.',
    images: ["https://cdn.britannica.com/54/122154-050-4DA0F697/Great-Wall-of-China.jpg"],
    cost_range: { min: 500, max: 2200 },
    best_months: ['September', 'October', 'April', 'May'],
    weather: { min_temp: -5, max_temp: 30, condition: 'Continental' },
    entry_req: ['Valid Passport', 'Chinese Visa'],
    time_take: '2 Days',
  },
 
  
  //57
  {
    name: 'Amazon Rainforest',
    city: 'Manaus',
    country: 'Brazil',
    cordinates: { lat: -3.119, lng: -60.0217 },
    type: ['Nature', 'Adventure'],
    description: 'The world\'s largest tropical rainforest, rich in biodiversity.',
    images: ["https://tse4.mm.bing.net/th/id/OIP.R20Tc5_jYAeUcOAmmILBcAHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"],
    cost_range: { min: 800, max: 3200 },
    best_months: ['June', 'July', 'August'],
    weather: { min_temp: 22, max_temp: 33, condition: 'Tropical' },
    entry_req: ['Valid Passport', 'Visa'],
    time_take: '5 Days',
  },
  //58
  {
    name: 'Swiss Alps',
    city: 'Interlaken',
    country: 'Switzerland',
    cordinates: { lat: 46.6863, lng: 7.8632 },
    type: ['Mountain', 'Nature', 'Adventure'],
    description: 'Breathtaking alpine scenery perfect for skiing and hiking.',
    images: ["https://deih43ym53wif.cloudfront.net/zermatt-matterhorn-switzerland-shutterstock_1298208013_44fea015e5.jpeg"],
    cost_range: { min: 1000, max: 4500 },
    best_months: ['December', 'January', 'February', 'July', 'August'],
    weather: { min_temp: -10, max_temp: 20, condition: 'Alpine' },
    entry_req: ['Valid Passport', 'Schengen Visa'],
    time_take: '5 Days',
  },
  //59
  {
    name: 'Maldives Islands',
    city: 'Male',
    country: 'Maldives',
    cordinates: { lat: 4.1755, lng: 73.5093 },
    type: ['Beach', 'Nature'],
    description: 'Idyllic overwater bungalows and pristine coral atolls.',
    images: ["https://tse2.mm.bing.net/th/id/OIP.aQAykItSfBf5uXSmuwIQJAHaEe?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"],
    cost_range: { min: 1200, max: 6000 },
    best_months: ['November', 'December', 'January', 'February', 'March'],
    weather: { min_temp: 25, max_temp: 32, condition: 'Tropical' },
    entry_req: ['Valid Passport', 'Visa on Arrival'],
    time_take: '4 Days',
  },
  //60
  {
    name: 'Iguazu Falls',
    city: 'Puerto Iguazu',
    country: 'Argentina',
    cordinates: { lat: -25.6953, lng: -54.4367 },
    type: ['Nature', 'Adventure'],
    description: 'One of the largest and most spectacular waterfall systems.',
    images: ["https://www.thesmoothescape.com/wp-content/uploads/2021/01/iguazu-header-4.jpg"],
    cost_range: { min: 600, max: 2400 },
    best_months: ['March', 'April', 'May', 'September'],
    weather: { min_temp: 15, max_temp: 30, condition: 'Subtropical' },
    entry_req: ['Valid Passport', 'Visa'],
    time_take: '3 Days',
  }, 
  //61
  {
    name: 'Dubai Skyline',
    city: 'Dubai',
    country: 'United Arab Emirates',
    cordinates: { lat: 25.2048, lng: 55.2708 },
    type: ['City', 'Adventure', 'Other'],
    description: 'Ultramodern city known for luxury shopping and the Burj Khalifa.',
    images: ["https://media.istockphoto.com/id/1142832956/photo/stunning-panoramic-view-of-the-illuminated-dubai-skyline-during-sunset-with-beautiful-shades.webp?b=1&s=170667a&w=0&k=20&c=L-o3JGRethQHONVr_O7ooIgHHPYY7C8J8nln7ovAz2I="],
    cost_range: { min: 700, max: 3800 },
    best_months: ['November', 'December', 'January', 'February', 'March'],
    weather: { min_temp: 15, max_temp: 40, condition: 'Arid' },
    entry_req: ['Valid Passport', 'Visa on Arrival'],
    time_take: '4 Days',
  },

  // 62 Neuschwanstein Castle
{
  _id: "65cb76e4f3a2b1cd4e890726",
  name: "Neuschwanstein Castle",
  city: "Schwangau",
  country: "Germany",
  cordinates: { lat: 47.5576, lng: 10.7498 },
  type: ["Historical", "Architecture", "Nature"],
  description: "A fairytale castle nestled in the Bavarian Alps that inspired Disney's Sleeping Beauty Castle.",
  images: [
    "https://cdn.britannica.com/32/156632-050-8A2A1B6F/Neuschwanstein-Castle-Bavaria-Germany.jpg"
  ],
  cost_range: { min: 20, max: 80 },
  best_months: ["May", "June", "September", "October"],
  weather: { min_temp: 4, max_temp: 23, condition: "Cool Alpine" },
  entry_req: ["Passport", "Advance castle ticket recommended"],
  avg_rating: 4.8,
  review_count: 0,
  time_take: "1 Day"
},

// 63. Sagrada Familia
{
  _id: "65cb76e4f3a2b1cd4e890727",
  name: "Sagrada Familia",
  city: "Barcelona",
  country: "Spain",
  cordinates: { lat: 41.4036, lng: 2.1744 },
  type: ["Architecture", "Historical", "Cultural"],
  description: "Antoni Gaudí's masterpiece and one of the world's most remarkable basilicas.",
  images: [
    "https://cdn.britannica.com/15/194815-050-08B5E7D1/Sagrada-Familia-Barcelona-Spain.jpg"
  ],
  cost_range: { min: 30, max: 70 },
  best_months: ["April", "May", "September", "October"],
  weather: { min_temp: 10, max_temp: 28, condition: "Mediterranean" },
  entry_req: ["Passport", "Timed entry ticket"],
  avg_rating: 4.8,
  review_count: 0,
  time_take: "3-4 Hours"
},

// 64. Hallstatt
{
  _id: "65cb76e4f3a2b1cd4e890728",
  name: "Hallstatt Village",
  city: "Hallstatt",
  country: "Austria",
  cordinates: { lat: 47.5622, lng: 13.6493 },
  type: ["Nature", "Photography", "Cultural"],
  description: "A picturesque lakeside alpine village renowned for its charming houses and mountain scenery.",
  images: [
    "https://wallpapercave.com/wp/wp5007853.jpg"
  ],
  cost_range: { min: 30, max: 180 },
  best_months: ["May", "June", "September", "October"],
  weather: { min_temp: 2, max_temp: 22, condition: "Cool and Scenic" },
  entry_req: ["Passport"],
  avg_rating: 4.9,
  review_count: 0,
  time_take: "1-2 Days"
},

// 65. Big Ben & Westminster
{
  _id: "65cb76e4f3a2b1cd4e890729",
  name: "Big Ben and Westminster Palace",
  city: "London",
  country: "United Kingdom",
  cordinates: { lat: 51.5007, lng: -0.1246 },
  type: ["Historical", "City", "Architecture"],
  description: "London's iconic clock tower alongside the historic Houses of Parliament.",
  images: [
    "https://cdn.britannica.com/91/189891-050-FB5F54E2/Big-Ben-London.jpg"
  ],
  cost_range: { min: 0, max: 80 },
  best_months: ["May", "June", "July", "September"],
  weather: { min_temp: 7, max_temp: 24, condition: "Mild" },
  entry_req: ["Passport", "Advance booking for Parliament tours"],
  avg_rating: 4.7,
  review_count: 0,
  time_take: "4-6 Hours"
},

// 66. Prague Castle
{
  _id: "65cb76e4f3a2b1cd4e89072a",
  name: "Prague Castle and Charles Bridge",
  city: "Prague",
  country: "Czech Republic",
  cordinates: { lat: 50.0911, lng: 14.4016 },
  type: ["Historical", "Architecture", "Cultural"],
  description: "Explore Europe's largest ancient castle complex and the medieval Charles Bridge.",
  images: [
    "https://cdn.britannica.com/73/189173-050-07E7C9E8/Prague-Castle-Czech-Republic.jpg"
  ],
  cost_range: { min: 15, max: 60 },
  best_months: ["April", "May", "September", "October"],
  weather: { min_temp: 5, max_temp: 24, condition: "Pleasant" },
  entry_req: ["Passport"],
  avg_rating: 4.8,
  review_count: 0,
  time_take: "1 Day"
},

// 67. Cinque Terre
{
  _id: "65cb76e4f3a2b1cd4e89072b",
  name: "Cinque Terre",
  city: "La Spezia",
  country: "Italy",
  cordinates: { lat: 44.127, lng: 9.705 },
  type: ["Nature", "Beach", "Photography"],
  description: "Five colorful seaside villages connected by scenic hiking trails along the Italian Riviera.",
  images: [
    "https://wallpapercave.com/wp/wp4086156.jpg"
  ],
  cost_range: { min: 40, max: 220 },
  best_months: ["May", "June", "September"],
  weather: { min_temp: 13, max_temp: 28, condition: "Sunny Coast" },
  entry_req: ["Passport", "Cinque Terre Card for trails"],
  avg_rating: 4.8,
  review_count: 0,
  time_take: "2 Days"
},

// 68. Blue Lagoon
{
  _id: "65cb76e4f3a2b1cd4e89072c",
  name: "Blue Lagoon",
  city: "Grindavík",
  country: "Iceland",
  cordinates: { lat: 63.8804, lng: -22.4495 },
  type: ["Nature", "Relaxation", "Adventure"],
  description: "A world-famous geothermal spa with mineral-rich milky blue waters surrounded by lava fields.",
  images: [
    "https://cdn.britannica.com/77/196677-050-0402A5F5/Blue-Lagoon-Iceland.jpg"
  ],
  cost_range: { min: 80, max: 180 },
  best_months: ["September", "October", "November", "December", "January", "February"],
  weather: { min_temp: -3, max_temp: 15, condition: "Cold with Geothermal Warmth" },
  entry_req: ["Passport", "Advance reservation required"],
  avg_rating: 4.7,
  review_count: 0,
  time_take: "4-6 Hours"
},

// 69. Matterhorn
{
  _id: "65cb76e4f3a2b1cd4e89072d",
  name: "Matterhorn and Zermatt",
  city: "Zermatt",
  country: "Switzerland",
  cordinates: { lat: 45.9763, lng: 7.6586 },
  type: ["Mountain", "Adventure", "Nature"],
  description: "One of the world's most recognizable mountains, surrounded by spectacular alpine scenery and hiking trails.",
  images: [
    "https://deih43ym53wif.cloudfront.net/zermatt-matterhorn-switzerland-shutterstock_1298208013_44fea015e5.jpeg"
  ],
  cost_range: { min: 100, max: 500 },
  best_months: ["June", "July", "August", "December", "January", "February"],
  weather: { min_temp: -10, max_temp: 18, condition: "Alpine" },
  entry_req: ["Passport", "Schengen Visa (if applicable)"],
  avg_rating: 4.9,
  review_count: 0,
  time_take: "2-3 Days"
},

];

const seedDestinations = async () => {
  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    console.log(errorColor, '❌ No admin user found. Run adminSeeder.js before seeding destinations.');
    return;
  }

  const destinationNames = destinationsData.map((destination) => destination.name);
  const existingDestinations = await Destination.find({ name: { $in: destinationNames } }).select('name cordinates');
  const existingByName = new Map(existingDestinations.map((destination) => [destination.name, destination]));

  const newDestinations = destinationsData
    .filter((destination) => !existingByName.has(destination.name))
    .map((destination) => ({ ...destination, created_by: admin._id }));

  if (newDestinations.length > 0) {
    const insertedDestinations = await Destination.insertMany(newDestinations);

    admin.destinations_id.push(...insertedDestinations.map((destination) => destination._id));
    await admin.save();

    console.log(successColor, `✅ ${insertedDestinations.length} destination(s) added by admin (${admin.email}) seeded successfully...`);
  } else {
    console.log(successColor, 'ℹ️  All destinations already exist, skipping seeding.');
  }

  const backfillOps = destinationsData
    .filter((destination) => {
      const existing = existingByName.get(destination.name);
      return existing && !existing.cordinates?.lat && destination.cordinates;
    })
    .map((destination) => ({
      updateOne: {
        filter: { name: destination.name },
        update: { $set: { cordinates: destination.cordinates } },
      },
    }));

  if (backfillOps.length > 0) {
    await Destination.bulkWrite(backfillOps);
    console.log(successColor, `✅ ${backfillOps.length} existing destination(s) backfilled with coordinates...`);
  }
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
