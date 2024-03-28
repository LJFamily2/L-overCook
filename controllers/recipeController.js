// Import mongoose and recipe model
const mongoose = require('../config/database')
const Recipe = require('../models/Recipe');

// Get all recipe function
exports.getAllRecipe = async (req,res) => {
    try {
        // Fetch all recipes from the database
        const recipes = await Recipe.find();

        // Render the recipes.ejs file and pass the recipes data to it
        // res.render('admins/recipes', { recipes , layout: false});
        res.status(200).json(recipes);
    } catch (error) {
        // Handle any errors
        res.status(500).json({ message: error.message });
    }
};

// Create recipe function
exports.createRecipe = async (req, res) => {
    const { name, ingredients, description, cuisine, image, time, url} = req.body;

    // Create new recipe instance
    const recipe = new Recipe({
        name, 
        ingredients,
        description,
        cuisine,
        image,
        time,
        url
    });

    // Save new recipe to database
    try{
        const newRecipe = await recipe.save();
        res.status(201).json(newRecipe);
    }catch(error){
        res.status(400).json({message: error.message});
    }
};

// Get recipe by name
exports.getRecipeByName = async (req, res) => {
    const { name } = req.params;
  
    // Find recipe by name
    try {
      const recipe = await Recipe.findOne({ name: name });
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
      res.json(recipe);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
  

// Update recipe
exports.updateRecipe = async (req, res) => {
    try{
        const recipe = await Recipe.findById(req.params.id);
        if(!recipe){
            return res.status(404).json({message: 'Recipe not found'});
        }
        
        // Update recipe properties with values from request body if provided, keep intial if not provided
        const { name, ingredients, description, cuisine, image, time, url} = req.body;
        console.log(name);
        recipe.name = name || recipe.name;
        recipe.ingredients = ingredients || recipe.ingredients;
        recipe.description = description || recipe.description;
        recipe.cuisine = cuisine || recipe.cuisine;
        recipe.image = image || recipe.image;
        recipe.time = time || recipe.time;
        recipe.url = url || recipe.url;
    
        // Save the updated recipe to database
        const updatedRecipe = await recipe.save();
        res.json(updatedRecipe);
    }catch(error){
        res.status(500).json({message: error.message})
    }    
};

// Delete recipe by its name
exports.deleteRecipe = async (req,res) => {
    try{
        const recipe = await Recipe.findById(req.params.id);
        if(!recipe){
            return res.status(404).json({message: 'Recipe not found'});
        }

        await recipe.deleteOne();
        res.json({message: 'Recipe deleted'});
    }catch(error){
        res.status(500).json({message:error.message});
    }
};