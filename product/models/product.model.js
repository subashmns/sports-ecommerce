const mongoose = require('mongoose')

const ProductSchema =  mongoose.Schema(
    {
        name: { 
            type: String, 
            required: [true, 'Product name is required']
        },
        image: { 
            type: String, 
            required: [true, 'Product image is required']   
        },
        price: { 
            type: Number, 
            required: [true, 'Product price is required']
        },
        quantity: { 
            type: Number, 
            required: [true, 'Product quantity is required']
        },
        category: { 
            type: String, 
            required: [true, 'Product category is required']  
        },
        description: { 
            type: String, 
            required: [true, 'Product description is required']  
        },
        supplier: { 
            type: String, 
            required: [true, 'Product supplier is required']   
        },
        stock: { 
            type: String, 
            required: false   
        },
        rating: { 
            type: Number,
            required: false,
            min: 0,
            max: 5,
            default: 0 
        }
    },
    {
        timestamps: true,
    }
)

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;