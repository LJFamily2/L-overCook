const mongoose = require('../config/database');
const Category = require('../models/Category');
const Ingredient = require('../models/Ingredient');


// Get all categories
exports.getAllCategories = async (req,res) => {
    try{
        const categories = await Category.find();
        res.status(200).json(categories);
        return categories;
    }catch(error){
        res.status(500).json({error: error.message});
        throw new Error(error.message);
    }
};

// Helper function to check if category exist
exports.existingCategory = async(name) => {
    const existingCategory = await Category.findOne({ name });
    if(existingCategory){
        return existingCategory;
    }
    return false;
}

// Helper function to create category without returning status
exports.createCategoryLogic = async(name) => {
    try {
        // Create new category instance with a new ObjectId
        const category = new Category({
            name,
        });

        // Save the new category
        const newCategory = await category.save();
        console.log("New category added successfully.")
        return newCategory;          
    } catch (error) {
        throw new Error(error.message);
    }
}

// Create new category by calling the helper function and return status
exports.createCategory = async (req, res) => {
    const { name } = req.body;

    try{
        const existingCategory = await this.existingCategory(name);
        if(!existingCategory){
            const newCategory = await this.createCategoryLogic(name);
            res.status(201).json(newCategory);
        }else{
            return res.status(400).json({error: 'Category already existed.'});
        }
        
    }catch(error){
        res.status(500).json({error: error.message});
    }
};

// // Delete existing category 
// exports.deleteCategory = async (req,res) => {
//     const categoryId = req.params.id;
//     console.log(categoryId)
//     try{
//         // Check if category exists
//         const category = await Category.findById(categoryId);
//         if (!category) {
//             return res.status(404).json({ error: 'Category not found' });
//         }
        
//         // Update ingredients associated with the deleted category
//         await Ingredient.updateMany(
//             {category: categoryId},
//             { $unset: { category: '' } }
//         );
        
//         // Delete category
//         await Category.deleteOne({ _id: categoryId });
//         res.status(200).json({ message: 'Category deleted successfully' });
//     }catch(error){
//         res.status(500).json({message:error.message});
//     }
// };

// Update category - Do or no?
