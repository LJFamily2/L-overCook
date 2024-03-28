const express = require("express");
const router = express.Router();
const SignInController = require("../../controllers/SigInController");
const passport = require("passport");

// Sigin page for user
router.get("/", SignInController.getSignIn);
router.post(
  "/userAuth",
  passport.authenticate("local", {
    failureRedirect: "/signin",
    failureFlash: true,
  }),
  (req, res) => {
    res.send("User authenticated successfully");
  }
);

// Signin page for admin
router.get("/admin", SignInController.getAdminSignIn);
router.post(
  "/adminAuth",
  passport.authenticate("local", {
    failureRedirect: "/signin/admin",
    failureFlash: true,
  }),
  (req, res) => {
    res.send("Admin authenticated successfully");
  }
);

module.exports = router;
