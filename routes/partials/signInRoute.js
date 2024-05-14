const express = require("express");
const router = express.Router();
const signInController = require("../../controllers/signInController");
const passport = require("passport");
const connectEnsureLogin = require('connect-ensure-login');

// Sigin page for user
router.get("/", connectEnsureLogin.ensureLoggedOut({redirectTo:'/account/profile'}), signInController.getSignIn);
router.post(
  "/userAuth",
  passport.authenticate("local", {
    successReturnToOrRedirect:'/',
    failureRedirect: "/signin",
    failureFlash: true,
  })
);

// Signin page for admin
router.get("/admin", connectEnsureLogin.ensureLoggedOut({redirectTo:'/dashboard'}), signInController.getAdminSignIn);
router.post(
  "/adminAuth",
  passport.authenticate("local", {
    successReturnToOrRedirect:'/dashboard',
    failureRedirect: "/signin/admin",
    failureFlash: true,
  })
);

module.exports = router;
