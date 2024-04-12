const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/client/profileController');

router.get('/resetPassword', profileController.getEmailPage);
router.post('/resetPassword', profileController.sendOtp);
router.post('/resetPassword/verifyOTP', profileController.verifyOtp);

module.exports = router;
