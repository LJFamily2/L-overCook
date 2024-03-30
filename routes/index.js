const signUpRoute = require('./partials/signUpRoute');
const signInRoute = require('./partials/signInRoute');
const profileRoute = require('./partials/profileRoute');
const category = require('./categoryRoute');
const cuisine = require('./cuisineRoute');
const ingredient = require('./ingredientRoute');
const recipe = require('./recipeRoute');

const routes = [
    {path: '/signup', route: signUpRoute},
    {path: '/signin', route: signInRoute},
    {path: '/account', route: profileRoute},
    {path: '/category', route: category},
    {path: '/cuisine', route: cuisine},
    {path: '/ingredient', route: ingredient},
    {path: '/recipe', route: recipe},
];

module.exports = routes;
