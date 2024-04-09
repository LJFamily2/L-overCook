const express = require('express');
const router = express.Router();
const recipeController = require('../../controllers/recipeController');
const reviewController = require('../../controllers/reviewController');

// Recipe Routes
router.get('/', recipeController.getRecipePage);
router.get('/new', recipeController.getCreateRecipePage);
// router.get('/:name', recipeController.getRecipeByName); 
// router.put('/:id', recipeController.updateRecipe); 
// router.delete('/:id', recipeController.deleteRecipe); 

// Add review 
router.post("/:slug/addReview", reviewController.addReview);
router.post("/:slug/delete", reviewController.removeReview);

module.exports = router;
