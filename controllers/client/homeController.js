const categoryController = require('../admin/categoryController');
const ingredientController = require('../admin/ingredientController');
const recipeController = require('../admin/recipeController');
const Cuisine = require('../../models/Cuisine');
const Recipe = require('../../models/Recipe');
const Ingredient = require('../../models/Ingredient');

exports.getHomePage = async (req, res) => {
   try {
      const categories = await categoryController.getAllCategories();
      const searchIngredients = await Ingredient.find({});
      const ingredients = await ingredientController.getIngredientsForAllCategories();
      const recipes = await recipeController.getAllRecipes();
      const searchRecipes = await Recipe.find({});
      const cuisines = await Cuisine.find();
      res.render('client/home', {
         categories,
         ingredients,
         recipes,
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
      const recipes = await Recipe.find()
         .populate('ingredients.ingredient', 'name -_id')
         .populate('cuisine', 'name -_id')
         .exec();
         res.json({ recipes });
   } catch (error) {
      console.error('Error fetching recipes:', error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
};

exports.getSearchPage = async (req, res) => {
   try {
      const { searchInput } = req.query;
      const categories = await categoryController.getAllCategories();
      const searchIngredients = await Ingredient.find({}).limit(4);
      const searchRecipes = await Recipe.find({}).limit(4);
      const cuisines = await Cuisine.find();
      const ingredients =
         await ingredientController.getIngredientsForAllCategories();
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

      res.render('client/homeSearch', {
         layout: './layouts/client/defaultLayout',
         categories,
         recipes,
         ingredients,
         searchRecipes,
         cuisines,
         searchIngredients,
      userAuthentication: false,
         user: req.user,
      });
   } catch (error) {
      console.log(error);
   }
};
