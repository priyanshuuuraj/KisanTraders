import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Wrench } from 'lucide-react'

const Verify = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#f5f0e8" }}>
      <div className="w-full max-w-sm rounded-2xl border p-8 text-center" style={{ background: "#fff", borderColor: "rgba(143,185,122,0.2)" }}>
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="p-1.5 rounded-xl" style={{ background: "rgba(143,185,122,0.15)" }}>
            <Wrench className="w-4 h-4" style={{ color: "#3d6b40" }} />
          </div>
          <span className="font-bold text-sm" style={{ color: "#2d4a2e" }}>Kisan Traders</span>
        </div>
        <div className="flex justify-center mb-5">
          <div className="rounded-full p-4" style={{ background: "rgba(143,185,122,0.12)" }}>
            <Mail className="w-10 h-10" style={{ color: "#3d6b40" }} />
          </div>
        </div>
        <h2 className="font-bold text-lg mb-2" style={{ color: "#2d4a2e" }}>Check your email</h2>
        <p className="text-sm leading-relaxed mb-6" style={{ color: "#9a8a7a" }}>
          We've sent a verification link to your email. Please check your inbox and click the link to activate your account.
        </p>
        <button onClick={() => navigate('/login')}
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