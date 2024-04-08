// Page
const home = require('./homeRoute');
const signUpRoute = require('./partials/signUpRoute');
const signInRoute = require('./partials/signInRoute');
const profileRoute = require('./partials/profileRoute');
const category = require('./categoryRoute');
const cuisine = require('./cuisineRoute');
const ingredient = require('./ingredientRoute');
const recipe = require('./recipeRoute');
const searchHistory = require('./clients/searchHistoryRoute');
const favoriteRecipe = require('./clients/favoriteRecipeRoute');
const userManagement = require('./admin/userManagementRoute');

const routes = [
    {path: '/', route: home},
    {path: '/signup', route: signUpRoute},
    {path: '/signin', route: signInRoute},
    {path: '/account', route: profileRoute},
    {path: '/category', route: category},
    {path: '/cuisine', route: cuisine},
    {path: '/ingredient', route: ingredient},
    {path: '/recipe', route: recipe},
    {path: '/searchHistory', route: searchHistory},
    {path: '/favoriteRecipe', route: favoriteRecipe},
    {path: '/userManagement', route: userManagement}
];

module.exports = routes;
