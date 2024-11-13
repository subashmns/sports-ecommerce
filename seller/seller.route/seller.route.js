const express = require('express');
const { 
    addProduct, 
    getSellerProducts, 
    deleteProduct, 
    updateProduct, 
    getSellerProductById
} = require('../seller.controller/seller.product.controller');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'uploads/'})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/uploads')); // Store files in an absolute path
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' `${Date.now()} + ${path.extname(file.originalname)}`); // Unique filename
    }
});

const multipleUpload = upload.fields([{name: 'file1', maxCount:10}])

const router = express.Router();

// Route to add a new product (POST /seller/:sellerId/products)
router.post('/add',multipleUpload, addProduct); 

// Route to view all products by a specific seller (GET /seller/:sellerId/products)
router.get('/products/:sellerId', getSellerProducts); 

// Route to get a specific product by productId for a seller (GET /seller/:sellerId/products/:productId)
router.get('/products/:sellerId/:productId', getSellerProductById);

// Route to update a specific product (PUT /seller/:sellerId/products/:productId)
router.put('/:sellerId/products/:productId', updateProduct); 

// Route to delete a specific product (DELETE /seller/:sellerId/products/:productId)
router.delete('/products/:sellerId/:productId', deleteProduct); 

module.exports = router;
