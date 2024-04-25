const express = require('express');
const router = express.Router();
const cuisineController = require('../../controllers/admin/cuisineController');
const checkAdmin = require('../../middlewares/checkAdmin');
const connectEnsureLogin = require('connect-ensure-login');

router.get('/',connectEnsureLogin.ensureLoggedIn({redirectTo:'/signin/admin'}),checkAdmin, cuisineController.getCuisinePage);
router.post('/new', cuisineController.createCuisine);
router.post('/delete/:id', cuisineController.deleteCuisine);
router.post('/update/:id', cuisineController.updateCuisine);

module.exports = router

