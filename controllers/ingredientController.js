const mongoose = require('../config/database');
const Ingredient = require('../models/Ingredient');
const categoryController = require('../controllers/categoryController');

//Get all ingredients
exports.getAllIngredients = async (req,res) => {
    try{
        const ingredients = await Ingredient.find()
        .populate({
            path: 'category',
            select: 'name -_id'
        })
        .exec();
        res.status(200).json(ingredients);
        return ingredients;
    }catch(error){
        res.status(500).json({error: error.message});
        throw new Error(error.message);
    }
};

// Helper function to create ingredient without returning status
exports.createIngredientLogic = async(name, categoryName) => {
    try {
        // Check if ingredient already exists
        const existingIngredient = await Ingredient.findOne({ name });
        if (existingIngredient) {
            throw new Error('Ingredient already exists');
        }

        // Variable to hold category object
        let category; 

        // Check if category existed
        const existingCategory = await categoryController.existingCategory(categoryName);
        
        // Create new category if it doesn't exist, else use the existing category
        if(!existingCategory){
            const newCategory = await categoryController.createCategoryLogic(categoryName);
            category = newCategory; // Assign the created category object to the category variable
        }else {
            category = existingCategory; 
        }

        // Create the new ingredient object with the category Id
        const newIngredient = { name, category: category._id };

        // Create the ingredient in the database
        const createdIngredient = await Ingredient.create(newIngredient);

        console.log("New ingredient added successfully.")
        return createdIngredient;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Create new ingredient by calling the helper function and return status
exports.createIngredient = async (req, res) => {
    const { name, categoryName } = req.body;
    try{
        const newIngredient = await this.createIngredientLogic(name, categoryName);
        res.status(201).json(newIngredient);
    }catch(error){
        res.status(500).json({error: error.message});
    }
};

// // Delete existing ingredient
// exports.deleteIngredient = async (req,res) => {
//     const ingredientId = req.params.id;
//     console.log(ingredientId)
//     try{
//         // Check if ingredient exists
//         const ingredient = await Ingredient.findById(ingredientId);
//         if (!ingredient) {
//             return res.status(404).json({ error: 'Ingredient not found' });
//         }
        
//         // How should this be handle?
//         // // Update recipes associated with the deleted ingredient
//         // await Recipe.updateMany(
//         //     {ingredient: ingredientId},
//         //     { $unset: { ingredient: '' } }
//         // );
        
//         // Delete ingredient
//         await Ingredient.deleteOne({ _id: ingredientId });
//         res.status(200).json({ message: 'Ingredient deleted successfully' });
//     }catch(error){
//         res.status(500).json({message:error.message});
//     }
// };

// // Update ingredient - Do or no?