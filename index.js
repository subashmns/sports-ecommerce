const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db/connectDB');

// Route imports
const productRoute = require('./product/routes/products.routs');
const authRoutes = require('./customer/routes/auth.route');
const sellerProduct = require('./seller/seller.route/seller.route');

dotenv.config();

const app = express();
const PORT = process.env.PORT ;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle preflight requests
app.options('*', cors());



// Routes
app.use('/products', productRoute);
app.use('/users', authRoutes);
app.use('/seller', sellerProduct);

// Database Connection and Server Start
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => {
  console.error("Database connection failed:", error);
});

// Global Error Handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An error occurred!' });
});
