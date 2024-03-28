const express = require('express');
const router = express.Router();
const SignUpController = require("../../controllers/signUpController");

// Sigup page for user
router.get('/', SignUpController.getSignUp);
router.post('/addUser', SignUpController.postSignUp);


// Signup page for admin
router.get('/admin',SignUpController.getAdminSignUp);
router.post('/addAdmin',SignUpController.postAdminSignUp);

module.exports = router;