const mongoose = require('mongoose')

const ProductSchema =  mongoose.schema(
    {
        name: { 
            type: String, 
            required: true 
        },
        description: { 
            type: String, 
            required: true  
        },
        category: { 
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
        image: { 
            type: String, 
            required: true   
        },
        date: { 
            type: Date, 
            default: Date.now  
        },
        price: { 
            type: Number, 
            required: true 
        },
        quantity: { 
            type: Number, 
            required: true 
        }
    }
)

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;