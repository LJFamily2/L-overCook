// Page
const home = require('./homeRoute');
const signUpRoute = require('./partials/signUpRoute');
const signInRoute = require('./partials/signInRoute');
const profileRoute = require('./partials/profileRoute');
const category = require('./categoryRoute');
const cuisine = require('./cuisineRoute');
const ingredient = require('./ingredientRoute');
const recipe = require('./recipeRoute');
const searchHistory = require('./searchHistoryRoute');
const favoriteRecipe = require('./favoriteRecipeRoute')


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
    {path: '/favoriteRecipe', route: favoriteRecipe}
];

module.exports = routes;
