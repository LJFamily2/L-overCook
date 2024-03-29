const mongoose = require('mongoose');
const { Schema } = mongoose;

const cuisineSchema = Schema({
    _id: Schema.Types.ObjectId,
    name: String
})

const Cuisine = mongoose.model('Cuisine', cuisineSchema);

module.exports = Cuisine;