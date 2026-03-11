export const verifyEmail = async (token, email) => {
  // ✅ use FRONTEND_URL instead of VITE_URL
  const frontendUrl = process.env.FRONTEND_URL || 'https://kisantraders.onrender.com'
  const verifyLink = `${frontendUrl}/verify?token=${token}`

  console.log('🔗 Verify link:', verifyLink) // ← add this to confirm

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'KisanTraders', email: process.env.BREVO_EMAIL },
        to: [{ email: email }],
        subject: 'Verify Your Email - KisanTraders',
        htmlContent: `
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
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ Brevo error:', JSON.stringify(data))
      return null
    }

    console.log('✅ Verification email sent to:', email)
    return { messageId: data.messageId }

  } catch (err) {
    console.error('❌ Email failed:', err.message)
    return null
  }
}