import SibApiV3Sdk from '@getbrevo/brevo'

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY)

export const verifyEmail = async (token, email) => {
  const frontendUrl = process.env.VITE_URL || 'https://kisantraders.onrender.com'
  const verifyLink = `${frontendUrl}/verify?token=${token}`

  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()
    sendSmtpEmail.to = [{ email }]
    sendSmtpEmail.sender = { name: 'KisanTraders', email: process.env.BREVO_EMAIL }
    sendSmtpEmail.subject = 'Verify Your Email - KisanTraders'
    sendSmtpEmail.htmlContent = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f5f0e8;border-radius:12px;">
        <div style="text-align:center;margin-bottom:24px;">
          <h1 style="color:#3b2a1a;margin:0;">🌾 KisanTraders</h1>
          <p style="color:#5c3d1e;margin:4px 0 0;">Your trusted hardware store</p>
        </div>
        <div style="background:white;border-radius:12px;padding:32px;">
          <h2 style="color:#2d4a2e;margin-top:0;">Verify Your Email Address</h2>
          <p style="color:#555;line-height:1.6;">Thanks for registering! Click below to activate your account.</p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${verifyLink}"
              style="background:linear-gradient(135deg,#2d4a2e,#3d6b40);color:white;
                     padding:14px 32px;border-radius:8px;text-decoration:none;
                     font-weight:bold;font-size:16px;display:inline-block;">
              ✅ Verify My Email
            </a>
          </div>
          <p style="color:#888;font-size:13px;text-align:center;">
            Or copy this link:<br/>
            <a href="${verifyLink}" style="color:#5c3d1e;word-break:break-all;">${verifyLink}</a>
          </p>
          <p style="color:#aaa;font-size:12px;text-align:center;margin-top:24px;">
            ⏳ Expires in <strong>1 day</strong>. If you didn't register, ignore this.
          </p>
        </div>
      </div>
    `

    await apiInstance.sendTransacEmail(sendSmtpEmail)
    console.log('✅ Verification email sent to:', email)
    return { messageId: 'sent' }

  } catch (err) {
    console.error('❌ Email failed:', err.message)
    return null
  }
}