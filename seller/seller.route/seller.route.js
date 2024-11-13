const express = require('express');
const multer = require('multer');
const path = require('path');
const { addProduct, getSellerProducts, deleteProduct, updateProduct, getSellerProductById } = require('../seller.controller/seller.product.controller');

// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Set up routes
const router = express.Router();

// Route to add a new product
router.post('/add', upload.array('images', 5), addProduct);

// Route to get all products by seller
router.get('/products/:sellerId', getSellerProducts);

// Route to get a specific product by productId for a seller
router.get('/products/:sellerId/:productId', getSellerProductById);

// Route to update a specific product
router.put('/products/:sellerId/:productId', upload.array('images', 5), updateProduct);

// Route to delete a product
router.delete('/products/:sellerId/:productId', deleteProduct);

module.exports = router;
