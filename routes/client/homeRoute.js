const express = require('express');
const router = express.Router();
const homeController = require('../../controllers/client/homeController');

router.get('/', homeController.getHomePage);
router.get('/allRecipes', homeController.getAllRecipes);

router.get('/search', homeController.getSearchPage);

module.exports = router;