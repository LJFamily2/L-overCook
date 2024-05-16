const mongoose = require('../../middlewares/database');
const Ingredient = require('../../models/Ingredient');
const Recipe = require('../../models/Recipe');
const Category = require('../../models/Category');
const categoryController = require('./categoryController');
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

// Get all ingredients
exports.getAllIngredients = async (req, res) => {
   try {
      const ingredients = await Ingredient.find()
         .populate({
            path: 'category',
         })
         .exec();
      return ingredients;
   } catch (error) {
      throw new Error(error.message);
   }
};

// get all ingredients group with the category
exports.getIngredientsForAllCategories = async (req, res) => {
   try {
      // Fetch all ingredients with their corresponding category populated
      const ingredientsWithCategory = await Ingredient.find().populate('category');

      // Group ingredients by category
      const categoriesWithIngredients = {};
      ingredientsWithCategory.forEach((ingredient) => {
         const categoryName = ingredient.category.name;
         const categoryImage = ingredient.category.image; // Include category image
         if (!categoriesWithIngredients[categoryName]) {
            categoriesWithIngredients[categoryName] = {
               image: categoryImage, // Include category image
               ingredients: [] // Initialize ingredients array
            };
         }
         categoriesWithIngredients[categoryName].ingredients.push(ingredient.name);
      });

      return categoriesWithIngredients;
   } catch (error) {
      console.error('Error fetching categories with ingredients:', error);
   }
};


// Get ingredient page
exports.getIngredientPage = async (req, res) => {
   try {
      const rowsPerPage = parseInt(req.query.rows) || 20;
      const page = parseInt(req.query.page) || 1;
      const limit = rowsPerPage;
      const skip = (page - 1) * limit;
      const ingredients = await Ingredient.find()
         .skip(skip)
         .limit(limit)
         .populate({
            path: 'category',
         })
         .exec();
      const totalIngredient = await Ingredient.countDocuments();
      res.render('admin/ingredientManagementPage', {
         ingredients,
         layout: './layouts/admin/defaultLayout',
         currentPage: 'ingredient-management',
         heading: 'Ingredient Management',
         totalPages: Math.ceil(totalIngredient / limit),
         currentPageNumber: page,
         rowsPerPage: rowsPerPage,
         searchPage: false,
         pageName: 'ingredients',
         
      });
   } catch (error) {
      throw new Error(error.message);
   }
};


// search ingredients
exports.searchIngredient = async (req, res) => {
   try {
      const searchTerm = req.query.searchTerm;
      const rowsPerPage = parseInt(req.query.rows) || 5;
      const page = parseInt(req.query.page) || 1;
      const limit = rowsPerPage;
      const skip = (page - 1) * limit;

      const ingredientQuery = Ingredient.find({
         name: { $regex: searchTerm, $options: 'i' },
      });

      const totalIngredients = await Ingredient.countDocuments({
         name: { $regex: searchTerm, $options: 'i' },
      });

      const ingredients = await ingredientQuery
         .skip(skip)
         .limit(limit)
         .populate({
            path: 'category',
         })
         .exec();

      res.render('admin/searchManagementPage', {
         ingredients,
         layout: './layouts/admin/defaultLayout',
         currentPage: 'ingredient-management',
         heading: 'Ingredient Management',
         totalPages: Math.ceil(totalIngredients / limit),
         currentPageNumber: page,
         rowsPerPage,
         message: req.flash(),
         searchPage: true,
         searchTerm,
         pageName: 'ingredients',

      });
   } catch (error) {
      console.log(error);
   }
};

// Search for ingredients limit by 4

// Helper function to create ingredient without returning status
exports.createIngredientLogic = async (name, categoryName, image) => {
   try {
      // Check if ingredient exist
      const existingIngredient = await Ingredient.findOne({ name });
      if (existingIngredient) {
         throw new Error(
            `Failed to create item: Ingredient with name '${name}' already exists`
         );
      }
      console.log(existingIngredient);

      // Check if category exists
      let categoryId;
      const categoryMap = new Map(
         (await Category.find()).map((cat) => [cat.name, cat._id])
      );
      if (categoryMap.has(categoryName)) {
         // If the category exists, retrieve its ID from the map
         categoryId = categoryMap.get(categoryName);
      } else {
         // If the category doesn't exist, create a new one
         const newCategory = await categoryController.createCategoryLogic(
            categoryName,
            image
         );
         categoryId = newCategory._id;
      }

      // Create a new ingredient object with name and category
      const ingredient = new Ingredient({
         name,
         category: categoryId,
      });

      // Save the new ingredient to the database
      const newIngredient = await ingredient.save();
      return newIngredient;
   } catch (error) {
      throw new Error(error.message);
   }
};

