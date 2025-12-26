/**
 * DATABASE CONNECTION
 * This file handles connecting to MongoDB using Mongoose.
 * It's imported in server.js to establish the DB link when the app starts.
 */

const mongoose = require('mongoose');

// Fallback MongoDB URI for production (Render doesn't always inject env vars correctly)
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://asaniketsingh422_db_user:aniket%400105@cluster0.asz1ncn.mongodb.net/videostreamapp?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, log error and shut down the app
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;

