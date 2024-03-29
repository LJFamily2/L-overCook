const signUpRoute = require('./partials/signUpRoute');
const signInRoute = require('./partials/signInRoute');
const profileRoute = require('./partials/profileRoute');
const recipeRoute = require('./recipeRoute');

const routes = [
    {path: '/signup', route: signUpRoute},
    {path: '/signin', route: signInRoute},
    {path: '/account', route: profileRoute},
    {path: '/recipes', route: recipeRoute},
];

module.exports = routes;
