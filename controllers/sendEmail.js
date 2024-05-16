const nodemailer = require("nodemailer");


const sendMailResetPassword = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_AUTH,
            pass: process.env.EMAIL_PASS
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_AUTH,
        to: email,
        subject: "Password Reset Request",
        html: `<h1>Reset Password</h1><p>Your OTP is: <br> ${otp}</p><p>Your OTP will expire in 5 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendMailResetPassword;