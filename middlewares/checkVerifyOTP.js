const checkVerifyOTP = async (req, res, next) => {
   if (req.user.otpVerify === true) {
      next();
   } else {
      req.flash('error', 'Please verify OTP first');
      return res.redirect('/account/profile/resetPassword');
   }
};

module.exports = checkVerifyOTP;
