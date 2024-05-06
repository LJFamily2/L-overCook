const mongoose = require('mongoose');
const { Schema } = mongoose;

const ingredientSchema = Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
})

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;