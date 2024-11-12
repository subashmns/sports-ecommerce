// backend/controllers/product.controller.js

const Product = require('../models/product.model');
const multer = require('multer');

// Set up storage for files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../seller/uploads')); // Specify folder to save files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Add timestamp to filename
    },
});

// Multer setup to accept multiple files
const upload = multer({ storage: storage }).array('images', 5); // Limit to 5 files per upload

const createProduct = async (req, res) => {
    try {
        const { name, price, category, quantity, description, sellerId } = req.body;
        const images = req.files;
    
        // Validate required fields
        if (!name || !price || !category || !quantity || !description || !sellerId || !images || images.length === 0) {
            return res.status(400).json({ message: 'All fields including images are required.' });
        }

        // Map image file data to save only paths
        const imagePaths = images.map(file => ({ url: file.path }));

        // Create and save product
        const product = new Product({
            name,
            price,
            category,
            quantity,
            description,
            seller: sellerId,
            images: imagePaths,
        });

        await product.save();
        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



const getProducts = async (req, res) => {
    try{
        const product = await Product.find();
        res.status(200).json(product);
    }
    catch(err){
        res.status(500).json({ Message: err.message });
    }
}

const getProductsById = async (req, res) => {
    try{
        const { id } = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);
    }
    catch(err){
        res.status(500).json({ Message: err.message });
    }
}

const updateProduct = async (req, res) => {
    try{
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
        if (!product) {
            return res.status(404).json({ Message: 'Product not found' });
        }
        const updatedProduct = await Product.findById(id);
        res.status(200).json(updatedProduct);
    }
    catch(err){
        res.status(500).json({ Message: err.message });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ Message: 'Product not found' });
        }
        res.status(200).json({ Message: 'Product successfully deleted' });
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ Message: error.message });
    }
}

module.exports = {
    createProduct,
    getProducts,
    getProductsById,
    updateProduct,
    deleteProduct
}


