import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CheckCircle2, XCircle, Loader2, Wrench } from 'lucide-react'

const VerifyEmail = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState("verifying")

  useEffect(() => {
    if (!token) return setStatus("error")

    const verify = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_URL}/api/v1/user/verify/${token}`
        )
        if (res.data.success) {
          setStatus("success")
          setTimeout(() => navigate('/login'), 2500)
        }
      } catch (err) {
        const msg = err?.response?.data?.message || ''
        setStatus(msg.includes('expired') ? 'expired' : 'error')
      }
    }

    verify()
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#f5f0e8" }}>
      <div className="w-full max-w-sm rounded-2xl border p-8 text-center" style={{ background: "#fff", borderColor: "rgba(143,185,122,0.2)" }}>

        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="p-1.5 rounded-xl" style={{ background: "rgba(143,185,122,0.15)" }}>
            <Wrench className="w-4 h-4" style={{ color: "#3d6b40" }} />
          </div>
          <span className="font-bold text-sm" style={{ color: "#2d4a2e" }}>Kisan Traders</span>
        </div>

        {status === "verifying" && (
          <>
            <div className="flex justify-center mb-4">
              <Loader2 className="w-12 h-12 animate-spin" style={{ color: "#8fb97a" }} />
            </div>
            <h2 className="font-bold text-base" style={{ color: "#2d4a2e" }}>Verifying your email...</h2>
            <p className="text-xs mt-2" style={{ color: "#9a8a7a" }}>Please wait a moment</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex justify-center mb-4">
              <div className="rounded-full p-3" style={{ background: "rgba(143,185,122,0.12)" }}>
                <CheckCircle2 className="w-10 h-10" style={{ color: "#3d6b40" }} />
              </div>
            </div>
            <h2 className="font-bold text-base" style={{ color: "#2d4a2e" }}>Email Verified! 🎉</h2>
            <p className="text-xs mt-2" style={{ color: "#9a8a7a" }}>Redirecting you to login...</p>
          </>
        )}

        {status === "expired" && (
          <>
            <div className="flex justify-center mb-4">
              <div className="rounded-full p-3" style={{ background: "rgba(255,180,0,0.1)" }}>
                <XCircle className="w-10 h-10" style={{ color: "#b97a00" }} />
              </div>
            </div>
            <h2 className="font-bold text-base" style={{ color: "#2d2d2d" }}>Link Expired</h2>
            <p className="text-xs mt-2 mb-5" style={{ color: "#9a8a7a" }}>Your verification link has expired.</p>
            <button onClick={() => navigate('/reverify')}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: "#b97a00" }}>
              Resend Verification Email
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex justify-center mb-4">
              <div className="rounded-full p-3" style={{ background: "rgba(220,80,80,0.1)" }}>
                <XCircle className="w-10 h-10" style={{ color: "#c05050" }} />
              </div>
            </div>
            <h2 className="font-bold text-base" style={{ color: "#2d2d2d" }}>Verification Failed</h2>
            <p className="text-xs mt-2 mb-5" style={{ color: "#9a8a7a" }}>Invalid or already used link.</p>
            <button onClick={() => navigate('/signup')}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: "#3d6b40" }}>
              Back to Signup
            </button>
          </>
        )}

      </div>
    </div>
  )
}

export default VerifyEmail