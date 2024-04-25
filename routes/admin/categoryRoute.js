const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/admin/categoryController');
const checkAdmin = require('../../middlewares/checkAdmin');
const connectEnsureLogin = require('connect-ensure-login');

//router.get('/', categoryController.getAllCategories);
router.post('/new',connectEnsureLogin.ensureLoggedIn({redirectTo:'/signin/admin'}),checkAdmin, categoryController.createCategory);
router.post('/delete/:id', categoryController.deleteCategory);
router.put('/update/:id', categoryController.updateCategory);

module.exports = router

