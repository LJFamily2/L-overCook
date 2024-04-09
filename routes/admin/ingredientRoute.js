const express = require('express');
const router = express.Router();
const ingredientController = require('../../controllers/ingredientController');

//router.get('/', ingredientController.getAllIngredients);
router.post('/new', ingredientController.createIngredient);
router.post('/delete/:id', ingredientController.deleteIngredient);
router.put('/update/:id', ingredientController.updateIngredient);

module.exports = router

