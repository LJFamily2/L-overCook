const SignUpRoute = require('./partials/SignUpRoute');
const SignInRoute = require('./partials/SignInRoute');


const routes = [
    {path: '/signup', route: SignUpRoute},
    {path: '/signin', route: SignInRoute},
];

module.exports = routes;
