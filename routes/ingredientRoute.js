const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredientController');

router.get('/', ingredientController.getAllIngredients);
router.post('/new', ingredientController.createIngredient);
router.delete('/delete/:id', ingredientController.deleteIngredient);

module.exports = router

