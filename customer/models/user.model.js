const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['admin', 'customer', 'seller'],
        default: 'customer'
    },
    // lastLogin:{
    //     type: Date,
    //     default: Date.now
    // },
    // isVerified: {
    //     type: Boolean,
    //     default: false
    // },
   
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    // verificationToken: String,
    // verificationTokenExpiresAt: Date,
},{timestamps:true});

const User = mongoose.model('User', userSchema);

module.exports = { User };