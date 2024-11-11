const Product = require('../../product/models/product.model');
const { User } = require('../../customer/models/user.model');

const addProduct = async (req, res) => {
    try {
        const { name, price, category, image, quantity, description, sellerId } = req.body;

        const seller = await User.findById(sellerId);

        if (!seller || seller.role !== 'seller') {
            return res.status(403).json({ message: 'Only sellers can add products' });
        }

        if (!name || !price || !category || !image || !quantity || !description) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const product = await Product.create({
            name,
            description,
            price,
            quantity,
            category,
            image,
            seller: sellerId,
        });

        res.status(201).json({ success: true, message: 'Product added successfully', product });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const getSellerProducts = async (req, res) => {
    try {
        const { sellerId} = req.query;
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
        const { sellerId, productId } = req.query;
        const { name, price, category, image, description, quantity } = req.body;

        const product = await Product.findOneAndUpdate(
            { _id: productId, seller: sellerId },
            { name, price, category, image, description, quantity },
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
};
