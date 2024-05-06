const Recipe = require('../../models/Recipe');
const Ingredient = require('../../models/Ingredient');
const Cuisine = require('../../models/Cuisine');
const ingredientController = require('./ingredientController');
const cuisineController = require('./cuisineController');
const fs = require('fs').promises;
const path = require('path');

// Delete image path
const deleteImageFile = async (image) => {
   try {
      await fs.unlink(path.join('public/uploadImages', image));
   } catch (err) {
      console.log('Error deleting image file:', err);
   }
};

// Get all recipes
exports.getAllRecipes = async (req, res) => {
   try {
      const recipes = await Recipe.find()
         .populate({
            path: 'ingredients.ingredient',
            select: 'name -_id',
         })
         .populate({
            path: 'cuisine',
            select: 'name -_id',
         })
         .exec();
      return recipes;
   } catch (error) {
      throw new Error(error.message);
   }
};

exports.getUpdateRecipePage = async (req, res) => {
   try {
      const id = req.params.id; 
      const cuisines = await Cuisine.find({});
      const ingredients = await Ingredient.find({});
      const recipe = await Recipe.findById(id) 
         .populate({
            path: 'ingredients.ingredient',
            select: 'name -_id',
         })
         .populate({
            path: 'cuisine',
            select: 'name -_id',
         })
         .exec();
      if (!recipe) { 
         return res.status(404).send("Recipe not found"); // 
      }
      res.render('admin/updateRecipe', { layout: './layouts/admin/defaultLayout', recipe, ingredients,cuisines ,currentPage: 'recipe-management' });
   } catch (error) {
      
      console.error(error); 
      res.status(500).send("Internal Server Error"); 
   }
};


// Recipe detail page
exports.getRecipeDetailPage = async (req, res) => {
   try {
      // Find the recipe by its slug and populate it with its related fields
      const recipe = await Recipe.findOne({ slug: req.params.slug })
         .populate({
            path: 'ingredients.ingredient',
            select: 'name -_id',
         })
         .populate({
            path: 'cuisine',
            select: 'name -_id',
         })
         .populate('reviews.user')
         .exec();
      if (!recipe) {
         res.status(404).redirect('/');
         return;
      }

      res.render('client/recipeDetail', {
         layout: './layouts/client/defaultLayout',
         recipe,
         userAuthentication: false,
         user: req.user,
      });
   } catch (error) {
      console.log(error);
   }
};

// Get all recipes
// exports.getRecipePage = async (req, res) => {
//    try {
//       const recipes = await this.getAllRecipes();
//       const ingredients = await ingredientController.getAllIngredients();
//       const cuisines = await cuisineController.getAllCuisines();
//       res.render('admin/recipeManagementPage', {
//          recipes,
//          ingredients,
//          cuisines,
//          layout: './layouts/admin/defaultLayout',
//          currentPage: 'recipe-management',
//          heading: 'Recipe Management',
//       });
//    } catch (error) {
//       throw new Error(error.message);
//    }
// };

exports.getRecipePage = async (req, res) => {
   try {
      const rowsPerPage = parseInt(req.query.rows) || 5;
      const page = parseInt(req.query.page) || 1;
      const limit = rowsPerPage; 
      const skip = (page - 1) * limit;

      // Query the database to fetch a subset of recipes
      const recipes = await Recipe.find().skip(skip).limit(limit);
      
      // Get total count of recipes for pagination
      const totalRecipes = await Recipe.countDocuments();

      const ingredients = await ingredientController.getAllIngredients();
      const cuisines = await cuisineController.getAllCuisines();
      

      res.render('admin/recipeManagementPage', {
         recipes,
         ingredients,
         cuisines,
         layout: './layouts/admin/defaultLayout',
         currentPage: 'recipe-management',
         heading: 'Recipe Management',
         totalPages: Math.ceil(totalRecipes / limit), 
         currentPageNumber: page,
         rowsPerPage: rowsPerPage,
      });
   } catch (error) {
      throw new Error(error.message);
   }
};



// Search for recipes limit by 4
exports.searchRecipe = async (req, res) => {
   const recipes = await Recipe.find({}).limit(4);
   res.json(recipes);
};

