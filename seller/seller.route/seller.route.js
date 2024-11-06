const express = require('express');
const { 
    addProduct, 
    getSellerProducts, 
    deleteProduct, 
    updateProduct, 
    getSellerProductById
} = require('../seller.controller/seller.product.controller');

const { protect } = require('../tokenVerify/tokenVerify')

const router = express.Router();

router.post('/:sellerId/add',protect, addProduct); // Seller adds a product
router.get('/:sellerId/products',protect, getSellerProducts); // Seller views their products
router.put('/:sellerId/product/:productId',protect, updateProduct); // Seller updates a product
router.delete('/:sellerId/product/:productId',protect, deleteProduct); // Seller deletes a product
router.get('/:sellerId/products/:productId',protect, getSellerProductById) ; //seller gets its product by id

module.exports = router;
