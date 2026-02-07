const ContactInfo = require('../models/ContactInfo');

// Get contact information
const getContactInfo = async (req, res) => {
  try {
    let contactInfo = await ContactInfo.findOne();
    
    // If no contact info exists, create default one
    if (!contactInfo) {
      contactInfo = new ContactInfo({
        emailAddress: {
          title: 'Email address',
          emails: ['glyptic.sales@gmail.com', 'service@glyptic.in']
        },
        phoneNumber: {
          title: 'Phone number',
          phones: ['+91 9836838438', '+91 7020035493', '+91 9831688742', '+91 8240185599']
        },
        location: {
          title: 'Our Location',
          address: 'Registered Office: Raipur, Bhita, District -Burdwan – 713102, West Bengal, India Branch Office: 1363 Naskarhat Madhya Para, Kolkata – 700039. West Bengal, India'
        }
      });
      await contactInfo.save();
    }
    
    res.json(contactInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update contact information
const updateContactInfo = async (req, res) => {
  try {
    const { emailAddress, phoneNumber, location } = req.body;
    
    let contactInfo = await ContactInfo.findOne();
    
    if (!contactInfo) {
      contactInfo = new ContactInfo();
    }
    
    if (emailAddress) contactInfo.emailAddress = emailAddress;
    if (phoneNumber) contactInfo.phoneNumber = phoneNumber;
    if (location) contactInfo.location = location;
    
    contactInfo.updatedAt = new Date();
    await contactInfo.save();
    
    res.json(contactInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getContactInfo,
  updateContactInfo
};