const Product = require('../models/product.model');

const createProduct = async (req, res) => {
    try{
        const product = await Product.create(req.body);
        res.status(200).json(product);
    }
    catch(err){
        res.status(500).json({ Message: err.message });
    }
}

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


