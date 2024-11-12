const Product = require('../models/product.model');

const createProduct = async (req, res) => {
    try {
        const images = [];

        // If files are uploaded, add them to images array with `isLocal` flag
        if (req.files) {
            req.files.forEach(file => {
                images.push({
                    url: file.path,  // Local path to the image file
                    isLocal: true
                });
            });
        }

        // If external image URLs are provided in the request body
        if (req.body.externalImages) {
            const externalImages = JSON.parse(req.body.externalImages);
            externalImages.forEach(url => {
                images.push({
                    url,
                    isLocal: false  // Indicates it's an external URL
                });
            });
        }

        // Create product with images array included
        const productData = {
            ...req.body,
            images  // Merging images (both local and URLs) into product data
        };

        const product = await Product.create(productData);
        res.status(200).json(product);
    } catch (err) {
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


