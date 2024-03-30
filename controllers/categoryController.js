const mongoose = require('../config/database');
const Category = require('../models/Category');
const Ingredient = require('../models/Ingredient');


// // Get all categories - testing
// exports.getAllCategories = async (req,res) => {
//     try{
//         const categories = await Category.find();
//         res.status(200).json(categories);
//     }catch(error){
//         res.status(500).json({error: error.message});
//     }
// };

// Get all categories
exports.getAllCategories = async (req,res) => {
    try{
        const categories = await Category.find();
        return categories;
    }catch(error){
        throw new Error(error.message);
    }
};

// Create new category
exports.createCategory = async (req, res) => {
    const { name } = req.body;

    try {
        // Check if category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({error: 'Category already exists' });
        }

        // Create new category instance with a new ObjectId
        const category = new Category({
            _id: new mongoose.Types.ObjectId(), // Generate a new ObjectId for _id
            name,
        });

        // Save the new category
        const newCategory = await category.save();

        res.status(201).json({ category: newCategory, message: 'Category added to database' });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Delete existing category
exports.deleteCategory = async (req,res) => {
    const categoryId = req.params.id;
    console.log(categoryId)
    try{
        // Check if category exists
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        // Update ingredients associated with the deleted category
        await Ingredient.updateMany(
            {category: categoryId},
            { $unset: { category: '' } }
        );
        
        // Delete category
        await Category.deleteOne({ _id: categoryId });
        res.status(200).json({ message: 'Category deleted successfully' });
    }catch(error){
        res.status(500).json({message:error.message});
    }
};

// Update category - Do or no?