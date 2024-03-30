const mongoose = require('../config/database');
const categoryController = require('../controllers/categoryController');
const ingredientController = require('../controllers/ingredientController');
const recipeController = require('../controllers/recipeController');

exports.getHomePage = async (req, res) => {
    try {
        const categories = await categoryController.getAllCategories();
        const ingredients = await ingredientController.getAllIngredients();
        const recipes = await recipeController.getAllRecipes();

        res.render('home', { categories, ingredients, recipes, layout:false });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}