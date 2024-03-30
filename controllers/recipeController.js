const mongoose = require('../config/database');
const Recipe = require('../models/Recipe');

// // Get all recipes
// exports.getAllRecipes = async (req, res) => {
//     try {
//         const recipes = await Recipe.find()
//             .populate({
//                 path: 'ingredients.ingredient',
//                 select: 'name -_id'
//             })
//             .populate({
//                 path: 'cuisine',
//                 select: 'name -_id'
//             })
//             .exec();
//         res.status(200).json(recipes);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// Get all recipes
exports.getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find()
            .populate({
                path: 'ingredients.ingredient',
                select: 'name -_id'
            })
            .populate({
                path: 'cuisine',
                select: 'name -_id'
            })
            .exec();
        return recipes;
    } catch (error) {
        throw new Error(error.message);
    }
};
