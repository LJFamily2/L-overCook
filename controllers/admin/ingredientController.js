const mongoose = require('../../middlewares/database');
const Ingredient = require('../../models/Ingredient');
const Recipe = require('../../models/Recipe');
const Category = require('../../models/Category');
const categoryController = require('./categoryController');

// Get all ingredients
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

// Helper function to create ingredient without returning status
exports.createIngredientLogic = async(name, categoryName) => {
    try {
        // Check if ingredient exist
        const existingIngredient = await Ingredient.findOne({ name });
        if(existingIngredient){
           throw new Error('Ingredient already existed.')
        }
        console.log(existingIngredient)
        
        // Check if category exists
        let categoryId;
        const categoryMap = new Map((await Category.find()).map(cat => [cat.name, cat._id]));
        if (categoryMap.has(categoryName)) {
            // If the category exists, retrieve its ID from the map
            categoryId = categoryMap.get(categoryName);
        } else {
            // If the category doesn't exist, create a new one
            const newCategory = await categoryController.createCategoryLogic(categoryName);
            categoryId = newCategory._id;
        }

        // Create a new ingredient object with name and category
        const ingredient = new Ingredient({
            name,
            category: categoryId
        });

        // Save the new ingredient to the database
        const newIngredient = await ingredient.save();
        return newIngredient;  
    } catch (error) {
        throw new Error(error.message);
    }
};


// Create new ingredient by calling the helper function and return status
exports.createIngredient = async (req, res) => {
    const { name, categoryName } = req.body;
    try{
        const newIngredient = await this.createIngredientLogic(name, categoryName);
        if(newIngredient){
            res.status(201).json({message: 'Ingredient added successfully', newIngredient});
        }
    }catch(error){
        res.status(500).json({error: error.message});
    }
};


// Delete existing ingredient
exports.deleteIngredient = async (req,res) => {
    const ingredientId = req.params.id;
    try{
        // Check if ingredient exists
        const ingredient = await Ingredient.findById(ingredientId);
        if (!ingredient) {
            return res.status(404).json({ error: 'Ingredient not found' });
        }
        
        // Delete the ingredient in  the recipe's ingredient array
        await Recipe.updateMany(
            { "ingredients.ingredient": ingredientId },
            { $pull: { ingredients: { ingredient: ingredientId } } }
        );
        
        // Delete ingredient
        await Ingredient.deleteOne({ _id: ingredientId });
        res.status(200).json({ message: 'Ingredient deleted successfully' });
    }catch(error){
        res.status(500).json({message:error.message});
    }
};

//Update ingredient
exports.updateIngredient = async (req, res) => {
    const ingredientId = req.params.id;
    const { name, categoryName } = req.body;
    try{
        // Check if id existed
        const ingredient = await Ingredient.findById(ingredientId);
        if(!ingredient){
            return res.status(404).json({error: 'Ingredient not found'});
        }

        // Check if name already exists for another ingredient
        const existingIngredient = await Ingredient.findOne({ name });
        if (existingIngredient && existingIngredient._id.toString() !== ingredientId) {
            return res.status(400).json({ error: `Ingredient with name '${name}' already exists` });
        }

        // Check if category existed
        let categoryId;
        const categoryMap = new Map((await Category.find()).map(cat => [cat.name, cat._id]));
        if (categoryMap.has(categoryName)) {
            // If the category exists, retrieve its ID from the map
            categoryId = categoryMap.get(categoryName);
        } else {
            // If the category doesn't exist, create a new one
            const newCategory = await categoryController.createCategoryLogic(categoryName);
            categoryId = newCategory._id;
        }
        
        // Update the ingredient
        const resultIngredient = await Ingredient.findByIdAndUpdate(ingredientId, { name: name, category: categoryId}, { new: true });
        console.log(resultIngredient)
        res.status(200).json({ message: 'Ingredient updated successfully'});
        
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}



