const mongoose = require('../config/database');
const Recipe = require('../models/Recipe');
const Ingredient = require('../models/Ingredient');
const Cuisine = require('../models/Cuisine');
const ingredientController = require('../controllers/ingredientController');

// Get all recipes
exports.getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find()
            .populate({
                path: 'ingredients.ingredient',
                select: 'name -_id'
            })
            .populate({
                path: 'cuisine',
                select: 'name -_id'
            })
            .exec();
        // res.status(200).json(recipes);
        return recipes;
    } catch (error) {
        // res.status(500).json({ error: error.message });
        throw new Error(error.message);
    }
};

// exports.createRecipeLogic = async (name, description, ingredientsList, cuisineName, image, time, url) => {
//     try{
//         // Map 
//     }
// }

// exports.createRecipeLogic = async (name, description, ingredientsList, cuisineName, image, time, url) => {
//     try{
//         const ingredientMap = new Map((await Ingredient.find()).map(ing => [ing.name, ing._id]));
//         console.log("Ingredient Map : ", ingredientMap);

//         const cuisineMap = new Map((await Cuisine.find()).map(cui => [cui.name, cui._id]));
//         console.log("Cuisine Map : ", cuisineMap);

//         for(const ingredient of ingredientsList){
//             let ingredientId = ingredientMap.get(ingredient.name);
//             if(!ingredientId){
//                 const newIngredient = await ingredientController.createIngredientLogic(ingredient.name);
//                 ingredientId = newIngredient._id;
//             }
//         }
//     }catch(error){
//         console.error('Error creating recipe:', error);
//         throw new Error('Failed to create recipe');
//     }
// }
 

// exports.createRecipe = async(req, res) => {
//     const { name, description, ingredients, cuisine, image, time, url } = req.body;

//     try{
//         const existingRecipe = await Recipe.findOne({name});
//         if(!existingRecipe){
//             const newRecipe = await this.createRecipeLogic(name, description, ingredients, cuisine, image, time, url);
//             res.status(201).json({message: 'Recipe added successfully', newRecipe});
//         }else{
//             return res.status(400).json({error: 'Recipe already existed.'});
//         }
//     }catch(error){
//         res.status(500).json({error: error.message});
//     }
// }