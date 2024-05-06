const express = require('express');
const router = express.Router();
const recipeController = require('../../controllers/admin/recipeController');
const reviewController = require('../../controllers//client/reviewController');
const checkAdmin = require('../../middlewares/checkAdmin');
const connectEnsureLogin = require('connect-ensure-login');
const upload = require('../../middlewares/UploadMedia');

// Recipe Routes
router.get('/',connectEnsureLogin.ensureLoggedIn({redirectTo:'/signin/admin'}),checkAdmin, recipeController.getRecipePage);
// Recipe Update
router.get('/update/:id', recipeController.getUpdateRecipePage);
// Recipe detail page
router.get('/:slug', recipeController.getRecipeDetailPage);
router.post('/new',upload.single('image'),recipeController.createRecipe);
router.post('/update/:id',upload.single('newImage'), recipeController.updateRecipe); 
router.post('/delete/:id', recipeController.deleteRecipe); 


// Add review 
router.post("/:slug/add-review", reviewController.addReview);
router.post("/:slug/delete", reviewController.removeReview);

module.exports = router;
