import nodemailer from 'nodemailer'
import 'dotenv/config'

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

export const sendOTPMail = async (otp, email) => {
  const mailConfigurations = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Password Reset OTP',
    html: `<p>Your OTP for password reset is: <b>${otp}</b></p>
           <p style="color:#999; font-size:12px;">This OTP expires in 10 minutes.</p>`
  };

  try {
    const info = await transporter.sendMail(mailConfigurations);
    console.log('✅ OTP sent to:', email);
    return info;
  } catch (error) {
    console.error('❌ OTP email failed:', error.message);
    throw new Error(`Failed to send OTP email: ${error.message}`);
    // ↑ OTP emails CAN throw — forgotPassword should fail if OTP can't be delivered
  }
};