const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.getAllCategories);
router.post('/new', categoryController.createCategory);
// router.delete('/delete/:id', categoryController.deleteCategory);

module.exports = router

