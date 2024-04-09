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
            select: 'name -_id',
         })
         .populate({
            path: 'cuisine',
            select: 'name -_id',
         })
         .exec();
      

      return recipes;
   } catch (error) {
      throw new Error(error.message);
   }
};

// Get all recipes
exports.getRecipePage = async (req, res) => {
   try {
      const recipes = this.getAllRecipes();
      const cuisines = await Cuisine.find();
      const ingredients = await Ingredient.find();
      res.render('admins/recipes', { layout: false, recipes, cuisines, ingredients });
   } catch (error) {
      res.status(500).json({ error: error.message });
      throw new Error(error.message);
   }
};


// Helper function to create recipe without returning status
exports.createRecipeLogic = async (
   name,
   description,
   ingredients,
   cuisineName,
   image,
   time,
   url
) => {
   try {
      // Check if recipe existed
      const existingRecipe = await Recipe.findOne({ name });
      if (existingRecipe) {
         throw new Error('Ingredient already existed.');
      }

      // Map ingredient
      const ingredientMap = new Map(
         (await Ingredient.find()).map((ing) => [ing.name, ing._id])
      );
      console.log('Ingredient Map: ', ingredientMap);

      // Map cuisine
      const cuisineMap = new Map(
         (await Cuisine.find()).map((cui) => [cui.name, cui._id])
      );
      console.log('Cuisine Map: ', cuisineMap);

      // Loop through ingredient list to map id with name
      for (const ingredient of ingredients) {
         let ingredientId = ingredientMap.get(ingredient.name);
         if (!ingredientId) {
            throw new Error('Ingredient not found: ', error.message);
         }
         ingredient.ingredient = ingredientId;
      }

      // Create a new Recipe instance
      const recipe = new Recipe({
         name,
         description,
         ingredients,
         cuisineName,
         image,
         time,
         url,
      });

      // Save the recipe to the database
      const newRecipe = await recipe.save();
      return newRecipe;
   } catch (error) {
      throw new Error(error.message);
   }
};

// Create new ingredient by calling the helper function and return status
exports.createRecipe = async (req, res) => {
   const { name, description, ingredients, cuisineName, image, time, url } = req.body;
   try {
      const newRecipe = await this.createRecipeLogic(
         name,
         description,
         ingredients,
         cuisineName,
         image,
         time,
         url
      );
      if (newRecipe) {
         res.status(201).json({
            message: 'Recipe added successfully',
            newRecipe,
         });
      }
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
};
