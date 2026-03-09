import { Resend } from 'resend'
import 'dotenv/config'

const resend = new Resend(process.env.RESEND_API_KEY)

export const verifyEmail = async (token, email) => {
  const frontendUrl = process.env.VITE_URL || 'https://kisantraders.onrender.com'

  try {
    const { data, error } = await resend.emails.send({
      from: 'KisanTraders <onboarding@resend.dev>',
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
    })

    if (error) {
      console.error('❌ Email failed:', error)
      return null // Don't crash registration
    }

    console.log('✅ Verification email sent to:', email, data)
    return data

  } catch (err) {
    console.error('❌ Email failed:', err.message)
    return null // Don't crash registration
  }
}