import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Wrench, Loader2, RefreshCw } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'

const Verify = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleResend = async () => {
    if (!email) return toast.error('Please enter your email')
    setLoading(true)
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/user/reverify`,
        { email }
      )
      if (res.data.success) {
        setSent(true)
        toast.success('Verification email sent!')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to resend email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#f5f0e8" }}>
      <div className="w-full max-w-sm rounded-2xl border p-8 text-center" style={{ background: "#fff", borderColor: "rgba(143,185,122,0.2)" }}>

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="p-1.5 rounded-xl" style={{ background: "rgba(143,185,122,0.15)" }}>
            <Wrench className="w-4 h-4" style={{ color: "#3d6b40" }} />
          </div>
          <span className="font-bold text-sm" style={{ color: "#2d4a2e" }}>Kisan Traders</span>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="rounded-full p-4" style={{ background: "rgba(143,185,122,0.12)" }}>
            <Mail className="w-10 h-10" style={{ color: "#3d6b40" }} />
          </div>
        </div>

        {/* Text */}
        <h2 className="font-bold text-lg mb-2" style={{ color: "#2d4a2e" }}>Check your email</h2>
        <p className="text-sm leading-relaxed mb-6" style={{ color: "#9a8a7a" }}>
          We've sent a verification link to your email. Please check your inbox and click the link to activate your account.
        </p>

        {/* Resend section */}
        {!sent ? (
          <div className="mb-4">
            <p className="text-xs mb-2" style={{ color: "#9a8a7a" }}>Didn't receive it?</p>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border text-sm mb-2 outline-none"
              style={{ borderColor: "rgba(143,185,122,0.3)", color: "#2d4a2e" }}
            />
            <button
              onClick={handleResend}
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #2d4a2e, #3d6b40)" }}>
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                : <><RefreshCw className="w-4 h-4" /> Resend Email</>
              }
            </button>
          </div>
        ) : (
          <div className="mb-4 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: "rgba(143,185,122,0.12)", color: "#3d6b40" }}>
            ✅ Email sent! Check your inbox.
          </div>
        )}

        {/* Back to login */}
        <button
          onClick={() => navigate('/login')}
          className="w-full py-3 rounded-xl text-sm font-semibold border transition-all"
          style={{ borderColor: "rgba(143,185,122,0.3)", color: "#3d6b40" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(143,185,122,0.08)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          Back to Login
        </button>

      </div>
    </div>
  )
}

export default Verify