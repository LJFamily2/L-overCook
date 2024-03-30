const mongoose = require('../config/database');
const Ingredient = require('../models/Ingredient');

// // Get all ingredients
// exports.getAllIngredients = async (req,res) => {
//     try{
//         const ingredients = await Ingredient.find()
//         .populate({
//             path: 'category',
//             select: 'name -_id'
//         })
//         .exec();
//         res.status(200).json(ingredients);
//     }catch(error){
//         res.status(500).json({error: error.message});
//     }
// };

//Get all ingredients
exports.getAllIngredients = async (req,res) => {
    try{
        const ingredients = await Ingredient.find()
        .populate({
            path: 'category',
            select: 'name -_id'
        })
        .exec();
        return ingredients;
    }catch(error){
        throw new Error(error.message);
    }
};


// Create new ingredient
exports.createIngredient = async (req, res) => {
    const { name } = req.body;

    try {
        // Check if ingredient already exists
        const existingIngredient = await Ingredient.findOne({ name });
        if (existingIngredient) {
            return res.status(400).json({error: 'Ingredient already exists' });
        }

        // Create new ingredient instance with a new ObjectId
        const ingredient = new Ingredient({
            _id: new mongoose.Types.ObjectId(), // Generate a new ObjectId for _id
            name,
        });

        // Save the new ingredient
        const newIngredient = await ingredient.save();

        res.status(201).json({ ingredient: newIngredient, message: 'Ingredient added to database' });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Delete existing ingredient
exports.deleteIngredient = async (req,res) => {
    const ingredientId = req.params.id;
    console.log(ingredientId)
    try{
        // Check if ingredient exists
        const ingredient = await Ingredient.findById(ingredientId);
        if (!ingredient) {
            return res.status(404).json({ error: 'Ingredient not found' });
        }
        
        // How should this be handle?
        // // Update recipes associated with the deleted ingredient
        // await Recipe.updateMany(
        //     {ingredient: ingredientId},
        //     { $unset: { ingredient: '' } }
        // );
        
        // Delete ingredient
        await Ingredient.deleteOne({ _id: ingredientId });
        res.status(200).json({ message: 'Ingredient deleted successfully' });
    }catch(error){
        res.status(500).json({message:error.message});
    }
};

// Update ingredient - Do or no?