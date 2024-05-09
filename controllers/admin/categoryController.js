const mongoose = require('../../middlewares/database');
const Category = require('../../models/Category');
const Ingredient = require('../../models/Ingredient');
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

// Get all categories - Fix status bug
exports.getAllCategories = async () => {
   try {
      const categories = await Category.find();
      return categories;
   } catch (error) {
      throw new Error(error.message);
   }
};

// Helper function to create category without returning status
exports.createCategoryLogic = async (name, image) => {
   try {
      //Check if category existed
      const existingCategory = await Category.findOne({ name });
      console.log('Image:', image);
      // If not existed, create new
      if (!existingCategory) {
         // Create new category instance
         const category = await new Category({
            name,
            image: `/uploadImages/${image}`
         });

         // Save the new category
         const newCategory = await category.save();
         console.log('New category added successfully.');
         return newCategory;
      } else {
         throw new Error('Category already existed.');
      }
   } catch (error) {
      throw new Error(error.message);
   }
};

// Create new category by calling the helper function and return status
// ????? Cái này thấy không dùng luôn nè, phải không ?
exports.createCategory = async (req, res) => {
   const { name } = req.body;

   try {
      const newCategory = await this.createCategoryLogic(name);
      if (newCategory) {
         res.status(201).json({
            message: 'Category added successfully',
            newCategory,
         });
      }
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
};

// Delete existing category
exports.deleteCategory = async (req, res) => {
   const categoryId = req.params.id;
   try {
      // Check if category exists
      const category = await Category.findById(categoryId);
      if (!category) {
         return res.status(404).json({ error: 'Category not found' });
      }

      // Update ingredients associated with the deleted category
      await Ingredient.updateMany(
         { category: categoryId },
         { $unset: { category: '' } }
      );

      // Delete category
      await Category.deleteOne({ _id: categoryId });
      res.status(200).json({ message: 'Category deleted successfully' });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// Update category
// exports.updateCategory = async (req, res) => {
//     const categoryId = req.params.id;
//     const { name } = req.body;
//     try{
//         // Check if id existed
//         const category = await Category.findById(categoryId);
//         if(!category){
//             return res.status(404).json({error: 'Category not found'});
//         }

//         // Check if name existed
//         const updatedCategory = await Category.findOne({ name });

//         // Throw error if category name already exist
//         if(updatedCategory){
//             throw new Error(`Category ${name} already exists`);
//         }

//         await Category.findByIdAndUpdate(categoryId, { name }, { new: true });
//         res.status(200).json({ message: `Category updated successfully, changed ${category.name} to ${name}`});
//     }catch(error){
//         res.status(500).json({ error: error.message });
//     }
// }
// exports.updateCategory = async (req, res) => {
//     const categoryId = req.params.id;
//     const { name } = req.body;
//     const { image } = req.file;

//     try {
//         // Check if the category exists
//         const category = await Category.findById(categoryId);
//         if (!category) {
//             return res.status(404).json({ error: 'Category not found' });
//         }

//         // Check if a new image is provided
//         if (image) {
//             // Delete the old image file if it exists
//             if (category.image) {
//                 await fs.unlink(path.join('public/uploadImages', category.image));
//             }

//             // Save the new image file to the server
//             const imagePath = 'public/uploadImages/' + image.filename; // Adjust the path as per your setup

//             // Update the category with the new image path
//             await Category.findByIdAndUpdate(categoryId, { name, image: imagePath }, { new: true });
//         } else {
//             // Update the category without changing the image
//             await Category.findByIdAndUpdate(categoryId, { name }, { new: true });
//         }

//         return res.status(200).json({ message: `Category updated successfully, changed ${category.name} to ${name}`});
//     } catch(error) {
//         return res.status(500).json({ error: error.message });
//     }
// }
exports.updateCategoryImage = async (categoryId, image) => {
   try {
      // Check if the category exists
      const category = await Category.findById(categoryId);
      if (!category) {
         throw new Error('Category not found');
      }

      // Delete the old image file if it exists
      if (category.image) {
         await deleteImageFile(category.image);
      }
      const newImage = `/uploadImages/${image.filename}`;

      // Update the category with the new image path
      await Category.findByIdAndUpdate(
         categoryId,
         { image: newImage },
         { new: true }
      );

      console.log('Category image updated successfully');
   } catch (error) {
      throw new Error(error.message);
   }
};
