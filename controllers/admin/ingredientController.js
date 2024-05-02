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
exports.getAllIngredients = async (req,res) => {
   try{
      const ingredients = await Ingredient.find()
      .populate({
          path: 'category',
         select: 'name -_id'
      })
      .exec();
      return ingredients;
   }catch(error){
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
        ingredientsWithCategory.forEach(ingredient => {
            const categoryName = ingredient.category.name; 
            if (!categoriesWithIngredients[categoryName]) {
                categoriesWithIngredients[categoryName] = [];
            }
            categoriesWithIngredients[categoryName].push(ingredient.name);
        });

        return categoriesWithIngredients;
    } catch (error) {
        console.error('Error fetching categories with ingredients:', error);
    }
};

// Get ingredient page
exports.getIngredientPage = async (req, res) => {
   try {
      const ingredients = await this.getAllIngredients();
      res.render('admin/ingredientManagementPage', {
         ingredients,
         layout: './layouts/admin/defaultLayout',
         currentPage: 'ingredientManagementPage',
         heading: 'Ingredient Management'
      });
   } catch (error) {
      throw new Error(error.message);
   }
};

// Search for ingredients limit by 4


// Helper function to create ingredient without returning status
exports.createIngredientLogic = async(name, categoryName, image) => {
   try {
       // Check if ingredient exist
       const existingIngredient = await Ingredient.findOne({ name });
       if(existingIngredient){
           throw new Error(`Failed to create item: Ingredient with name '${name}' already exists`);
       }
       console.log(existingIngredient)
       
       // Check if category exists
       let categoryId;
       const categoryMap = new Map((await Category.find()).map(cat => [cat.name, cat._id]));
       if (categoryMap.has(categoryName)) {
           // If the category exists, retrieve its ID from the map
           categoryId = categoryMap.get(categoryName);
       } else {
           // If the category doesn't exist, create a new one
           const newCategory = await categoryController.createCategoryLogic(categoryName);
           categoryId = newCategory._id;
       }

       // Create a new ingredient object with name and category
       const ingredient = new Ingredient({
           name,
           category: categoryId,
           categoryImage: image
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
   try{
       const image = req.file ? req.file.filename : null;
       console.log(image)
       const newIngredient = await this.createIngredientLogic(name, categoryName, image);
       if(newIngredient){
           res.redirect('/ingredientManagement?success=Ingredient+added+successfully');
       }
   }catch(error){
       res.redirect('/ingredientManagement?error=true&message=' + encodeURIComponent(error.message));
   }
};

// Delete existing ingredient
exports.deleteIngredient = async (req,res) => {
   const ingredientId = req.params.id;
   try{
       // Check if ingredient exists
       const ingredient = await Ingredient.findById(ingredientId);
       if (!ingredient) {
           throw new Error('Failed to delete item: Ingredient not found')
       }
       
       // Delete the ingredient in  the recipe's ingredient array
       await Recipe.updateMany(
           { "ingredients.ingredient": ingredientId },
           { $pull: { ingredients: { ingredient: ingredientId } } }
       );

       if (ingredient.categoryImage) {
        await deleteImageFile(ingredient.categoryImage);
     }
       
       // Delete ingredient
       await Ingredient.deleteOne({ _id: ingredientId });
       res.redirect('/ingredientManagement?success=Ingredient+deleted+successfully');
       
   }catch(error){
       res.redirect('/ingredientManagement?error=true&message=' + encodeURIComponent(error.message));
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
//         res.redirect('/ingredientManagement?success=Ingredient+updated+successfully');
        
//     }catch(error){
//         res.redirect('/ingredientManagement?error=true&message=' + encodeURIComponent(error.message));        
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
        if (existingIngredient && existingIngredient._id.toString() !== ingredientId) {
            throw new Error(`Failed to update item: Ingredient with name '${name}' already exists`);
        }

        // Check if category existed
        let categoryId;
        const categoryMap = new Map((await Category.find()).map(cat => [cat.name, cat._id]));
        if (categoryMap.has(categoryName)) {
            // If the category exists, retrieve its ID from the map
            categoryId = categoryMap.get(categoryName);
        } else {
            // If the category doesn't exist, create a new one
            const newCategory = await categoryController.createCategoryLogic(categoryName);
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
        if (req.file) {
            if (ingredient.categoryImage) {
                await deleteImageFile(ingredient.categoryImage);
            }
            updateFields.categoryImage = req.file.filename;
        }

        // Update the ingredient if there are changes
        if (Object.keys(updateFields).length > 0) {
            const resultIngredient = await Ingredient.findByIdAndUpdate(ingredientId, updateFields, { new: true });
            res.redirect('/ingredientManagement?success=Ingredient+updated+successfully');
        } else {
            res.redirect('/ingredientManagement?success=No+changes+detected');
        }
    } catch (error) {
        res.redirect('/ingredientManagement?error=true&message=' + encodeURIComponent(error.message));
    }
}



