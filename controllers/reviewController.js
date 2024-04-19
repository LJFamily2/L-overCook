const Recipe = require('../models/Recipe');

const reviewController = {
    addReview: async (req, res) => {
        try {
            const { slug } = req.params;
            const { user, rating, review } = req.body;
            
            // Find the recipe by slug
            const recipe = await Recipe.findOne({ slug });
            if (!recipe) {
                return res.status(404).send('Recipe not found');
            }
            
            // Add the review to the recipe
            recipe.reviews.push({ user, rating, review });
            await recipe.save();
            
            res.send('Review added successfully');
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    },

    removeReview: async (req, res) => {
        try {
            const { slug, reviewId } = req.params;
    
            // Find the recipe by slug
            const recipe = await Recipe.findOne({ slug });
            if (!recipe) {
                return res.status(404).send('Recipe not found');
            }
    
            // Find the index of the review to remove
            const index = recipe.reviews.findIndex(review => review._id === reviewId);
            if (index === -1) {
                return res.status(404).send('Review not found');
            }
    
            // Remove the review from the array
            recipe.reviews.splice(index, 1);
            await recipe.save();
    
            res.send('Review removed successfully');
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = reviewController;