const mongoose = require('mongoose');

const homePageSchema = new mongoose.Schema({
  whoWeAre: {
    image: { type: String },
    mainHeading: { type: String, default: 'Who We Are?' },
    tagline: { type: String, default: 'Empowering Integrators, Safeguarding Industries' },
    description: { type: String },
    partnerText: { type: String, default: 'Glyptic: Partnering with pros to protect what matters most!' },
    certifiedText: { type: String, default: 'Certified & Awards winner' },
    qualityText: { type: String, default: 'Best Quality Services' }
  },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HomePage', homePageSchema);