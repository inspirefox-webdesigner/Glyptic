const Service = require('../models/Service');

// Get all services
const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get service by ID
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new service
const createService = async (req, res) => {
  try {
    const { title, contents } = req.body;
    
    console.log('Creating service with data:', { title, contents });
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    if (!contents) {
      return res.status(400).json({ message: 'Contents are required' });
    }
    
    let parsedContents;
    try {
      parsedContents = Array.isArray(contents) ? contents : JSON.parse(contents);
    } catch (parseError) {
      return res.status(400).json({ message: 'Invalid contents format' });
    }
    
    const service = new Service({
      title: title.trim(),
      contents: parsedContents
    });
    
    const savedService = await service.save();
    console.log('Service created successfully:', savedService._id);
    res.status(201).json(savedService);
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// Update service
const updateService = async (req, res) => {
  try {
    const { title, contents } = req.body;
    
    if (!title || !contents) {
      return res.status(400).json({ message: 'Title and contents are required' });
    }
    
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      {
        title,
        contents: Array.isArray(contents) ? contents : JSON.parse(contents)
      },
      { new: true }
    );
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(service);
  } catch (error) {
    console.error('Update service error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete service
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
};