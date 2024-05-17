const User = require("../../models/User");
const Recipe = require("../../models/Recipe");
const categoryController = require("../admin/categoryController");
const ingredientController = require("../admin/ingredientController");
const Ingredient = require('../../models/Ingredient');

const searchHistoryController = {
  getSearchHistory: async (req, res) => {
    try {
      let userID = req.user.id;
      const user = await User.findById(userID)
        .populate({
          path: 'searchHistory',
          model: 'Recipe'
        })
        .exec();
      const searchRecipes = user.searchHistory;
      const searchIngredients = await Ingredient.find({});
      res.render("client/searchHistory", {
        layout: './layouts/client/defaultLayout',
        userAuthentication: false,
        user,
        searchIngredients,
        searchRecipes,
        messages: req.flash()
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  },
  
  addSearchHistory: async (req, res) => {
    try {
      if(req.user && req.user.id){
      // Find the recipe ID
      const { slug } = req.params;
      const recipe = await Recipe.findOne({ slug });
      if (!recipe) {
        req.flash("error", "Recipe not found");
        res.send("Recipe not found");
      }

      // Add the ID to the user's search history
        const userId = req.user.id;
        await User.findByIdAndUpdate(
          userId,
          { $addToSet: { searchHistory: recipe._id } },
          { new: true }
        );
        console.log("addined history ")
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  },

  deleteSearchHistory: async (req, res) => {
    try {
      // Find the recipe ID
      const { slug } = req.params;
      const recipe = await Recipe.findOne({ slug });
      if (!recipe) {
        req.flash("error", "Recipe not found");
        res.send("Recipe not found");
      }

    // Remove the searchHistory from the user document
    const userId = req.user.id;
    await User.findByIdAndUpdate(
        userId,
        { $pull: { readingHistory: recipe._id } },
        { new: true }
      );
      req.flash('success', `Recipe <strong>${recipe.name}</strong> has been removed`);

         res.redirect(req.headers.referer + "#all-recipes")
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  },
};

module.exports = searchHistoryController;
