
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_EMAIL,
    pass: process.env.BREVO_SMTP_KEY
  }
})

export const sendOTPMail = async (otp, email) => {
  try {
    await transporter.sendMail({
      from: `KisanTraders <${process.env.BREVO_EMAIL}>`,
      to: email,
      subject: 'Your Password Reset OTP - KisanTraders',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f5f0e8;border-radius:12px;">
          <div style="text-align:center;margin-bottom:24px;">
            <h1 style="color:#3b2a1a;margin:0;">🌾 KisanTraders</h1>
          </div>
          <div style="background:white;border-radius:12px;padding:32px;">
            <h2 style="color:#2d4a2e;margin-top:0;">Password Reset OTP</h2>
            <p style="color:#555;">Use the OTP below to reset your password:</p>
            <div style="text-align:center;margin:32px 0;">
              <div style="background:#f5f0e8;border-radius:12px;padding:24px;display:inline-block;">
                <p style="font-size:42px;font-weight:bold;color:#2d4a2e;letter-spacing:12px;margin:0;">
                  ${otp}
                </p>
              </div>
            </div>
            <p style="color:#aaa;font-size:12px;text-align:center;">
              ⏳ Expires in <strong>10 minutes</strong>. If you didn't request this, ignore this email.
            </p>
          </div>
        </div>
      `
    })
    console.log('✅ OTP email sent to:', email)
    return { messageId: 'sent' }
  } catch (err) {
    console.error('❌ OTP email failed:', err.message)
    return null
  }
}
