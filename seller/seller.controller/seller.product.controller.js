const  Product = require('../../product/models/product.model')
const { User } = require('../../customer/models/user.model')


const addProduct = async (req, res) => {
    try {
        const { sellerId } = req.query; // Get seller ID from URL
        const { name, price, category, image, quantity, description } = req.body;

        // Find the seller by ID
        const seller = await User.findById(sellerId || req.user.id);

        if (!seller || seller.role !== 'seller') {
            return res.status(403).json({ message: 'Only sellers can add products' });
        }

        if(!name || !price || !category || !image || !quantity ||  !description){
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        // Create a new product associated with the seller
        const product = await Product.create({
            name,
            description,
            price,
            quantity,
            category,
            image,
            seller: req.user.id // Link the product to the seller
        });

        await product.save();
        res.status(201).json({ success: true, message: 'Product added successfully', product });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const getSellerProducts = async (req, res) => {
    try {
        const { sellerId } = req.query; // Get seller ID from URL

        // Find products by seller ID
        const products = await Product.find({ seller: sellerId });

        if (!products) {
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
        const { sellerId, productId } = req.query; // Get seller ID and product ID from URL
        const { name, price, category, image, description, quantity } = req.body;

        // Find product by ID and check if it belongs to the seller
        const product = await Product.findOne(
            { _id: productId, seller: sellerId },
            { $set: { name, price, category, image, description, quantity } },
            { new: true });

        if (!product) {
            return res.status(404).json({ message: 'Product not found or unauthorized' });
        }

        await product.save();

        res.status(200).json({ success: true, message: 'Product updated successfully', product });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { sellerId, productId } = req.params; // Get seller ID and product ID from URL

        // Find product by ID and check if it belongs to the seller
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
        const { sellerId, productId } = req.params; // Get seller ID and product ID from the URL

        // Find the product by ID and check if it belongs to the seller
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
    updateProduct };

