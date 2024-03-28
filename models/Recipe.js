const mongoose = require('mongoose');


//Define schema
const recipeSchema = new mongoose.Schema({
    name: String,
    ingredients:[{
        ingredient:{
            type:String,
            required: true
        },
        quantity:{
            type: mongoose.Schema.Types.Mixed,
            required: true
        }
    }],
    description: String,
    cuisine: String,
    image: String,
    time: String,
    url: String
});

//Define model based on schema
const Recipe = mongoose.model('Recipe', recipeSchema);

//Export module for use in other parts
module.exports = Recipe;