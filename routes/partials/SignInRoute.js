const express = require('express');
const router = express.Router();
const SignInController = require('../../controllers/SigInController');
const passport = require("passport");

// Sigin page for user
router.get('/', SignInController.getSignIn);
router.post('/',passport.authenticate("local", {
    failureRedirect: "/signin",
    failureFlash: true,
}),
(req, res) => {
    console.log("User authenticated successfully");
    res.redirect("/");
},);


// Signin page for admin
router.get('/admin', SignInController.getAdminSignIn);
router.post('/admin',passport.authenticate("local", {
    failureRedirect: "/signin",
    failureFlash: true,
}),
(req, res) => {
    console.log("Admin authenticated successfully");
    res.redirect("/admin");
},);

module.exports = router;