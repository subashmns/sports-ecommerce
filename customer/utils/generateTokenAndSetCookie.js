const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (res, userId) =>{
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })
    res.cookie('token', token, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', //csrf protection
        maxAge: 60 * 60 * 24 * 7 * 1000 // 7 days in milliseconds
     });

     return token;
}

module.exports = { generateTokenAndSetCookie }