const signUp = require('./partials/signUpRoute');
const signIn = require('./partials/signInRoute')

const routes = [
    {path: '/signup', route: signUp},
    {path: '/signin', route: signIn},
];

module.exports = routes;
