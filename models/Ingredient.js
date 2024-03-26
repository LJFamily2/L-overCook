

//Define schema
const ingredientSchema = new mongoose.Schema({

});

//Define model based on schema
const Ingredient = mongoose.model('Ingredient', ingredientSchema);

//Export module for use in other parts
module.exports = Ingredient;