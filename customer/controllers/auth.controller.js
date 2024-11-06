const { User } = require('../models/user.model')
const bcrypt = require('bcryptjs');
const { generateTokenAndSetCookie } = require('../utils/generateTokenAndSetCookie');
// const { sendVerificationEmail, sendWelcomeEmail } = require('../mailtrap/emails');
const signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  
  // Validate input fields
  try {
      if (!email || !password || !name || !role ) {
          throw new Error("All fields are required");
      }
      const userAlreadyExists = await User.findOne({ email });

      if (userAlreadyExists) {
          return res.status(400).json({ success: false, message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
          name,
          email,
          password: hashedPassword,
          role
      });

      await user.save();

      // Generate JWT Token and Set Cookie
      const token = generateTokenAndSetCookie(res, user._id);

      // Send successful response
      res.status(200).json({
          success: true,
          message: "User created successfully",
          token,
          user: {
              ...user._doc,
              password: undefined  // Ensure password is not included in the response
          }
      });
  } catch (error) {
      console.error(error.stack); // Log error for better understanding
      res.status(400).json({ success: false, message: error.message });
  }
};
// const verifyEmail = async (req, res) =>{
//     const {code} = req.body;
//     try{
//         const user = await User.findOne({verificationToken: code, verificationTokenExpiresAt: {$gt: Date.now()}});
//         if(!user){
//             return res.status(400).json({success: false, message: "Invalid or expired verification code"});
//         }

//         user.isVerified = true;
//         user.verificationToken = undefined;
//         user.verificationTokenExpiresAt = undefined;
//         await user.save();

//         await sendWelcomeEmail(user.email , user.name);

//         res.status(200).json({success: true, message: "Email verified successfully"})
//     }catch(error){
//         res.status(400).json({success: false, message: error.message});
//     }
//     }

const getAllUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  }

  const getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  }   

const updateUser = async (req, res) => {
    try {
      const { name, email, role } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { name, email, role },
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  }

 const deleteUser = async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  }

const login = async (req, res) => {
    const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT and set it in a cookie
    const token = generateTokenAndSetCookie(res, user._id);

    res.status(200).json({success: true, 
        message: 'Logged in successfully', 
        token, 
        user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

const logout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: "Logged out successfully" });
}

module.exports = {
    signup,
    getAllUsers,
    updateUser,
    deleteUser,
    getUserById,
    login,
    logout,
    // verifyEmail
}
