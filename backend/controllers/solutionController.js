const Solution = require('../models/Solution');

// Get all solutions
const getSolutions = async (req, res) => {
  try {
    const solutions = await Solution.find().sort({ createdAt: -1 });
    res.json(solutions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get solution by ID
const getSolutionById = async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id);
    if (!solution) {
      return res.status(404).json({ message: 'Solution not found' });
    }
    res.json(solution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new solution
const createSolution = async (req, res) => {
  try {
    const { title, contents } = req.body;
    
    console.log('Creating solution with data:', { title, contents });
    
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
    
    const solution = new Solution({
      title: title.trim(),
      contents: parsedContents
    });
    
    const savedSolution = await solution.save();
    console.log('Solution created successfully:', savedSolution._id);
    res.status(201).json(savedSolution);
  } catch (error) {
    console.error('Create solution error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// Update solution
const updateSolution = async (req, res) => {
  try {
    const { title, contents } = req.body;
    
    if (!title || !contents) {
      return res.status(400).json({ message: 'Title and contents are required' });
    }
    
    const solution = await Solution.findByIdAndUpdate(
      req.params.id,
      {
        title,
        contents: Array.isArray(contents) ? contents : JSON.parse(contents)
      },
      { new: true }
    );
    
    if (!solution) {
      return res.status(404).json({ message: 'Solution not found' });
    }
    
    res.json(solution);
  } catch (error) {
    console.error('Update solution error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete solution
const deleteSolution = async (req, res) => {
  try {
    const solution = await Solution.findByIdAndDelete(req.params.id);
    if (!solution) {
      return res.status(404).json({ message: 'Solution not found' });
    }
    res.json({ message: 'Solution deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSolutions,
  getSolutionById,
  createSolution,
  updateSolution,
  deleteSolution
};