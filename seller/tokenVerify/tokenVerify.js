const jwt = require('jsonwebtoken');
const User = require('../../customer/models/user.model'); // Import your User model

const protect = async (req, res, next) => {
    let token;

    // Check for token in the request headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from the header
            token = req.headers.authorization.split(' ')[1]; // Extract the token part from "Bearer <token>"

            // Decode the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode the token

            // Get the user from the token
            req.user = await User.findById(decoded.userId).select('-password'); // Find the user by ID and exclude the password
            next(); // Call the next middleware or route handler
        } catch (error) {
            console.error("Error in protect middleware:", error);
            res.status(401).json({ success: false, message: 'Not authorized, token failed' }); // Send error response if token verification fails
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' }); // Send error response if no token was found
    }
};

module.exports = { protect }; // Export the protect middleware
