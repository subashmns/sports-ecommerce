const express = require('express');
const { 
    addProduct, 
    getSellerProducts, 
    deleteProduct, 
    updateProduct, 
    getSellerProductById
} = require('../seller.controller/seller.product.controller');const multer = require('multer');
const path = require('path');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, '../../uploads')); // Use absolute path
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ 
    storage: storage, 
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'));
        }
    }
}).array('images', 5); // Maximum of 5 files


const router = express.Router();

// Route to add a new product (POST /seller/:sellerId/products)
router.post('/add',upload, addProduct); 

// Route to view all products by a specific seller (GET /seller/:sellerId/products)
router.get('/products/:sellerId', getSellerProducts); 

// Route to get a specific product by productId for a seller (GET /seller/:sellerId/products/:productId)
router.get('/products/:sellerId/:productId', getSellerProductById);

// Route to update a specific product (PUT /seller/:sellerId/products/:productId)
router.put('/:sellerId/products/:productId', updateProduct); 

// Route to delete a specific product (DELETE /seller/:sellerId/products/:productId)
router.delete('/products/:sellerId/:productId', deleteProduct); 

module.exports = router;
