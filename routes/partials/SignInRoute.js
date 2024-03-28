const express = require('express');
const router = express.Router();
const SignInController = require('../../controllers/SigInController');

// Sigin page for user
router.get('/', SignInController.getSignIn);
router.post('/',SignInController.postSignIn);


// Signin page for admin
router.get('/admin', SignInController.getAdminSignIn);
router.post('/admin',SignInController.postAdminSignIn);

module.exports = router;