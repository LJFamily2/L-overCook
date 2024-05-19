const express = require("express");
const router = express.Router();
const signUpController = require("../../controllers/SignUpController");

// Sigup page for user
router.get("/", signUpController.getSignUp);
router.post("/addUser", signUpController.postSignUp);

// Signup page for admin
// router.get("/admin", signUpController.getAdminSignUp);
router.post("/addAdmin", signUpController.postAdminSignUp);

module.exports = router;
