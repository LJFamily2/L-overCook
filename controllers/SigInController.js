const User = require("../models/User");
const passport = require("passport");

const SignInController = {
    // Signin page for user
    getSignIn: (req, res) => {
        res.render("signin", { layout: null });
        console.log("Signin page for user");
    },

    postSignIn: [
        passport.authenticate("local", {
            failureRedirect: "/signin",
            failureFlash: true,
        }),
        (req, res) => {
            console.log("User authenticated successfully");
            res.redirect("/");
        },
    ],

    // Signin page for admin
    getAdminSignIn: (req, res) => {
        res.render("admin/signin", { layout: null });
        console.log("Signin page for admin");
    },

    postAdminSignIn: [
        passport.authenticate("local", {
            failureRedirect: "/signin",
            failureFlash: true,
        }),
        (req, res) => {
            console.log("Admin authenticated successfully");
            res.redirect("/admin");
        },
    ],
};

module.exports = SignInController;