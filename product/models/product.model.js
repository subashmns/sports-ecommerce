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
        images: [
            {
                url: { 
                    type: String, 
                    required: [true, 'Image URL is required'] 
                },
                isLocal: { 
                    type: Boolean, 
                    default: false // Set to `true` for local images
                }
            }
        ],
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
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Product seller is required']
        },
        stock: { 
            type: String, 
            default: "in stock"
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