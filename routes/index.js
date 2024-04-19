// Page
const home = require('./client/homeRoute');
const signUpRoute = require('./partials/signUpRoute');
const signInRoute = require('./partials/signInRoute');
const profileRoute = require('./partials/profileRoute');
const category = require('./admin/categoryRoute');
const cuisine = require('./admin/cuisineRoute');
const ingredient = require('./admin/ingredientRoute');
const recipe = require('./admin/recipeRoute');
const searchHistory = require('./client/searchHistoryRoute');
const favoriteRecipe = require('./client/favoriteRecipeRoute');
const userManagement = require('./admin/userManagementRoute');
const adminDashboard = require('./admin/dashboardRoute');

const routes = [
    {path: '/', route: home},
    {path: '/signup', route: signUpRoute},
    {path: '/signin', route: signInRoute},
    {path: '/account', route: profileRoute},
    {path: '/category', route: category},
    {path: '/cuisine', route: cuisine},
    {path: '/ingredientManagement', route: ingredient},
    {path: '/recipeManagement', route: recipe},
    {path: '/searchHistory', route: searchHistory},
    {path: '/favoriteRecipe', route: favoriteRecipe},
    {path: '/userManagement', route: userManagement},
    {path: '/dashboard', route: adminDashboard}
];

module.exports = routes;