// Helper function to create recipe without returning status
exports.createRecipeLogic = async (
   name,
   description,
   ingredients,
   cuisine,
   image,
   time,
   url
) => {
   try {
      // Check if recipe existed
      const existingRecipe = await Recipe.findOne({ name });
      if (existingRecipe) {
         throw new Error('Recipe already existed.');
      }

      // Map ingredient
      const ingredientMap = new Map(
         (await Ingredient.find()).map((ing) => [ing.name, ing._id])
      );

      // Loop through ingredient list to map id with name
      for (const ingredient of ingredients) {
         let ingredientId = ingredientMap.get(ingredient.name);
         if (!ingredientId) {
            throw new Error(
               'Ingredient "' +
                  ingredient.name +
                  '" not found. Please ensure that all ingredients are present in the database before creating new recipe. <a href="/ingredientManagement">View ingredient database.</a>'
            );
         }
         ingredient.ingredient = ingredientId;
      }


      // Create a new Recipe instance
      const recipe = new Recipe({
         name,
         description,
         ingredients,
         cuisine,
         image,
         time,
         url,
      });

      // Save the recipe to the database
      const newRecipe = await recipe.save();
      return newRecipe;
   } catch (error) {
      throw new Error(error.message);
   }
};

// Create new ingredient by calling the helper function and return status
exports.createRecipe = async (req, res) => {
   
   const {
      name,
      description,
      ingredient,
      quantity,
      cuisine,
      time,
      url,
   } = req.body;

   // Ensure ingredient and quantity are arrays and map ingredient name with quantity
   const ingredients = Array.isArray(ingredient)
      ? ingredient.map((name, index) => ({ name, quantity: quantity[index] }))
      : [{ name: ingredient, quantity }];

   console.log(ingredients);
   const image = req.file ? req.file.filename : null;

   console.log('Image: ', image);
   try {
      const newRecipe = await this.createRecipeLogic(
         name,
         description,
         ingredients,
         cuisine,
         image,
         time,
         url
      );
      if (newRecipe) {
         res.redirect('/recipes?success=Recipe+added+successfully');
      }
   } catch (error) {
      res.redirect(
         '/recipes?error=true&message=' +
            encodeURIComponent(error.message)
      );
   }
};

// exports.updateRecipe = async (req, res) => {
//    const recipeId = req.params.id;
//    console.log('Recipe ID: ', recipeId);
//    const { name, description, ingredient, quantity, cuisine, time, url } =
//       req.body;
//    console.log(req.body);

//    // Ensure ingredient and quantity are arrays and map ingredient name with quantity
//    const ingredients = Array.isArray(ingredient)
//       ? ingredient.map((name, index) => ({ name, quantity: quantity[index] }))
//       : [{ name: ingredient, quantity }];

//    // Map ingredient
//    const ingredientMap = new Map(
//       (await Ingredient.find()).map((ing) => [ing.name, ing._id])
//    );

//    // Loop through ingredient list to map id with name
//    for (const ingredient of ingredients) {
//       let ingredientId = ingredientMap.get(ingredient.name);
//       if (!ingredientId) {
//          throw new Error(
//             'Ingredient "' +
//                ingredient.name +
//                '" not found. Please ensure that all ingredients are present in the database before creating new recipe. <a href="/ingredientManagement">View ingredient database.</a>'
//          );
//       }
//       ingredient.ingredient = ingredientId;
//    }

//    try {
//       console.log('Looking for recipe with matching id...');
//       const recipe = await Recipe.findById(recipeId);
//       if (!recipe) {
//          throw new Error('Failed to update item: Recipe not found.');
//       }
//       console.log('Recipe found, checking if updated name exist...');

