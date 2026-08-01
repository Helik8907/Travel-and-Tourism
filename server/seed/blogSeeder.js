const mongoose = require('mongoose');
const { mongoUrl } = require('../config/config.js');
const { successColor, errorColor } = require('../utils/colors.js');
const Blog = require('../models/blog_model.js');
const User = require('../models/user_model.js');

const adminEmail = 'admin@gmail.com';

const blogsData = [
  {
    title: 'A Timeless Morning at the Taj Mahal',
    description: 'Watching sunrise paint the marble of the Taj Mahal in shades of pink and gold.',
    content:
      'There is nothing quite like arriving at the Taj Mahal gates before dawn, when the crowds are thin and the marble glows softly under the first light. As the sun rises over Agra, the monument shifts through shades of pink, orange, and finally a brilliant white. Pair your visit with a walk through Agra Fort in the afternoon to understand the full story of Shah Jahan and Mumtaz Mahal.',
    images: ['https://images.pexels.com/photos/27732630/pexels-photo-27732630.jpeg'],
    destinations: ['65cb76e4f3a2b1cd4e890101'],
  },
  {
    title: 'Goa Beyond the Beaches: A Local\'s Guide',
    description: 'Exploring the water sports, shacks, and hidden coves of Calangute and beyond.',
    content:
      'Goa is often reduced to its beaches, but spend a few days here and you\'ll discover so much more. Start your mornings with parasailing at Calangute, spend afternoons hopping between beach shacks for fresh seafood, and save your evenings for sunset cruises. The water sports scene is thrilling but always check operator safety certifications before booking.',
    images: ['https://www.dreamandtravel.com/wp-content/uploads/2023/05/Visiting-Calangute-Beach-Goa-Heres-What-You-MUST-Know-Before-Reaching-The-Queen-Of-Beaches-1024x366.jpg'],
    destinations: ['65cb76e4f3a2b1cd4e890102'],
  },
  {
    title: 'Chasing Colors at Pangong Tso, Ladakh',
    description: 'A high-altitude journey to the lake that changes color throughout the day.',
    content:
      'The road to Pangong Tso is an adventure in itself, winding through some of the highest motorable passes in the world. Once you arrive, the lake rewards you with a surreal spectacle: its waters shift from deep blue to turquoise to green as the sun moves across the sky. Carry warm layers, acclimatize properly in Leh first, and always travel with a valid Inner Line Permit.',
    images: ['https://th.bing.com/th/id/R.4f6f6b87203327aa2782d45766ac6374?rik=m6t9QJQqXbqCSA&riu=http%3a%2f%2fwww.thelandofsnows.com%2fwp-content%2fuploads%2f2015%2f03%2fPangongLake-Ladakh-1024x681.jpg&ehk=NFFZuIPyYks%2fnvTui87q9JcRTTuCSCGWl%2fVB1dcPcbc%3d&risl=&pid=ImgRaw&r=0'],
    destinations: ['65cb76e4f3a2b1cd4e890103'],
  },
  {
    title: 'Pink City Diaries: Jaipur in Three Days',
    description: 'A practical itinerary covering Amer Fort, Hawa Mahal, and the bazaars of Jaipur.',
    content:
      'Jaipur rewards travelers who take their time. Devote your first day to Amer Fort, arriving early to beat the heat and the crowds. On day two, explore the City Palace and the intricate facade of Hawa Mahal before getting lost in the bangle markets of Johari Bazaar. Save your last day for Nahargarh Fort at sunset, which offers the best panoramic view of the entire Pink City.',
    images: ['https://wallpaperaccess.com/full/8548996.jpg'],
    destinations: ['65cb76e4f3a2b1cd4e890104'],
  },
  {
    title: 'Tea Trails of Munnar',
    description: 'Wandering through Kerala\'s rolling tea plantations and misty hill country.',
    content:
      'Munnar\'s tea estates stretch endlessly across the Western Ghats, forming a green carpet that seems to fold into the clouds. A visit to the Tata Tea Museum explains how these plantations came to be, while a trip to Eravikulam National Park gives you a chance to spot the endangered Nilgiri Tahr grazing on the slopes. The air here is cool year-round, making it a welcome escape from the coastal heat.',
    images: ['https://thumbs.dreamstime.com/b/scenic-view-over-eravikulam-national-park-tea-plantations-kerala-south-india-sunny-day-178311495.jpg?w=768'],
    destinations: ['65cb76e4f3a2b1cd4e890105'],
  },
  {
    title: 'Ganga Aarti: An Evening in Varanasi',
    description: 'Witnessing the mesmerizing ritual on the ghats of the world\'s oldest living city.',
    content:
      'As dusk settles over Varanasi, the Dashashwamedh Ghat transforms into a stage for one of India\'s most powerful spiritual ceremonies. Priests in saffron robes move in perfect synchrony, waving flaming lamps to the rhythm of chants and bells, while hundreds of small diyas float downstream on the Ganges. Arrive an hour early to secure a boat and watch the ritual unfold from the water.',
    images: ['https://thetravelshots.com/wp-content/uploads/2021/02/VAranasi.jpg'],
    destinations: ['65cb76e4f3a2b1cd4e890106'],
  },
  {
    title: 'Tracking Tigers in Ranthambore',
    description: 'Tips for a successful wildlife safari in one of India\'s premier tiger reserves.',
    content:
      'Ranthambore National Park sits at the edge of the Aravalli and Vindhya hill ranges, and its dry deciduous forest makes tiger sightings more likely than in denser jungles. Book your safari zones in advance, as zones 1 through 5 are known for the most consistent sightings. Beyond tigers, keep an eye out for sloth bears, crocodiles basking near the lakes, and the ruins of the 10th-century Ranthambore Fort overlooking it all.',
    images: ['https://www.tourmyindia.com/socialimg/ranthambore-national-park.jpg'],
    destinations: ['65cb76e4f3a2b1cd4e890107'],
  },
  {
    title: 'Finding Stillness in Rishikesh',
    description: 'Balancing white-water rafting thrills with yoga and riverside serenity.',
    content:
      'Rishikesh has a dual personality: by day the Ganges roars with rafters tackling its rapids, and by evening the same riverbanks fill with the soft chanting of ashram prayers. Spend your mornings on the water for an adrenaline rush, then unwind with a sunset yoga session near Parmarth Niketan. The Lakshman Jhula and Ram Jhula bridges are perfect spots to watch the town\'s rhythm shift from adventure to calm.',
    images: ['https://kated.com/wp-content/uploads/2020/04/IN99a-White-Water-Rafting-Rishikesh.jpg'],
    destinations: ['65cb76e4f3a2b1cd4e890108'],
  },
  {
    title: 'Drifting Through the Alleppey Backwaters',
    description: 'A slow houseboat journey through Kerala\'s palm-fringed canals.',
    content:
      'There\'s a particular kind of peace that comes from gliding through Alleppey\'s backwaters aboard a traditional Kettuvallam houseboat. The canals wind past paddy fields, coconut groves, and small villages where life moves at the pace of the water itself. Book an overnight cruise if you can, when the boat anchors for the night and you fall asleep to the sound of the canal lapping against the hull.',
    images: ['https://res.cloudinary.com/ddjuftfy2/image/upload/f_webp,c_fill,q_auto/memphis/large/885cb89554ab38136db6ef6d44c9843b.jpg'],
    destinations: ['65cb76e4f3a2b1cd4e890109'],
  },
  {
    title: 'Among the Ruins of Hampi',
    description: 'Exploring the boulder-strewn remains of the Vijayanagara Empire.',
    content:
      'Hampi feels like an open-air museum scattered across a landscape of giant granite boulders. The Virupaksha Temple remains an active place of worship even amid the ruins, while the Vittala Temple complex, with its iconic stone chariot, showcases the architectural genius of the Vijayanagara Empire. Rent a bicycle to cover the sprawling site, and stay for sunset at Matanga Hill for one of the best views in South India.',
    images: ['https://www.holidify.com/images/bgImages/HAMPI.jpg'],
    destinations: ['65cb76e4f3a2b1cd4e890110'],
  },
];

const seedBlogs = async () => {
  const admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    console.log(errorColor, '❌ Admin user not found. Run the admin seeder first.');
    return;
  }

  const existingTitles = new Set(
    (await Blog.find({ title: { $in: blogsData.map((blog) => blog.title) } }).select('title')).map(
      (blog) => blog.title
    )
  );

  const blogsToCreate = blogsData
    .filter((blog) => !existingTitles.has(blog.title))
    .map((blog) => ({ ...blog, author: admin._id }));

  if (blogsToCreate.length === 0) {
    console.log(successColor, 'ℹ️  Blogs already seeded, skipping seeding.');
    return;
  }

  const createdBlogs = await Blog.insertMany(blogsToCreate);

  admin.blogs_created.push(...createdBlogs.map((blog) => blog._id));
  await admin.save();

  console.log(successColor, `✅ ${createdBlogs.length} blog(s) seeded successfully...`);
};

const run = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log(successColor, '✅ Database Connected successfully...');
    await seedBlogs();
  } catch (error) {
    console.log(errorColor, '❌ Blog seeding error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

if (require.main === module) {
  run();
}

module.exports = seedBlogs;