// Create new ingredient by calling the helper function and return status
exports.createIngredient = async (req, res) => {
   const { name, categoryName } = req.body;
   try {
      const image = req.file ? req.file.filename : null;
      console.log(image);
      const newIngredient = await this.createIngredientLogic(
         name,
         categoryName,
         image
      );
      if (newIngredient) {
         res.redirect('/ingredients?success=Ingredient+added+successfully');
      }
   } catch (error) {
      res.redirect(
         '/ingredients?error=true&message=' + encodeURIComponent(error.message)
      );
   }
};

// Delete existing ingredient
exports.deleteIngredient = async (req, res) => {
   const ingredientId = req.params.id;
   try {
      // Check if ingredient exists
      const ingredient = await Ingredient.findById(ingredientId);
      if (!ingredient) {
         throw new Error('Failed to delete item: Ingredient not found');
      }

      // Delete the ingredient in  the recipe's ingredient array
      await Recipe.updateMany(
         { 'ingredients.ingredient': ingredientId },
         { $pull: { ingredients: { ingredient: ingredientId } } }
      );

      // Delete ingredient
      await Ingredient.deleteOne({ _id: ingredientId });
      res.redirect('/ingredients?success=Ingredient+deleted+successfully');
   } catch (error) {
      res.redirect(
         '/ingredients?error=true&message=' + encodeURIComponent(error.message)
      );
   }
};

//Update ingredient
// exports.updateIngredient = async (req, res) => {
//     const ingredientId = req.params.id;
//     const { name, categoryName } = req.body;
//     try{
//         // Check if id existed
//         const ingredient = await Ingredient.findById(ingredientId);
//         if(!ingredient){
//             throw new Error('Failed to update item: Ingredient not found.')
//         }

//         // Check if name already exists for another ingredient
//         const existingIngredient = await Ingredient.findOne({ name });
//         if (existingIngredient && existingIngredient._id.toString() !== ingredientId) {
//             throw new Error(`Failed to update item: Ingredient with name '${name}' already exists`);
//         }

//         // Check if category existed
//         let categoryId;
//         const categoryMap = new Map((await Category.find()).map(cat => [cat.name, cat._id]));
//         if (categoryMap.has(categoryName)) {
//             // If the category exists, retrieve its ID from the map
//             categoryId = categoryMap.get(categoryName);
//         } else {
//             // If the category doesn't exist, create a new one
//             const newCategory = await categoryController.createCategoryLogic(categoryName);
//             categoryId = newCategory._id;
//         }
//         console.log(req.file.filename)
//         // Update image
//         if (req.file) {
//             if (ingredient.categoryImage) {
//                 await deleteImageFile(ingredient.categoryImage);
//             }
//             ingredient.categoryImage = req.file.filename;
//         }

//         // Update the ingredient
//         const resultIngredient = await Ingredient.findByIdAndUpdate(ingredientId, { name: name, category: categoryId, categoryImage: ingredient.categoryImage}, { new: true });
//         res.redirect('/ingredients?success=Ingredient+updated+successfully');

//     }catch(error){
//         res.redirect('/ingredients?error=true&message=' + encodeURIComponent(error.message));
//     }
// }

// Update ingredient
exports.updateIngredient = async (req, res) => {
   const ingredientId = req.params.id;
   const { name, categoryName } = req.body;
   try {
      // Check if id existed
      const ingredient = await Ingredient.findById(ingredientId);
      if (!ingredient) {
         throw new Error('Failed to update item: Ingredient not found.');
      }

      // Check if name already exists for another ingredient
      const existingIngredient = await Ingredient.findOne({ name });
      if (
         existingIngredient &&
         existingIngredient._id.toString() !== ingredientId
      ) {
         throw new Error(
            `Failed to update item: Ingredient with name '${name}' already exists`
         );
      }

      // Check if category existed
      let categoryId;
      const categoryMap = new Map(
         (await Category.find()).map((cat) => [cat.name, cat._id])
      );
      if (categoryMap.has(categoryName)) {
         // If the category exists, retrieve its ID from the map
         categoryId = categoryMap.get(categoryName);
      } else {
         const image = req.file ? req.file.filename : null;
         // If the category doesn't exist, create a new one
         const newCategory = await categoryController.createCategoryLogic(
            categoryName,
            image
         );
         categoryId = newCategory._id;
      }

      // Check if there are changes in the ingredient's name, category, or image
      const updateFields = {};
      if (name !== ingredient.name) {
         updateFields.name = name;
      }
      if (categoryId.toString() !== ingredient.category.toString()) {
         updateFields.category = categoryId;
      }

      // If a new image is provided, update the category's image
      if (req.file) {
         await categoryController.updateCategoryImage(categoryId, req.file);
      }

      // Update the ingredient if there are changes
      const resultIngredient = await Ingredient.findByIdAndUpdate(
         ingredientId,
         updateFields,
         { new: true }
      );
      res.redirect('/ingredients?success=Ingredient+updated+successfully');
   } catch (error) {
      res.redirect(
         '/ingredients?error=true&message=' + encodeURIComponent(error.message)
      );
   }
};
