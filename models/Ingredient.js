const mongoose = require('mongoose');
const { Schema } = mongoose;

const ingredientSchema = Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }
})

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;