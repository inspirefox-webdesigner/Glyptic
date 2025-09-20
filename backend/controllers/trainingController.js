const TrainingEvent = require('../models/TrainingEvent');
const EventRegistration = require('../models/EventRegistration');
const emailService = require('../utils/emailService');
 
// Get all training events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await TrainingEvent.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 
// Create new training event
exports.createEvent = async (req, res) => {
  try {
    const event = new TrainingEvent(req.body);
    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
 
// Update training event
exports.updateEvent = async (req, res) => {
  try {
    const event = await TrainingEvent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
 
// Delete training event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await TrainingEvent.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 
// Register for event
exports.registerForEvent = async (req, res) => {
  try {
    const { eventId, name, phone, email, address } = req.body;
   
    const event = await TrainingEvent.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
 
    // Check for duplicate registration (same email for same event)
    const existingRegistration = await EventRegistration.findOne({
      eventId,
      email: email.toLowerCase()
    });
 
    if (existingRegistration) {
      return res.status(400).json({
        message: 'You have already registered for this event. Please check your email for confirmation details.'
      });
    }
 
    const registration = new EventRegistration({
      eventId,
      eventTitle: event.title,
      eventDate: event.date,
      name,
      phone,
      email: email.toLowerCase(),
      address
    });
 
    const savedRegistration = await registration.save();
   
    // Send email notifications
    try {
      const trainingData = {
        eventTitle: event.title,
        eventDate: new Date(event.date).toLocaleDateString(),
        name,
        email,
        phone,
        address
      };
     
      // Send email notification to both user and admin
      await emailService.sendTrainingNotification(trainingData, email);
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Continue with success response even if email fails
    }
   
    res.status(201).json(savedRegistration);
  } catch (error) {
    // Handle duplicate key error from database
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'You have already registered for this event. Please check your email for confirmation details.'
      });
    }
    res.status(400).json({ message: error.message });
  }
};
 
// Get all registrations
exports.getAllRegistrations = async (req, res) => {
  try {
    const registrations = await EventRegistration.find()
      .populate('eventId')
      .sort({ registeredAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 
// Delete registration
exports.deleteRegistration = async (req, res) => {
  try {
    const registration = await EventRegistration.findByIdAndDelete(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    res.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};