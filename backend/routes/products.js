const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getBrands,
  updateProductPositions,
  bulkDeleteByType
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/brands', getBrands);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.put('/positions/update', updateProductPositions);
router.delete('/bulk-delete', bulkDeleteByType);
router.delete('/:id', deleteProduct);

module.exports = router;