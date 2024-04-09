require('dotenv').config(); // Load environemnt variables from .env file
const mongoose = require('mongoose');

// Setup mongoose connection and handling connection errors
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.log("Error connecting to MongoDB:", error.message));

module.exports = mongoose;