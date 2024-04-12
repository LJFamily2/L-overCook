const express = require("express");
const router = express.Router();
const signInController = require("../../controllers/signInController");
const passport = require("passport");

// Sigin page for user
router.get("/", signInController.getSignIn);
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
router.get("/admin", signInController.getAdminSignIn);
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
