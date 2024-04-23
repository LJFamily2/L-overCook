const express = require('express');
const router = express.Router();
const recipeController = require('../../controllers/admin/recipeController');
const reviewController = require('../../controllers//client/reviewController');

// Recipe Routes
router.get('/', recipeController.getRecipePage);
// Recipe detail page
router.get('/:slug', recipeController.getRecipeDetailPage);
// router.get('/:id', recipeController.getRecipeData);
router.post('/new', recipeController.createRecipe);
router.post('/update/:id', recipeController.updateRecipe); 
router.post('/delete/:id', recipeController.deleteRecipe); 

// Add review 
router.post("/:slug/addReview", reviewController.addReview);
router.post("/:slug/delete", reviewController.removeReview);

module.exports = router;
