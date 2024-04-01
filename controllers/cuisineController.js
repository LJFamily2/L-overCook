const mongoose = require('../config/database');
const Cuisine = require('../models/Cuisine');
const Recipe = require('../models/Recipe');


// Get all cuisines
exports.getAllCuisines = async(req, res) => {
    try{
        const cuisines = await Cuisine.find();
        // res.status(200).json(cuisines);
        return cuisines;
    }catch(error){
        // res.status(500).json({error: error.message});
        throw new Error(error.message);
    }
}


// Create new cuisine
exports.createCuisine = async (req, res) => {
    const { name } = req.body;

    try {
        // Check if category already exists
        const existingCuisine = await Cuisine.findOne({ name });
        if (existingCuisine) {
            return res.status(400).json({error: 'Cuisine already exists' });
        }

        // Create new category instance with a new ObjectId
        const cuisine = new Cuisine({
            name,
        });

        // Save the new category
        const newCuisine = await cuisine.save();

        res.status(201).json({ cuisine: newCuisine, message: 'Cuisine added to database' });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


// Delete existing cuisine
exports.deleteCuisine = async (req,res) => {
    const cuisineId = req.params.id;
    console.log(cuisineId)
    try{
        // Check if category exists
        const cuisine = await Cuisine.findById(cuisineId);
        if (!cuisine) {
            return res.status(404).json({ error: 'Cuisine not found' });
        }
        
        // Update recipes associated with the deleted cuisine
        await Recipe.updateMany(
            {cuisine: cuisineId},
            { $unset: { cuisine: '' } }
        );
        
        // Delete cuisine
        await Cuisine.deleteOne({ _id: cuisineId });
        res.status(200).json({ message: 'Cuisine deleted successfully' });
    }catch(error){
        res.status(500).json({message:error.message});
    }
};

// Update cuisine - Do or no?