const express = require("express");
const router = express.Router();
const signInController = require("../../controllers/signInController");
const passport = require("passport");

// Sigin page for user
router.get("/", signInController.getSignIn);
router.post(
  "/userAuth",
  passport.authenticate("local", {
    successReturnToOrRedirect:'/',
    failureRedirect: "/signin",
    failureFlash: true,
  })
);

// Signin page for admin
router.get("/admin", signInController.getAdminSignIn);
router.post(
  "/adminAuth",
  passport.authenticate("local", {
    successReturnToOrRedirect:'/dashboard',
    failureRedirect: "/signin/admin",
    failureFlash: true,
  })
);

module.exports = router;
