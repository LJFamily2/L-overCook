const mongoose = require('../../middlewares/database');
const Recipe = require('../../models/Recipe');
const Ingredient = require('../../models/Ingredient');
const Cuisine = require('../../models/Cuisine');
const ingredientController = require('./ingredientController');
const cuisineController = require('./cuisineController');


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
      const recipes = await this.getAllRecipes();
      const ingredients = await ingredientController.getAllIngredients();
      const cuisines = await cuisineController.getAllCuisines();
      res.render('admin/recipes', { recipes, ingredients, cuisines, layout: "./layouts/admin/defaultLayout"});
   } catch (error) {
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

      // Map cuisine
      const cuisineMap = new Map(
         (await Cuisine.find()).map((cui) => [cui.name, cui._id])
      );

      // Loop through ingredient list to map id with name
      for (const ingredient of ingredients) {
         let ingredientId = ingredientMap.get(ingredient.name);
         if (!ingredientId) {
            throw new Error('Ingredient not found: ' + ingredient.name);
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
   console.log( name, description, ingredients, cuisineName, image, time, url );
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
         res.redirect('/recipeManagement?success=true'); 
      }
   } catch (error) {
      res.redirect('/recipeManagement?error=true&message=' + encodeURIComponent(error.message));
   }
};
