const Product = require('../../product/models/product.model');
const { User } = require('../../customer/models/user.model');

// Controller functions


const addProduct = async (req, res) => {
    try {
            const { name, price, category, quantity, description, sellerId } = req.body;
            const seller = await User.findById(sellerId);

            if (!seller || seller.role !== 'seller') {
                return res.status(403).json({ message: 'Only sellers can add products' });
            }

            if (!name || !price || !category || !quantity || !description) {
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
        console.error(error.message);
        res.status(500).json({ message: error.message });
        console.log(error.message);
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

        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: err.message });
            }

            const imagePaths = req.files.map(file => file.path);

            const product = await Product.findOneAndUpdate(
                { _id: productId, seller: sellerId },
                { name, price, category, description, quantity, images: imagePaths },
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
