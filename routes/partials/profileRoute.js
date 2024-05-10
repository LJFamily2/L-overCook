const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/client/profileController');
const checkVerifyOTP = require('../../middlewares/CheckVerifyOTP');
const connectEnsureLogin = require('connect-ensure-login');


router.get('/profile',connectEnsureLogin.ensureLoggedIn({redirectTo:'/signin'}), profileController.getProfilePage);
router.get('/profile/resetPassword', profileController.getEmailPage);
router.post('/profile/resetPassword', profileController.sendOtp);

router.get('/profile/resetPassword/verifyOTP', profileController.verifyOtpPage);
router.post('/profile/resetPassword/verifyOTP', profileController.handleOtpRequest);

// layout only
// update password
router.get('/profile/updatePassword', checkVerifyOTP, (req, res) => {
    res.render('client/updatePassword', {
        layout: 'layouts/client/defaultLayout',
        userAuthentication: false,
        user:req.user
    })
});
router.post('/profile/updatePassword', profileController.updateUserPassword);

// edit profile
router.get('/profile/editProfile',connectEnsureLogin.ensureLoggedIn({redirectTo:'/signin'}), (req, res) => {
    res.render('client/editProfile', {
        layout: 'layouts/client/defaultLayout',
        userAuthentication: false,
        user:req.user

    })
});

module.exports = router;
