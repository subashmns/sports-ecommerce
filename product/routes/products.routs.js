const express = require('express');
const router = express.Router();
const { createProduct, getProducts, getProductsById, updateProduct, deleteProduct } = require('../controllers/product.controller');

router.post('/', createProduct);
router.get('/', getProducts);
router.get('/:id', getProductsById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;