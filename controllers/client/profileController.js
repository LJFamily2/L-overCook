const crypto = require('crypto');
const UserModel = require('../../models/User');
const sendMailResetPassword = require('../sendEmail');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

// Render get profile page
const getProfilePage = async (req, res) => {
   try {
      res.render('client/profile', {
         layout: 'layouts/client/defaultLayout',
         userAuthentication: false,
         user: req.user,
         messages: req.flash(),
      });
   } catch (error) {
      console.error(error);
      res.status(500);
   }
};

// Render get email page
const getEmailPage = async (req, res) => {
   res.render('client/resetPassword', {
      layout: 'layouts/client/defaultLayout',
      userAuthentication: false,
      user: req.user,
      messages: req.flash(),
   });
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
         return;
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
   }
};

// Function to send email with OTP
const sendOtp = async (req, res) => {
   const { email } = req.body;

   try {
      const user = await UserModel.findOne({ email });
      if (!user) {
         req.flash('error', 'User not found');
         res.status(404).redirect('/account/profile/resetPassword');
         return;
      }

      // Generate OTP and timestamp

      res.status(200).redirect(
         `/account/profile/resetPassword/verifyOTP?token=${user.token}`
      );
      generateAndSendOtpEmail(user);
   } catch (error) {
      console.error(error);
      res.status(500);
   }
};

const verifyOtpPage = async (req, res) => {
   const { token } = req.query;

   res.render('client/sendOTP', {
      layout: 'layouts/client/defaultLayout',
      userAuthentication: true,
      token,
      messages: req.flash(),
   });
};

const handleOtpRequest = async (req, res) => {
   try {
      const { action } = req.body;

      if (action === 'resend') {
         await resendOtp(req, res);
      } else if (action === 'verify') {
         await verifyOtp(req, res);
      }
   } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
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
            {
               token: newToken,
               otpVerify: true,
               $unset: { otp: 1, otpTimestamp: 1, otpRequestTimestamp: 1 },
            }
         );
         req.flash('success', 'OTP verified successfully');
         res.status(200).redirect(
            `/account/profile/updatePassword?token=${newToken}`
         );
      } else {
         req.flash('error', 'Invalid OTP');
         res.status(400);
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
      req.flash('success', 'OTP resend successfully');

      res.status(200).redirect(
         `/account/profile/resetPassword/verifyOTP?token=${user.token}`
      );
   } catch (error) {
      console.error(error);
      res.status(500);
   }
};

const updateUserPassword = async (req, res) => {
   try {
      console.log(req.body);
      
      const { token } = req.body;
      existingUser = await UserModel.findOne({ token });

      if (existingUser) {
         userId = existingUser._id;
      }

      console.log(existingUser);
      if (!existingUser) {
         req.flash('error', 'User not found');
         return res
            .status(404)
            .redirect(`/account/profile/updatePassword?token=${token}`);
      }

      const { newPassword, reenterPassword } = req.body;

      // Check if the new password matches the re-entered password
      if (newPassword !== reenterPassword) {
         req.flash('error', 'Passwords do not match');
         return res
            .status(400)
            .redirect(`/account/profile/updatePassword?token=${token}`);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updatedUser = await UserModel.findByIdAndUpdate(
         userId,
         { password: hashedPassword, otpVerify: false },
      );

      if (!updatedUser) {
         req.flash('error', 'Error updating user');
         return res.status(500).redirect('/account/profile');
      }

      req.flash('success', 'User password updated successfully');
      res.status(201).redirect('/account/profile');
   } catch (error) {
      console.error('Error updating user password:', error);
      return res.status(500).send('Internal server error');
   }
};

module.exports = {
   verifyOtpPage,
   getProfilePage,
   getEmailPage,
   sendOtp,
   verifyOtp,
   resendOtp,
   handleOtpRequest,
   updateUserPassword,
};
