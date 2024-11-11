const express = require('express');
const { 
    addProduct, 
    getSellerProducts, 
    deleteProduct, 
    updateProduct, 
    getSellerProductById
} = require('../seller.controller/seller.product.controller');

const router = express.Router();

router.post('/add', addProduct); // Seller adds a product
router.get('/products', getSellerProducts); // Seller views their products
router.put('/product/:productId', updateProduct); // Seller updates a product
router.delete('/product/:productId', deleteProduct); // Seller deletes a product
router.get('/products/:productId', getSellerProductById) ; //seller gets its product by id

module.exports = router;
