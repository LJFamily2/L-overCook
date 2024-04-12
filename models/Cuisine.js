const mongoose = require('mongoose');
const { Schema } = mongoose;

const cuisineSchema = Schema({
    name: {
        type: String,
        required: true
    }
})

const Cuisine = mongoose.model('Cuisine', cuisineSchema);

module.exports = Cuisine;