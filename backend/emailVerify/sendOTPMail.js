import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendOTPMail = async (otp, email) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'KisanTraders <onboarding@resend.dev>',
      to: email,
      subject: 'Your Password Reset OTP - KisanTraders',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f5f0e8;border-radius:12px;">
          <div style="text-align:center;margin-bottom:24px;">
            <h1 style="color:#3b2a1a;margin:0;">🌾 KisanTraders</h1>
            <p style="color:#5c3d1e;margin:4px 0 0;">Your trusted hardware store</p>
          </div>
          <div style="background:white;border-radius:12px;padding:32px;">
            <h2 style="color:#2d4a2e;margin-top:0;">Password Reset OTP</h2>
            <p style="color:#555;line-height:1.6;">
              You requested to reset your password. Use the OTP below:
            </p>
            <div style="text-align:center;margin:32px 0;">
              <div style="background:#f5f0e8;border-radius:12px;padding:24px;display:inline-block;">
                <p style="font-size:42px;font-weight:bold;color:#2d4a2e;letter-spacing:12px;margin:0;">
                  ${otp}
                </p>
              </div>
            </div>
            <p style="color:#aaa;font-size:12px;text-align:center;margin-top:24px;">
              ⏳ This OTP expires in <strong>10 minutes</strong>.<br/>
              If you didn't request this, please ignore this email.
            </p>
          </div>
        </div>
      `
    })

    if (error) throw new Error(error.message)

    console.log('✅ OTP email sent to:', email)
    return { messageId: data.id }

  } catch (err) {
    console.error('❌ OTP email failed:', err.message)
    return null
  }
}