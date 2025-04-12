import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Generate random 6-digit OTP
const generateOTP = () => crypto.randomInt(100000, 999999);

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER, // Comes from .env file
    pass: process.env.EMAIL_PASS, // Comes from .env file
  },
});

export const sendOTPEmail = async (email) => {
  console.log("sendotpMail function backend par call hogya")
  const otp = generateOTP();

  const mailOptions = {
    from: process.env.EMAIL_USER, // ✅ Use env variable here too
    to: email,
    subject: 'Your OTP for Verification',
    text: `Your OTP is: ${otp}`,
    html: `<b>Your OTP is: ${otp}</b>`,
  };

  await transporter.sendMail(mailOptions);
  return otp; // Return OTP to store in DB or session
};
