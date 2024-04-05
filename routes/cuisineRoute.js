const express = require('express');
const router = express.Router();
const cuisineController = require('../controllers/cuisineController');

// router.get('/', cuisineController.getAllCuisines);
router.post('/new', cuisineController.createCuisine);
router.post('/delete/:id', cuisineController.deleteCuisine);
router.put('/update/:id', cuisineController.updateCuisine);

module.exports = router

