const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/client/profileController');

router.get('/profile', profileController.getProfilePage);
router.get('/profile/resetPassword', profileController.getEmailPage);
router.post('/profile/resetPassword', profileController.sendOtp);

router.get('/profile/resetPassword/verifyOTP', profileController.verifyOtpPage);
router.post('/profile/resetPassword/verifyOTP', profileController.verifyOtp);

// layout only
// update password
router.get('/profile/updatePassword', (req, res) => {
    res.render('client/updatePassword', {
        layout: 'layouts/client/defaultLayout',
        userAuthentication: true
    })
});

// edit profile
router.get('/profile/editProfile', (req, res) => {
    res.render('client/editProfile', {
        layout: 'layouts/client/defaultLayout',
        userAuthentication: true
    })
});

module.exports = router;
