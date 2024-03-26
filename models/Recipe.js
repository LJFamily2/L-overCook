const mongoose = require('mongoose');

//Define schema
const recipeSchema = new mongoose.Schema({

});

//Define model based on schema
const Recipe = mongoose.model('Recipe', recipeSchema);

//Export module for use in other parts
module.exports = Recipe;

const mongoose = require('mongoose');

//Define schema
const ingredientSchema = new mongoose.Schema({

});

//Define model based on schema
const Ingredient = mongoose.model('Ingredient', ingredientSchema);

//Export module for use in other parts
module.exports = Ingredient;