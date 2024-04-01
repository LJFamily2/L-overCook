const mongoose = require('../config/database');
const Category = require('../models/Category');
const Ingredient = require('../models/Ingredient');

// Get all categories - Fix status bug
exports.getAllCategories = async() => {
    try{
        const categories = await Category.find();
        return categories;
    }catch(error){
        throw new Error(error.message);
    }
};

// Helper function to create category without returning status
exports.createCategoryLogic = async(name) => {
    try {
        //Check if category existed
        const existingCategory = await Category.findOne({ name });
        
        // If not existed, create new
        if(!existingCategory){
            // Create new category instance
            const category = new Category({
                name,
            });

            // Save the new category
            const newCategory = await category.save();
            console.log("New category added successfully.")
            return newCategory;          
        }else{
            throw new Error('Category already existed.');
        }
       
    } catch (error) {
        throw new Error(error.message);
    }
}

// Create new category by calling the helper function and return status
exports.createCategory = async (req, res) => {
    const { name } = req.body;

    try{
        const newCategory = await this.createCategoryLogic(name);
        if(newCategory){
            res.status(201).json({message: 'Category added successfully', newCategory});
        }
    }catch(error){
        res.status(500).json({error: error.message});
    }
};

// Delete existing category 
exports.deleteCategory = async (req,res) => {
    const categoryId = req.params.id;
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


// Update category
exports.updateCategory = async (req, res) => {
    const categoryId = req.params.id;
    const { name } = req.body;
    try{
        // Check if id existed
        const category = await Category.findById(categoryId);
        if(!category){
            return res.status(404).json({error: 'Category not found'});
        }

        // Check if name existed
        const updatedCategory = await Category.findOne({ name });

        // Throw error if category name already exist
        if(updatedCategory){
            throw new Error(`Category ${name} already exists`);
        }

        await Category.findByIdAndUpdate(categoryId, { name }, { new: true });
        res.status(200).json({ message: `Category updated successfully, changed ${category.name} to ${name}`});
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}


