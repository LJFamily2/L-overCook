const categoryController = require('../admin/categoryController');
const ingredientController = require('../admin/ingredientController');
const recipeController = require('../admin/recipeController');
const Cuisine = require('../../models/Cuisine');
const Recipe = require('../../models/Recipe');
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



exports.getHomePage = async (req, res) => {
   try {
      const categories = await categoryController.getAllCategories();
      const searchIngredients = await Ingredient.find({});
      const ingredients =
      await ingredientController.getIngredientsForAllCategories();
      const isAuthenticated = req.isAuthenticated();
      const userBookmarks = isAuthenticated ? req.user.favoriteRecipes.map(favorite => favorite.toString()) : [];
      const recipes = await recipeController.getAllRecipes();
      const searchRecipes = await Recipe.find({});
      const cuisines = await Cuisine.find();
      const recipesWithStars = recipes.map(recipe => ({
         ...recipe.toObject(),
         isBookmarked: userBookmarks.includes(recipe._id.toString()),
         starsHTML: displayStars(recipe.averageRating) 
      }));
      res.render('client/home', {
         categories,
         ingredients,
         recipes: recipesWithStars,
         searchRecipes,
         searchIngredients,
         cuisines,
         user: req.user,
         userAuthentication: false,
         layout: './layouts/client/defaultLayout',
      });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
};

exports.getAllRecipes = async (req, res) => {
   try {
      const isAuthenticated = req.isAuthenticated();
      let userBookmarks = isAuthenticated ? req.user.favoriteRecipes.map(favorite => favorite.toString()) : [];
      let recipes = await Recipe.find()
         .populate('ingredients.ingredient', 'name -_id')
         .populate('cuisine', 'name -_id')
         .exec();

      recipes = recipes.map(recipe =>({
         ...recipe.toObject(),
         isBookmarked: userBookmarks.includes(recipe._id.toString())
      }))
      res.json({ recipes });
   } catch (error) {
      console.error('Error fetching recipes:', error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
};
exports.getSearchRecipes = async (req, res) => {
   try {
      const searchInput = req.session.searchInput;
      const isAuthenticated = req.isAuthenticated();
      let userBookmarks = isAuthenticated ? req.user.favoriteRecipes.map(favorite => favorite.toString()) : [];
      let recipes = await Recipe.find({
         $or: [
            { name: { $regex: searchInput, $options: 'i' } },
            { description: { $regex: searchInput, $options: 'i' } },
         ],
      })
         .populate({
            path: 'ingredients.ingredient',
            select: 'name -_id',
         })
         .populate({
            path: 'cuisine',
            select: 'name -_id',
         })
         .exec();
         recipes = recipes.map(recipe =>({
            ...recipe.toObject(),
            isBookmarked: userBookmarks.includes(recipe._id.toString()),
         }))
      res.json({ recipes });
   } catch (error) {
      console.error('Error fetching recipes:', error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
};

exports.getSearchPage = async (req, res) => {
   try {
      const { searchInput } = req.query;
      req.session.searchInput = searchInput;
      const categories = await categoryController.getAllCategories();
      const searchIngredients = await Ingredient.find({});
      const searchRecipes = await Recipe.find({});
      const cuisines = await Cuisine.find();
      const ingredients = await ingredientController.getIngredientsForAllCategories();
      const recipes = await Recipe.find({
         $or: [
            { name: { $regex: searchInput, $options: 'i' } },
            { description: { $regex: searchInput, $options: 'i' } },
         ],
      })
         .populate({
            path: 'ingredients.ingredient',
            select: 'name -_id',
         })
         .populate({
            path: 'cuisine',
            select: 'name -_id',
         })
         .exec();
         const isAuthenticated = req.isAuthenticated();
         const userBookmarks = isAuthenticated ? req.user.favoriteRecipes.map(favorite => favorite.toString()) : [];
         const totalRecipes = recipes.length;
         const recipesWithStars = recipes.map(recipe => ({
            ...recipe.toObject(),
            isBookmarked: userBookmarks.includes(recipe._id.toString()),
            starsHTML: displayStars(recipe.averageRating) 
         }));
      res.render('client/homeSearch', {
         layout: './layouts/client/defaultLayout',
         categories,
         recipes: recipesWithStars,
         ingredients,
         searchRecipes,
         cuisines,
         searchIngredients,
         userAuthentication: false,
         user: req.user,
         totalRecipes,
         searchInput
      });
   } catch (error) {
      console.log(error);
   }
};
