const User = require('../../models/User');
const Recipe = require('../../models/Recipe');

const favoriteRecipeController = {
   getFavoriteRecipe: async (req, res) => {
      try {
        let userID = req.user.id;
         const user = await User.findById(userID)
            .populate('favoriteRecipes')
            .exec();
         res.render('client/favorite', {
            layout: './layouts/client/defaultLayout',
            userAuthentication: false,
            user,
         });
      } catch (err) {
         console.log(err);
         res.status(500).send('Internal Server Error');
      }
   },

   async addFavorite(req, res) {
      try {
          const { slug } = req.params;
  
          // Find the recipe
          const recipe = await Recipe.findOne({ slug });
          if (!recipe) {
              req.flash('error', 'Recipe not found');
              return res.send('Recipe not found');
          }
  
          // Find the user
          const userId = req.user.id;
          const user = await User.findById(userId);
          if (!user) {
              req.flash('error', 'User not found');
              return res.send('User not found');
          }
  
          // Check if the recipe is already a favorite for the user
          const isFavorite = user.favoriteRecipes.includes(recipe._id);
  
          // Toggle the recipe's favorite status
          if (isFavorite) {
              await User.findByIdAndUpdate(userId, { $pull: { favoriteRecipes: recipe._id } });
          } else {
              await User.findByIdAndUpdate(userId, { $addToSet: { favoriteRecipes: recipe._id } });
          }
  
          // Redirect back to the previous page
          const referer = req.headers.referer;
          res.redirect(referer);
      } catch (err) {
          console.error('Error adding favorite:', err);
          req.flash('error', 'Internal Server Error');
          res.status(500).send('Internal Server Error');
      }
  },
  
  


   async deleteFavorite(req, res) {
      try {
         // Find the recipe ID
         const { slug } = req.params;
         const recipe = await Recipe.findOne({ slug });
         if (!recipe) {
            req.flash('error', 'Recipe not found');
            res.send('Recipe not found');
         }

         // Remove the searchHistory from the user document
         const userId = req.user.id;
         await User.findByIdAndUpdate(
            userId,
            { $pull: { favoriteRecipes: recipe._id } },
            { new: true }
         );
         //   res.redirect("");
         res.send('Remove favorite recipe successfully');
      } catch (err) {
         console.log(err);
         res.status(500).send('Internal Server Error');
      }
   },
};

module.exports = favoriteRecipeController;
