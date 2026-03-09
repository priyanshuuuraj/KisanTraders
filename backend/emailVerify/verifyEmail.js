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

export const verifyEmail = async (token, email) => {
  const frontendUrl = process.env.VITE_URL || 'https://kisantraders.onrender.com';

  const mailConfigurations = {
    from: `"KisanTraders" <${process.env.MAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email - KisanTraders',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2e7d32;">Welcome to KisanTraders! 🌱</h2>
        <p>Hi there,</p>
        <p>Please verify your email by clicking the button below:</p>
        <a href="${frontendUrl}/verify/${token}"
           style="display: inline-block; padding: 12px 24px; background-color: #2e7d32;
                  color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          Verify Email
        </a>
        <p>Or copy this link:</p>
        <p style="color: #666;">${frontendUrl}/verify/${token}</p>
        <p style="color: #999; font-size: 12px;">Expires in 24 hours.</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailConfigurations);
    console.log('✅ Verification email sent to:', email);
    return info;
  } catch (error) {
    // Log but DO NOT throw — registration should still succeed even if email fails
    console.error('❌ Email failed:', error.message);
    return null;
  }
};