import { Resend } from 'resend'
import 'dotenv/config'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendOTPMail = async (otp, email) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'KisanTraders <onboarding@resend.dev>',
      to: email,
      subject: 'Password Reset OTP - KisanTraders',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2e7d32;">Password Reset 🔐</h2>
          <p>Your OTP for password reset is:</p>
          <h1 style="letter-spacing: 8px; color: #2e7d32;">${otp}</h1>
          <p style="color: #999; font-size: 12px;">This OTP expires in 10 minutes. Do not share it with anyone.</p>
        </div>
      `
    })

    if (error) {
      console.error('❌ OTP email failed:', error)
      throw new Error(error.message)
    }

    console.log('✅ OTP sent to:', email, data)
    return data

  } catch (err) {
    console.error('❌ OTP email failed:', err.message)
    throw new Error(`Failed to send OTP: ${err.message}`)
  }
}