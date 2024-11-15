const Product = require('../../product/models/product.model');
const { User } = require('../../customer/models/user.model');
const multer = require('multer');
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
    storage: storage
}).array('images', 5); // Maximum of 5 files

// Controller functions
const addProduct = async (req, res) => {
    try {
        console.log('Multer upload success, files:', req.files); // Verify if files exist
        console.log('Request body:', req.body);

        const { name, price, category, quantity, description, sellerId } = req.body;
        const seller = await User.findById(sellerId);

        if (!seller || seller.role !== 'seller') {
            return res.status(403).json({ message: 'Only sellers can add products' });
        }

        const imagePaths = req.files ? req.files.map(file => file.path) : [];

        if (!name || !price || !category || !quantity || !description || imagePaths.length === 0) {
            return res.status(400).json({ message: 'All fields, including images, are required' });
        }

        const product = await Product.create({
            name,
            description,
            price,
            quantity,
            category,
            images: imagePaths,
            seller: sellerId,
        });

        res.status(201).json({ success: true, message: 'Product added successfully', product });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
};

const getSellerProducts = async (req, res) => {
    try {
        const { sellerId } = req.params;
        const products = await Product.find({ seller: sellerId });

        if (!products.length) {
            return res.status(404).json({ message: 'No products found for this seller' });
        }

        res.status(200).json({ success: true, products });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { sellerId, productId } = req.params;
        const { name, price, category, description, quantity } = req.body;

        const imagePaths = req.files ? req.files.map(file => file.path) : [];

        const product = await Product.findOneAndUpdate(
            { _id: productId, seller: sellerId },
            { name, price, category, description, quantity, images: imagePaths },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found or unauthorized' });
        }

        res.status(200).json({ success: true, message: 'Product updated successfully', product });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { sellerId, productId } = req.params;
        const product = await Product.findOneAndDelete({ _id: productId, seller: sellerId });

        if (!product) {
            return res.status(404).json({ message: 'Product not found or unauthorized' });
        }

        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const getSellerProductById = async (req, res) => {
    try {
        const { sellerId, productId } = req.params;
        const product = await Product.findOne({ _id: productId, seller: sellerId });

        if (!product) {
            return res.status(404).json({ message: 'Product not found or unauthorized' });
        }

        res.status(200).json({ success: true, product });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    addProduct,
    getSellerProducts,
    getSellerProductById,
    deleteProduct,
    updateProduct,
    upload // Export the upload middleware
};
