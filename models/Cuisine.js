const mongoose = require("mongoose");

//Define schema
const cuisineSchema = new mongoose.Schema({
    name: String
});

//Define model based on schema
const Cuisine = mongoose.model('Cuisine', cuisineSchema);

//Export module for use in other parts
module.exports = Cuisine;