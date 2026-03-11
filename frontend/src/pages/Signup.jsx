import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2, Wrench, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [focused, setFocused] = useState("")
    const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" })
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_URL}/api/v1/user/register`,
                formData,
                { headers: { "Content-Type": "application/json" } }
            )
            if (res.data.success) {
                toast.success(res.data.message)
                navigate('/reverify')
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Signup Failed")
        } finally {
            setLoading(false)
        }
    }

    const passwordStrength = () => {
        const p = formData.password
        if (!p) return null
        if (p.length < 6) return { label: "Too short", color: "#ef4444", width: "25%" }
        if (p.length < 8) return { label: "Weak", color: "#f97316", width: "50%" }
        if (!/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { label: "Medium", color: "#eab308", width: "75%" }
        return { label: "Strong", color: "#22c55e", width: "100%" }
    }
    const strength = passwordStrength()

    const fieldBorder = (name) =>
        focused === name ? "border-green-600 shadow-sm shadow-green-100" : "border-stone-200"

    const labelColor = (name) =>
        focused === name ? "text-green-700" : "text-stone-600"

    const inputClass = "border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl h-12 px-4"

    const benefits = [
        "Access 500+ hardware products",
        "Track your orders in real time",
        "Exclusive deals for members",
    ]

    return (
        <div className="min-h-screen flex">

            {/* LEFT PANEL */}
            <div className="hidden lg:flex w-1/2 flex-col justify-between p-12"
                style={{ background: "linear-gradient(135deg, #2d4a2e 0%, #3d6b40 50%, #5c3d1e 100%)" }}>

                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.15)" }}>
                        <Wrench className="w-5 h-5 text-amber-200" />
                    </div>
                    <span className="font-bold text-lg text-amber-100">Kisan Traders</span>
                </div>

                <div>
                    <h1 className="text-5xl font-bold leading-tight mb-4 text-amber-50">
                        Join Us<br />Today!
                    </h1>
                    <p className="text-green-100/80 text-lg leading-relaxed max-w-sm mb-8">
                        Create your account and start shopping quality tools and hardware.
                    </p>
                    <div className="space-y-3">
                        {benefits.map((b) => (
                            <div key={b} className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-amber-300 flex-shrink-0" />
                                <span className="text-green-100/80 text-sm">{b}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-green-200/60 text-sm">
                    Already a member?{" "}
                    <Link to="/login" className="text-amber-200 font-semibold hover:underline">Sign in</Link>
                </p>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex-1 flex items-center justify-center p-8" style={{ background: "#f5f0e8" }}>
                <div className="w-full max-w-md">

                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-6 lg:hidden">
                            <div className="p-2 rounded-xl bg-amber-100">
                                <Wrench className="w-5 h-5 text-amber-700" />
                            </div>
                            <span className="font-bold text-lg text-stone-800">Kisan Traders</span>
                        </div>
                        <h2 className="text-3xl font-bold text-stone-800">Create account</h2>
                        <p className="text-stone-500 mt-1.5">Fill in your details to get started</p>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-4">

                        {/* Name Row */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { name: "firstName", label: "First Name", placeholder: "Priyanshu" },
                                { name: "lastName", label: "Last Name", placeholder: "Raj" }
                            ].map(field => (
                                <div key={field.name} className="space-y-1.5">
                                    <Label className={`text-sm font-medium transition-colors ${labelColor(field.name)}`}>
                                        {field.label}
                                    </Label>
                                    <div className={`relative rounded-xl border-2 transition-all duration-200 bg-white ${fieldBorder(field.name)}`}>
                                        <Input
                                            name={field.name}
                                            type="text"
                                            placeholder={field.placeholder}
                                            required
                                            value={formData[field.name]}
                                            onChange={handleChange}
                                            onFocus={() => setFocused(field.name)}
                                            onBlur={() => setFocused("")}
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label className={`text-sm font-medium transition-colors ${labelColor("email")}`}>
                                Email address
                            </Label>
                            <div className={`relative rounded-xl border-2 transition-all duration-200 bg-white ${fieldBorder("email")}`}>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={() => setFocused("email")}
                                    onBlur={() => setFocused("")}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <Label className={`text-sm font-medium transition-colors ${labelColor("password")}`}>
                                Password
                            </Label>
                            <div className={`relative rounded-xl border-2 transition-all duration-200 bg-white ${fieldBorder("password")}`}>
                                <Input
                                    name="password"
                                    placeholder="Create a strong password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setFocused("password")}
                                    onBlur={() => setFocused("")}
                                    className={`${inputClass} pr-12`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {/* Password Strength */}
                            {strength && (
                                <div className="space-y-1 pt-1">
                                    <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-300"
                                            style={{ width: strength.width, background: strength.color }}
                                        />
                                    </div>
                                    <p className="text-xs font-medium" style={{ color: strength.color }}>
                                        {strength.label} password
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-2 shadow-md"
                            style={{ background: "linear-gradient(135deg, #3b2a1a, #5c3d1e)" }}
                        >
                            {loading ? (
                                <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</>
                            ) : (
                                <>Create Account <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>

                    </form>

                    <p className="text-center text-stone-500 text-sm mt-6">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold hover:underline transition" style={{ color: "#2d4a2e" }}>
                            Sign in
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    )
}

export default Signup
