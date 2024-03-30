const mongoose = require('mongoose');

const { Schema } = mongoose;

const recipeSchema = Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    ingredients: [{
        ingredient:{
            type: Schema.Types.ObjectId,
            ref: 'Ingredient'
        },
        quantity: String,
    }],
    cuisine: {
        type: Schema.Types.ObjectId,
        ref: 'Cuisine'
    },
    image: String,
    time: String,
    url: String
})

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;