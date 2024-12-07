const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = async () => {
    try{
        const dbUrl = process.env.DATABASE_URL;
        const db = await mongoose.connect(dbUrl);
        console.log(`MongoDB connected: ${db.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); //1 is failure, status code is success
    }
}
module.exports = connectDB;
