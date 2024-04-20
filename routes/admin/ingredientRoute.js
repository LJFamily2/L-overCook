const express = require('express');
const router = express.Router();
const ingredientController = require('../../controllers/admin/ingredientController');

router.get('/', ingredientController.getIngredientPage);
router.post('/new', ingredientController.createIngredient);
router.post('/delete/:id', ingredientController.deleteIngredient);
router.post('/update/:id', ingredientController.updateIngredient);

module.exports = router

