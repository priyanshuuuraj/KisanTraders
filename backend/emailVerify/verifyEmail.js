import nodemailer from 'nodemailer'
import 'dotenv/config'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  family: 4,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
})

export const verifyEmail = async (token, email) => {
  const frontendUrl = process.env.VITE_URL || 'https://kisantraders.onrender.com'

  try {
    await transporter.sendMail({
      from: `KisanTraders <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email - KisanTraders',
      html: `...`
    })
    console.log('✅ Verification email sent to:', email)
    return { messageId: 'sent' }
  } catch (err) {
    console.error('❌ Email failed:', err.message)
    return null
  }
}