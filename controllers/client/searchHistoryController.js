const User = require("../../models/User");
const Recipe = require("../../models/Recipe");
const categoryController = require("../admin/categoryController");
const ingredientController = require("../admin/ingredientController");
const Ingredient = require('../../models/Ingredient');

function displayStars(rating) {
   let html = '';
   const roundedRating = Math.round(rating);
   for (let i = 1; i <= 5; i++) {
       if (i <= roundedRating) {
           html += '<i class="ri-heart-3-fill stars" style="color: #980201"></i>';
       } else {
           html += '<i class="ri-heart-3-fill stars" style="color: #d9d9d9"></i>';
       }
   }
   return html;
}

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
        const isAuthenticated = req.isAuthenticated();
      const userBookmarks = isAuthenticated ? req.user.favoriteRecipes.map(favorite => favorite.toString()) : [];
      const recipesWithStars = user.searchHistory.map(recipe => ({
        ...recipe.toObject(),
        isBookmarked: userBookmarks.includes(recipe._id.toString()),
        starsHTML: displayStars(recipe.averageRating) 
     }));
      const searchRecipes = user.searchHistory;
      const searchIngredients = await Ingredient.find({});
      res.render("client/searchHistory", {
        layout: './layouts/client/defaultLayout',
        userAuthentication: false,
        user: recipesWithStars,
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
        { $pull: { searchHistory: recipe._id } },
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
