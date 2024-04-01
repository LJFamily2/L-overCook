const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

//router.get('/', categoryController.getAllCategories);
router.post('/new', categoryController.createCategory);
router.post('/delete/:id', categoryController.deleteCategory);
router.put('/update/:id', categoryController.updateCategory);

module.exports = router

