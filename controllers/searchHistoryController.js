const User = require("../models/User");
const Recipe = require("../models/Recipe");

const searchHistoryController = {
  getSearchHistory: async (req, res) => {
    try {
      const searchHistory = await User.find().populate("searchHistory").exec();
      // res.render(""{searchHistory});
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  },

  addSearchHistory: async (req, res) => {
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
        { $addToSet: { searchHistory: recipe._id } },
        { new: true }
      );

      res.redirect("/recipes/" + slug);
      res.send("Search history added successfully");
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
        { $pull: { readingHistory: book._id } },
        { new: true }
      );
    //   res.redirect("");
    res.send("Search history deleted successfully");
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  },
};

module.exports = searchHistoryController;
