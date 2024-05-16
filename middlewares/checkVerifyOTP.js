const UserModel = require('../models/User');

const checkVerifyOTP = async (req, res, next) => {
   try {
      if (req.user && req.user.otpVerify === true) {
         next(); 
      } else {
         const token = req.query.token; 
         if (token) {
            const user = await UserModel.findOne({ token });
            if (user && user.otpVerify === true) {
               next();
            } else {
               req.flash('error', 'Invalid or expired token');
               return res.redirect('/account/profile/resetPassword');
            }
         } else {
            req.flash('error', 'Please provide a valid token');
            return res.redirect('/account/profile/resetPassword');
         }
      }
   } catch (error) {
      console.error('Error in checkVerifyOTP middleware:', error);
      res.status(500).send('Internal Server Error');
   }
};

module.exports = checkVerifyOTP;
