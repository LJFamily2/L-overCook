const mongoose = require('mongoose');

const { Schema } = mongoose;

const reviewSchema = Schema({
    user: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: String,
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

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
    reviews: [reviewSchema],
    image: String,
    time: String,
    url: String
})

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;