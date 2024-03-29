const express = require('express');
const router = express.Router();
const cuisineController = require('../controllers/cuisineController');

router.get('/', cuisineController.getAllCuisines);
router.post('/new', cuisineController.createCuisine);
router.delete('/delete/:id', cuisineController.deleteCuisine);

module.exports = router

