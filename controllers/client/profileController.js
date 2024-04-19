const crypto = require('crypto');
const UserModel = require('../../models/User');
const sendMailResetPassword = require('../sendEmail');
const { v4: uuidv4 } = require('uuid');

// Render get profile page
const getProfilePage = async (req, res) => {
   // res.send('Profile page');
   res.render('client/profile', { layout: "layouts/client/defaultLayout", userAuthentication: false });
};

// Render get email page
const getEmailPage = async (req, res) => {
   res.render('emailPageTesting', { layout: false, user: req.user });
};

// Function to generate OTP and timestamp
const generateOTP = () => {
   const otp = crypto.randomBytes(3).toString('hex').toUpperCase();
   const timestamp = Date.now();
   return { otp, timestamp };
};

// Function to generate and send OTP email
const generateAndSendOtpEmail = async (user) => {
   try {
      const lastOtpRequest = user.otpRequestTimestamp;
      const currentTime = Date.now();

      // Check if the last OTP request was less than 60 seconds ago
      if (lastOtpRequest && currentTime - lastOtpRequest < 60000) {
         return res.status(429).send('Too many OTP requests. Please wait a moment and try again.');
      }

      const { otp, timestamp } = generateOTP();

      // Update user model with OTP, its timestamp, and the OTP request timestamp
      await UserModel.findOneAndUpdate(
         { _id: user._id },
         { otp, otpTimestamp: timestamp, otpRequestTimestamp: currentTime }
      );

      // Send email with OTP
      await sendMailResetPassword(user.email, otp);

      return { otp, timestamp };
   } catch (error) {
      console.error(error);
      res.status(500);
   }
};

// Function to send email with OTP
const sendOtp = async (req, res) => {
   const { email } = req.body;

   try {
      const user = await UserModel.findOne({ email });
      if (!user) {
         res.send('User not found').status(404);
         return;
      }

      // Generate OTP and timestamp
      await generateAndSendOtpEmail(user);

      res.redirect(
         `/account/profile/resetPassword/verifyOTP?token=${user.token}`
      );
      // .status(200);
   } catch (error) {
      console.error(error);
      res.status(500);
   }
};

const verifyOtpPage = async (req, res) => {
   const { token } = req.query;

   res.render('verifyOTPTesting', { layout: false, token });
};

// Function to verify OTP expiration
const checkOtp = (otpData, userEnteredOTP) => {
   const { otp, timestamp } = otpData;
   const now = Date.now();
   const timeDifference = now - timestamp;
   const fiveMinutesInMs = 5 * 60 * 1000; // 5 minutes in milliseconds

   // Check if OTP is correct and timestamp is within 5 minutes
   if (otp === userEnteredOTP && timeDifference < fiveMinutesInMs) {
      return true;
   } else {
      return false;
   }
};

const verifyOtp = async (req, res) => {
   try {
      const { otp, token } = req.body;
      const user = await UserModel.findOne({ token });
      if (!user) {
         res.send('User not found').status(404);
         return;
      }

      // Check if user data exists and if OTP verification is successful
      if (checkOtp({ otp: user.otp, timestamp: user.otpTimestamp }, otp)) {
         // Generate new token and remove the OTP and its timestamp
         const newToken = uuidv4();
         await UserModel.findOneAndUpdate(
            { _id: user._id },
            { token: newToken, $unset: { otp: 1, otpTimestamp: 1, otpRequestTimestamp: 1 } }
         );
         res.send('OTP verified successfully').status(200);
      } else {
         res.redirect(
            `/account/profile/resetPassword/verifyOTP?token=${user.token}`
         );
      }
   } catch (err) {
      console.error(err);
      res.status(500);
   }
};

// Resend the verification code if the user has not received it

const resendOtp = async (req, res) => {
   try {
      const { token } = req.body;

      const user = await UserModel.findOne({ token });
      if (!user) {
         res.send('User not found').status(404);
         return;
      }

     // Generate OTP and timestamp
     await generateAndSendOtpEmail(user);

      res.redirect(
         `/account/profile/resetPassword/verifyOTP?token=${user.token}`
      );
   } catch (error) {
      console.error(error);
      res.status(500);
   }
};
module.exports = {
   verifyOtpPage,
   getProfilePage,
   getEmailPage,
   sendOtp,
   verifyOtp,
   resendOtp,
};
