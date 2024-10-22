const mongoose = require('mongoose')

const ProductSchema =  mongoose.schema(
    {
        name: { 
            type: String, 
            required: true 
        },
        image: { 
            type: String, 
            required: true   
        },
        price: { 
            type: Number, 
            required: true 
        },
        quantity: { 
            type: Number, 
            required: true 
        },
        category: { 
            type: String, 
            required: true  
        },
        description: { 
            type: String, 
            required: true  
        },
        supplier: { 
            type: String, 
            required: false   
        },
        stock: { 
            type: Number, 
            required: true    
        },
        rating: { 
            type: Number, 
            default: 0 
        },
        date: { 
            type: Date, 
            default: Date.now  
        }
    }
)

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;