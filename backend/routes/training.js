const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/trainingController');

// Training events routes
router.get('/events', trainingController.getAllEvents);
router.post('/events', trainingController.createEvent);
router.put('/events/:id', trainingController.updateEvent);
router.delete('/events/:id', trainingController.deleteEvent);

// Registration routes
router.post('/register', trainingController.registerForEvent);
router.get('/registrations', trainingController.getAllRegistrations);
router.delete('/registrations/:id', trainingController.deleteRegistration);


module.exports = router;