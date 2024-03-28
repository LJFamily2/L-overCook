const signUp = require('./partials/signUpRoute');
const signIn = require('./partials/signInRoute');
const recipeRoute = require('./recipeRoute');

const routes = [
    {path: '/signup', route: signUp},
    {path: '/signin', route: signIn},
    {path: '/recipes', route: recipeRoute},
];

module.exports = routes;
