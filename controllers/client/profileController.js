const crypto = require('crypto');
const UserModel = require('../../models/User');
const sendMailResetPassword = require('../sendEmail');
const { v4: uuidv4 } = require("uuid");

const getEmailPage = async (req, res) => {
   res.send('Email page');
};

// Function to generate OTP and timestamp
const generateOTP = () => {
   const otp = crypto.randomBytes(3).toString('hex').toUpperCase();
   const timestamp = Date.now();
   return { otp, timestamp };
};

// Function to send email with OTP
const sendOtp = async (req, res) => {
   const { email } = req.body;

   try {
      // Generate OTP and timestamp
      const { otp, timestamp } = generateOTP();

      // Update user model with OTP and its timestamp
      await UserModel.findOneAndUpdate(
         { email },
         { otp, otpTimestamp: timestamp }
      );

      // Send email with OTP
      await sendMailResetPassword(email, otp);

      res
         .send('OTP page')
         .redirect(`/account/resetPassword?token=${req.user.token}`);
      // .status(200);
   } catch (error) {
      console.error(error);
      res.status(500);
   }
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
   const { userEnteredOTP } = req.body;
   const token = req.params.token;

   try {
      const user = await UserModel.findOne({ token });
      if (!user){
         res.send('User not found').status(404);
         return;
      }

      // Check if user data exists and if OTP verification is successful
      if (
         checkOtp(
            { otp: user.otp, timestamp: user.otpTimestamp },
            userEnteredOTP
         )
      ) {
         // Generate new token and remove the OTP and its timestamp
         const newToken = uuidv4();
         await UserModel.findOneAndUpdate(
            { _id: user._id },
            { token: newToken , $unset: { otp: 1, otpTimestamp: 1 } }
         );
         res.send('OTP verified successfully').status(200);
         
      } else {
         res.send(
            'Invalid OTP'
         ).redirect(`/account/resetPassword?token=${user.token}`);
      }
   } catch (err) {
      console.error(err);
      res.status(500);
   }
};
module.exports = { getEmailPage, sendOtp, verifyOtp };
