const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");


const sendMail = async () => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_AUTH,
            pass: process.env.EMAIL_PASS 
        },
    });
    
    
    const mailOptions = {
        from: process.env.EMAIL_AUTH, 
        to: email, 
        subject: "Password Reset Request", 
        html:`<h1>Reset Password</h1>`,
    }

    await transporter.sendMail(mailOptions, () => {
        console.log("Message sent: %s", info.messageId);
    });
}

module.exports = sendMail;