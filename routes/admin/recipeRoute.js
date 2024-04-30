const express = require('express');
const router = express.Router();
const recipeController = require('../../controllers/admin/recipeController');
const reviewController = require('../../controllers//client/reviewController');
const checkAdmin = require('../../middlewares/checkAdmin');
const connectEnsureLogin = require('connect-ensure-login');

// Recipe Routes
router.get('/',connectEnsureLogin.ensureLoggedIn({redirectTo:'/signin/admin'}),checkAdmin, recipeController.getRecipePage);
// Recipe detail page
router.get('/:slug', recipeController.getRecipeDetailPage);
router.post('/new', recipeController.createRecipe);
router.post('/update/:id', recipeController.updateRecipe); 
router.post('/delete/:id', recipeController.deleteRecipe); 


// Add review 
router.post("/:slug/add-review", reviewController.addReview);
router.post("/:slug/delete", reviewController.removeReview);

module.exports = router;
