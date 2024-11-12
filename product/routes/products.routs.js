const express = require('express');
const router = express.Router();
const { createProduct, getProducts, getProductsById, updateProduct, deleteProduct } = require('../controllers/product.controller');
const multer = require('multer');

router.post('/add', multer().array('images', 5), createProduct);
router.get('/', getProducts);
router.get('/:id', getProductsById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;