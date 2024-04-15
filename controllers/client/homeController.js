const mongoose = require("../../middlewares/database");
const categoryController = require("../admin/categoryController");
const ingredientController = require("../admin/ingredientController");
const recipeController = require("../admin/recipeController");

exports.getHomePage = async (req, res) => {
  try {
    const categories = await categoryController.getAllCategories();
    const ingredients = await ingredientController.getAllIngredients();
    const recipes = await recipeController.getAllRecipes();

    res.render("home", {
      categories,
      ingredients,
      recipes,
      layout: "./layouts/client/defaultLayout",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



