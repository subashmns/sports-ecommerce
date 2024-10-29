const express = require('express');
const app = express();
const productRoute = require('./product/routes/products.routs')
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB  = require('./db/connectDB');
const authRoutes = require('./customer/routes/auth.route')

dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // to parse json data in request body
app.use(express.urlencoded({ extended: false }));

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use('/products', productRoute);
app.use('/users', authRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port 5000 thanks");
});

    