const User = require("../../models/User");
const Recipe = require("../../models/Recipe");

const favoriteRecipeController = {
  getFavoriteRecipe: async (req, res) => {
    try {
      const favoriteRecipe = await User.find()
        .populate("favoriteRecipe")
        .exec();
      res.render("client/favorite", { layout: "./layouts/client/defaultLayout", userAuthentication: true });
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  },

  async addFavorite(req, res) {
    try {
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
        { $addToSet: { favoriteRecipes: recipe._id } },
        { new: true }
      );

      res.redirect("/recipes/" + slug);
      res.send("Save favorite recipe successfully");
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  },

  async deleteFavorite(req, res) {
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
          { $pull: { favoriteRecipes: recipe._id } },
          { new: true }
        );
      //   res.redirect("");
      res.send("Remove favorite recipe successfully");
      } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      }
    },
};

module.exports = favoriteRecipeController;
