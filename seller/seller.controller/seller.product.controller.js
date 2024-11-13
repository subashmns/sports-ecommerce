const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Product = require('../../product/models/product.model');
const { User } = require('../../customer/models/user.model');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads')); // Store files in an absolute path
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    },
});

const upload = multer({ 
    storage: storage, 
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/; // Allowed file types
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: Images only!');
        }
    }
}).array('images', 5); // Accept multiple files with a limit of 5

// Helper function to delete images from the server
const deleteProductImages = (imagePaths) => {
    imagePaths.forEach((filePath) => {
        fs.unlink(filePath, (err) => {
            if (err) console.error(`Error deleting file: ${filePath}`, err);
        });
    });
};

// Controller functions

const addProduct = async (req, res) => {
    try {
        // Upload images
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: err });
            }

            const { name, price, category, quantity, description, sellerId } = req.body;
            const seller = await User.findById(sellerId);

            if (!seller || seller.role !== 'seller') {
                return res.status(403).json({ message: 'Only sellers can add products' });
            }

            if (!name || !price || !category || !quantity || !description) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            // Get the uploaded image paths
            const imagePaths = req.files.map(file => file.path);

            const product = await Product.create({
                name,
                description,
                price,
                quantity,
                category,
                images: imagePaths, // Store image paths
                seller: sellerId,
            });

            res.status(201).json({ success: true, message: 'Product added successfully', product });
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
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
        
        // Upload images
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: err });
            }

            const updateData = { name, price, category, description, quantity };

            // Only update images if new files are uploaded
            if (req.files.length > 0) {
                updateData.images = req.files.map(file => file.path);
            }

            const product = await Product.findOneAndUpdate(
                { _id: productId, seller: sellerId },
                updateData,
                { new: true }
            );

            if (!product) {
                return res.status(404).json({ message: 'Product not found or unauthorized' });
            }

            res.status(200).json({ success: true, message: 'Product updated successfully', product });
        });
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

        // Delete product images from server
        deleteProductImages(product.images);

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
};
