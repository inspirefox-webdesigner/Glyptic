const mongoose = require('mongoose');
const HeroSlider = require('./models/HeroSlider');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/glyptic', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const defaultSlides = [
  {
    title: 'Smart & Elegant Designs',
    image: 'product-2.png', // This should be copied to uploads folder
    isActive: true
  },
  {
    title: 'FIRE DETECTION',
    image: 'product-1.png', // This should be copied to uploads folder
    isActive: true
  },
  {
    title: 'Innovation Meets Quality',
    image: 'product-3.png', // This should be copied to uploads folder
    isActive: true
  }
];

async function seedHeroSlider() {
  try {
    // Clear existing slides
    await HeroSlider.deleteMany({});
    
    // Insert default slides
    await HeroSlider.insertMany(defaultSlides);
    
    console.log('✅ Hero slider data seeded successfully!');
    console.log('📝 Note: Make sure to copy the product images from assets/img/product/ to backend/uploads/');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding hero slider data:', error);
    process.exit(1);
  }
}

seedHeroSlider();