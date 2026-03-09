import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2, Wrench, ArrowRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setUser } from '@/redux/userSlice'

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [focused, setFocused] = useState("")
    const [formData, setFormData] = useState({ email: "", password: "" })
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_URL}/api/v1/user/login`,
                formData,
                { headers: { "Content-Type": "application/json" } }
            )
            if (res.data.success) {
                dispatch(setUser(res.data.user))
                localStorage.setItem("accessToken", res.data.accessToken)
                toast.success(res.data.message)
                navigate('/')
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Login Failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex">

            {/* LEFT PANEL */}
            <div className="hidden lg:flex w-1/2 flex-col justify-between p-12"
                style={{ background: "linear-gradient(135deg, #3b2a1a 0%, #5c3d1e 40%, #2d4a2e 100%)" }}>

                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.15)" }}>
                        <Wrench className="w-5 h-5 text-amber-200" />
                    </div>
                    <span className="font-bold text-lg text-amber-100">Kisan Traders</span>
                </div>

                <div>
                    <h1 className="text-5xl font-bold leading-tight mb-120 text-amber-50">
                        Welcome<br />Back!
                    </h1>
                    <p className="text-amber-200/80 text-lg leading-relaxed max-w-sm ">
                        Your trusted source for quality hardware tools and supplies.
                    </p>
                </div>



                {/* <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: "Products", value: "500+" },
                        { label: "Happy Customers", value: "2k+" },
                        { label: "Brands", value: "50+" },
                        { label: "Orders Delivered", value: "10k+" },
                    ].map((stat) => (
                        <div key={stat.label} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.08)" }}>
                            <p className="font-bold text-2xl text-amber-100">{stat.value}</p>
                            <p className="text-amber-300/70 text-sm mt-0.5">{stat.label}</p>
                        </div>
                    ))}
                </div> */}



                
            </div>

            {/* RIGHT PANEL */}
            <div className="flex-1 flex items-center justify-center p-8" style={{ background: "#f5f0e8" }}>
                <div className="w-full max-w-md">

                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-6 lg:hidden">
                            <div className="p-2 rounded-xl bg-amber-100">
                                <Wrench className="w-5 h-5 text-amber-700" />
                            </div>
                            <span className="font-bold text-lg text-stone-800">HardwareShop</span>
                        </div>
                        <h2 className="text-3xl font-bold text-stone-800">Sign in</h2>
                        <p className="text-stone-500 mt-1.5">Enter your credentials to access your account</p>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-5">

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label className={`text-sm font-medium transition-colors ${focused === "email" ? "text-green-700" : "text-stone-600"}`}>
                                Email address
                            </Label>
                            <div className={`relative rounded-xl border-2 transition-all duration-200 bg-white ${focused === "email" ? "border-green-600 shadow-sm shadow-green-100" : "border-stone-200"}`}>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={() => setFocused("email")}
                                    onBlur={() => setFocused("")}
                                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl h-12 px-4"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <Label className={`text-sm font-medium transition-colors ${focused === "password" ? "text-green-700" : "text-stone-600"}`}>
                                Password
                            </Label>
                            <div className={`relative rounded-xl border-2 transition-all duration-200 bg-white ${focused === "password" ? "border-green-600 shadow-sm shadow-green-100" : "border-stone-200"}`}>
                                <Input
                                    name="password"
                                    placeholder="Enter your password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setFocused("password")}
                                    onBlur={() => setFocused("")}
                                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl h-12 px-4 pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-2 shadow-md"
                            style={{ background: "linear-gradient(135deg, #2d4a2e, #3d6b40)" }}
                        >
                            {loading ? (
                                <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</>
                            ) : (
                                <>Sign in <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>

                    </form>

                    <p className="text-center text-stone-500 text-sm mt-6">
                        Don't have an account?{" "}
                        <Link to="/signup" className="font-semibold hover:underline transition" style={{ color: "#5c3d1e" }}>
                            Create one
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    )
}

export default Login
