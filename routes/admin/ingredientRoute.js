const express = require('express');
const router = express.Router();
const ingredientController = require('../../controllers/admin/ingredientController');
const checkAdmin = require('../../middlewares/checkAdmin');
const connectEnsureLogin = require('connect-ensure-login');

router.get('/',connectEnsureLogin.ensureLoggedIn({redirectTo:'/signin/admin'}),checkAdmin, ingredientController.getIngredientPage);
router.post('/new', ingredientController.createIngredient);
router.post('/delete/:id', ingredientController.deleteIngredient);
router.post('/update/:id', ingredientController.updateIngredient);

module.exports = router

