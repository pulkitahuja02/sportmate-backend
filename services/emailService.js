import nodemailer from 'nodemailer';

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER, // Comes from .env file
    pass: process.env.EMAIL_PASS, // Comes from .env file
  },
});

// ✅ Updated: accept OTP as parameter instead of generating inside
export const sendOTPEmail = async (email, otp) => {
  console.log("sendOTPEmail function backend par call hogya");
  console.log("📩 Sending OTP:", otp, "to", email);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Verification',
    text: `Your OTP is: ${otp}`,
    html: `<b>Your OTP is: ${otp}</b>`,
  };

  await transporter.sendMail(mailOptions);
};
