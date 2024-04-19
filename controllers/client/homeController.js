const mongoose = require("../../middlewares/database");
const categoryController = require("../admin/categoryController");
const ingredientController = require("../admin/ingredientController");
const recipeController = require("../admin/recipeController");
const Cuisine = require("../../models/Cuisine");
exports.getHomePage = async (req, res) => {
  try {
    const categories = await categoryController.getAllCategories();
    const ingredients = await ingredientController.getIngredientsForAllCategories();
    const recipes = await recipeController.getAllRecipes();
    const cuisines = await Cuisine.find();
    res.render("client/home", {
      categories,
      ingredients,
      recipes,
      cuisines,
      userAuthentication: false,
      layout: "./layouts/client/defaultLayout",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



