import nodemailer from 'nodemailer'
import 'dotenv/config'

export const verifyEmail = async (token, email) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS  // ← must be Google App Password
        }
    });

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
        console.log('✅ Email sent to:', email);
        return info;
    } catch (error) {
        console.error('❌ Email failed:', error.message);
        throw new Error(`Email error: ${error.message}`);
    }
};