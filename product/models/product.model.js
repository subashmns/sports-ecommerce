const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: [true, 'Product name is required'],
            trim: true,
            maxlength: 100
        },
        images: [
            {
                type: String
            }
        ],
        price: { 
            type: Number, 
            required: [true, 'Product price is required'],
            min: 0
        },
        quantity: { 
            type: Number, 
            required: [true, 'Product quantity is required'],
            min: 0
        },
        category: { 
            type: String, 
            required: [true, 'Product category is required'],
            trim: true
        },
        description: { 
            type: String, 
            required: [true, 'Product description is required'],
            maxlength: 1000
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Product seller is required']
        },
        stock: { 
            type: String, 
            enum: ['in stock', 'out of stock', 'limited stock'],
            default: function() {
                return this.quantity > 0 ? 'in stock' : 'out of stock';
            }
        },
        rating: { 
            type: Number,
            min: 0,
            max: 5,
            default: 0 
        },
        numReviews: { 
            type: Number, 
            default: 0 
        }
    },
    {
        timestamps: true,
    }
);

// Middleware to update stock status based on quantity
ProductSchema.pre('save', function(next) {
    this.stock = this.quantity > 0 ? (this.quantity < 10 ? 'limited stock' : 'in stock') : 'out of stock';
    next();
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
