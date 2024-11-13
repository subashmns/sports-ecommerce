const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Product = require('../../product/models/product.model');
const { User } = require('../../customer/models/user.model');

// Check if upload directory exists, create if not
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Store files in an absolute path
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    },
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|gif/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);
    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (jpeg, jpg, png, gif) are allowed!'));
    }
};

const upload = multer({
    storage,
    fileFilter
}).array('images', 5); // Accept multiple files with a limit of 5

// Helper function to delete images from the server
const deleteProductImages = (imagePaths) => {
    imagePaths.forEach((filePath) => {
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) console.error(`Error deleting file: ${filePath}`, err);
            });
        }
    });
};

// Controller functions

// Add Product
const addProduct = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        try {
            const { name, price, category, quantity, description, sellerId } = req.body;
            const seller = await User.findById(sellerId);

            if (!seller || seller.role !== 'seller') {
                deleteProductImages(req.files.map(file => file.path)); // Clean up uploaded files
                return res.status(403).json({ message: 'Only sellers can add products' });
            }

            if (!name || !price || !category || !quantity || !description) {
                deleteProductImages(req.files.map(file => file.path));
                return res.status(400).json({ message: 'All fields are required' });
            }

            const imagePaths = req.files.map(file => file.path);

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
            deleteProductImages(req.files.map(file => file.path));
            console.error(error.message);
            res.status(500).json({ message: 'Server error' });
        }
    });
};

// Get Products for Seller
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

// Update Product
const updateProduct = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        try {
            const { sellerId, productId } = req.params;
            const { name, price, category, description, quantity } = req.body;

            const updateData = { name, price, category, description, quantity };

            // Only update images if new files are uploaded
            if (req.files && req.files.length > 0) {
                updateData.images = req.files.map(file => file.path);
            }

            const product = await Product.findOneAndUpdate(
                { _id: productId, seller: sellerId },
                updateData,
                { new: true }
            );

            if (!product) {
                deleteProductImages(req.files.map(file => file.path));
                return res.status(404).json({ message: 'Product not found or unauthorized' });
            }

            res.status(200).json({ success: true, message: 'Product updated successfully', product });
        } catch (error) {
            deleteProductImages(req.files.map(file => file.path));
            console.error(error.message);
            res.status(500).json({ message: 'Server error' });
        }
    });
};

// Delete Product
const deleteProduct = async (req, res) => {
    try {
        const { sellerId, productId } = req.params;
        const product = await Product.findOneAndDelete({ _id: productId, seller: sellerId });

        if (!product) {
            return res.status(404).json({ message: 'Product not found or unauthorized' });
        }

        deleteProductImages(product.images);

        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Specific Product by Seller
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