//       // Check if name already exists for another ingredient
//       const existingRecipe = await Recipe.findOne({ name });
//       if (existingRecipe && existingRecipe._id.toString() !== recipeId) {
//          throw new Error(
//             `Failed to update item: Recipe with name '${name}' already exists`
//          );
//       }
//       console.log(req.file)
//       // Update image if a new file is uploaded
//       if (req.file && recipe.image) {
//             const de = await deleteImageFile(recipe.image);
//             console.log("remove image: " ,de)
//       }else{
//          recipe.image = req.file.filename;
//       }
//       console.log('Updating recipe...');
//       const resultRecipe = await Recipe.findByIdAndUpdate(
//          recipeId,
//          {
//             name: name,
//             description: description,
//             ingredients: ingredients,
//             cuisine: cuisine,
//             image: req.file ? req.file.filename : recipe.image, // Update image only if a new file is uploaded
//             time: time,
//             url: url,
//          },
//          { new: true }
//       );
//       console.log('results: ', resultRecipe);
//       res.redirect('/recipes?success=Recipe+updated+successfully');
//    } catch (error) {
//       console.log('Error updating recipe.');
//       res.redirect(
//          '/recipes?error=true&message=' +
//             encodeURIComponent(error.message)
//       );
//    }
// };
exports.updateRecipe = async (req, res) => {
   const recipeId = req.params.id;
   console.log('Recipe ID: ', recipeId);
   const { name, description, ingredient, quantity, cuisine, time, url } = req.body;
   console.log(req.body);

   // Ensure ingredient and quantity are arrays and map ingredient name with quantity
   const ingredients = Array.isArray(ingredient)
      ? ingredient.map((name, index) => ({ name, quantity: quantity[index] }))
      : [{ name: ingredient, quantity }];

   // Map ingredient
   const ingredientMap = new Map(
      (await Ingredient.find()).map((ing) => [ing.name, ing._id])
   );

   // Loop through ingredient list to map id with name
   for (const ingredient of ingredients) {
      let ingredientId = ingredientMap.get(ingredient.name);
      if (!ingredientId) {
         throw new Error(
            'Ingredient "' +
               ingredient.name +
               '" not found. Please ensure that all ingredients are present in the database before creating new recipe. <a href="/ingredientManagement">View ingredient database.</a>'
         );
      }
      ingredient.ingredient = ingredientId;
   }

   try {
      console.log('Looking for recipe with matching id...');
      const recipe = await Recipe.findById(recipeId);
      if (!recipe) {
         throw new Error('Failed to update item: Recipe not found.');
      }
      console.log('Recipe found, checking if updated name exists...');

      // Check if name already exists for another recipe
      const existingRecipe = await Recipe.findOne({ name });
      if (existingRecipe && existingRecipe._id.toString() !== recipeId) {
         throw new Error(
            `Failed to update item: Recipe with name '${name}' already exists`
         );
      }

      // Check if there are changes in the image
      let updatedImage = recipe.image;
      if (req.file) {
         // If a new file is uploaded, update the image
         if (recipe.image) {
            // If the recipe already has an image, delete the old one
            await deleteImageFile(recipe.image);
         }
         updatedImage = req.file.filename;
      }

      // Update the recipe
      const resultRecipe = await Recipe.findByIdAndUpdate(
         recipeId,
         {
            name: name,
            description: description,
            ingredients: ingredients,
            cuisine: cuisine,
            image: updatedImage, // Use the updated image filename
            time: time,
            url: url,
         },
         { new: true }
      );

      console.log('Recipe updated:', resultRecipe);
      res.redirect('/recipes?success=Recipe+updated+successfully');
   } catch (error) {
      console.error('Error updating recipe:', error);
      res.redirect(
         '/recipes?error=true&message=' +
            encodeURIComponent(error.message)
      );
   }
};



exports.deleteRecipe = async (req, res) => {
   const recipeId = req.params.id;
   try {
      const recipe = await Recipe.findById(recipeId);
      if (!recipe) {
         throw new Error('Failed to delete item: Recipe not found');
      }

      // Delete the image file
      if (recipe.image) {
         await deleteImageFile(recipe.image);
      }

      await Recipe.deleteOne({ _id: recipeId });
      res.redirect('/recipes?success=Recipe+deleted+successfully');
   } catch (error) {
      res.redirect(
         '/recipes?error=true&message=' +
            encodeURIComponent(error.message)
      );
   }
};
