const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/client/profileController');

router.get('/profile', profileController.getProfilePage);
router.get('/profile/resetPassword', profileController.getEmailPage);
router.post('/profile/resetPassword', profileController.sendOtp);

router.get('/profile/resetPassword/verifyOTP', profileController.verifyOtpPage);
router.post('/profile/resetPassword/verifyOTP', profileController.verifyOtp);

module.exports = router;
