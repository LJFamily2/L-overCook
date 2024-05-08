const express = require('express');
const router = express.Router();
const ingredientController = require('../../controllers/admin/ingredientController');
const checkAdmin = require('../../middlewares/checkAdmin');
const connectEnsureLogin = require('connect-ensure-login');
const upload = require('../../middlewares/UploadMedia');


router.get('/search',connectEnsureLogin.ensureLoggedIn({redirectTo:'/signin/admin'}),checkAdmin, ingredientController.searchIngredient )
router.get('/',connectEnsureLogin.ensureLoggedIn({redirectTo:'/signin/admin'}),checkAdmin, ingredientController.getIngredientPage);
router.post('/new',upload.single('image') , ingredientController.createIngredient);
router.post('/delete/:id', ingredientController.deleteIngredient);
router.post('/update/:id', upload.single('newImage'),  ingredientController.updateIngredient);
module.exports = router

