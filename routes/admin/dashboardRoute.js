const express = require('express');
const router = express.Router();

const checkAdmin = require('../../middlewares/checkAdmin');
const connectEnsureLogin = require('connect-ensure-login');

router.get('/',connectEnsureLogin.ensureLoggedIn({redirectTo:'/signin/admin'}),checkAdmin, (req, res) => {
    res.render('admin/dashboard', {
        layout: 'layouts/admin/defaultLayout',
        currentPage: 'dashboard'
    });    
});

module.exports = router
