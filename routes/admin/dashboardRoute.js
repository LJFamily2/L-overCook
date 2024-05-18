const express = require('express');
const router = express.Router();
const Ingredient = require('../../models/Ingredient');
const Recipe = require('../../models/Recipe');
const Cuisine = require('../../models/Cuisine');
const User = require("../../models/User");

const checkAdmin = require('../../middlewares/checkAdmin');
const connectEnsureLogin = require('connect-ensure-login');

router.get('/',connectEnsureLogin.ensureLoggedIn({redirectTo:'/signin/admin'}),checkAdmin, async (req, res) => {
    const users = (await User.find({})).length;
    const recipes = (await Recipe.find({})).length;
    const ingredients = (await Ingredient.find({})).length;
    const cuisines = (await Cuisine.find({})).length;
    res.render('admin/dashboard', {
        layout: 'layouts/admin/defaultLayout',
        currentPage: 'dashboard',
        user: req.user,
        users,
        recipes,
        ingredients,
        cuisines
    });
});

module.exports = router;