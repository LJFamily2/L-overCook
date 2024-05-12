const UserModel = require('../models/User');

const checkVerifyOTP = async (req, res, next) => {
   try {
      // Check if the user is signed in and otpVerify is true
      if (req.user && req.user.otpVerify === true) {
         next(); // Allow access to the route
      } else {
         // Check if a valid token exists in the request parameters
         const token = req.query.token; // Assuming token is included in the query parameters
         if (token) {
            // Check if the token is valid and not expired
            const user = await UserModel.findOne({ token });
            if (user && user.otpVerify === true) {
               // Proceed with the reset password process
               next();
            } else {
               // Invalid or expired token, redirect to reset password page
               req.flash('error', 'Invalid or expired token');
               return res.redirect('/account/profile/resetPassword');
            }
         } else {
            // No valid token provided, redirect to reset password page
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
