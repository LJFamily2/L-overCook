const categoryController = require('../admin/categoryController');
const ingredientController = require('../admin/ingredientController');
const recipeController = require('../admin/recipeController');
const Cuisine = require('../../models/Cuisine');
const Recipe = require('../../models/Recipe');
const Ingredient = require('../../models/Ingredient');

exports.getHomePage = async (req, res) => {
   try {
      const categories = await categoryController.getAllCategories();
      const searchIngredients = await Ingredient.find({}).limit(4);
      const ingredients =
         await ingredientController.getIngredientsForAllCategories();
      const recipes = await recipeController.getAllRecipes();
      const searchRecipes = await Recipe.find({}).limit(4);
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

// exports.getSearchPage = async (req, res) => {
//    try {
//       const { searchInput } = req.body;
//       const categories = await categoryController.getAllCategories();
//       const searchIngredients = await Ingredient.find({}).limit(4);
//       const searchRecipes = await Recipe.find({}).limit(4);

//       const ingredients =
//          await ingredientController.getIngredientsForAllCategories();
//       const recipes = await Recipe.find({
//          $or: [
//             { name: { $regex: searchInput, $options: 'i' } },
//             { description: { $regex: searchInput, $options: 'i' } },
//          ],
//       })
//          .populate({
//             path: 'ingredients.ingredient',
//             select: 'name -_id',
//          })
//          .populate({
//             path: 'cuisine',
//             select: 'name -_id',
//          })
//          .exec();

//       res.render('client/homeSearch', {
//          layout: './layouts/client/defaultLayout',
//          categories,
//          recipes,
//          ingredients,
//          searchRecipes,
//          searchIngredients,
//          userAuthentication: false,
//          user: req.user,
//       });
//    } catch (error) {
//       console.log(error);
//    }
// };
