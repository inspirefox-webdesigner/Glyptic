const express = require('express');
const router = express.Router();
const {
  getSolutions,
  getSolutionById,
  createSolution,
  updateSolution,
  deleteSolution
} = require('../controllers/solutionController');

// Routes
router.get('/', getSolutions);
router.get('/:id', getSolutionById);
router.post('/', createSolution);
router.put('/:id', updateSolution);
router.delete('/:id', deleteSolution);

module.exports = router;