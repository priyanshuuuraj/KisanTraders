import React, { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDispatch, useSelector } from "react-redux"
import userLogo from '../assets/def.png'
import { setUser } from "@/redux/userSlice"
import { toast } from "sonner"
import axios from "axios"
import MyOrder from "./MyOrder"
import { Camera, User, Mail, Phone, MapPin, Building2, Hash, ShieldCheck, Wrench } from "lucide-react"

const Profile = () => {
  const { user } = useSelector(store => store.user)
  const [updateUser, setUpdateUser] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNo: user?.phoneNo || "",
    address: user?.address || "",
    city: user?.city || "",
    zipCode: user?.zipCode || "",
    profilePic: user?.profilePic || "",
    role: user?.role || "user"
  })
  const [file, setFile] = useState(null)
  const [focused, setFocused] = useState("")
  const dispatch = useDispatch()
  const accessToken = localStorage.getItem("accessToken")

  const handleChange = (e) => setUpdateUser({ ...updateUser, [e.target.name]: e.target.value })

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setUpdateUser({ ...updateUser, profilePic: URL.createObjectURL(selectedFile) })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!accessToken) { toast.error("Please login to continue"); return; }
    try {
      const formData = new FormData()
      Object.entries({ firstName: updateUser.firstName, lastName: updateUser.lastName, email: updateUser.email, phoneNo: updateUser.phoneNo, address: updateUser.address, city: updateUser.city, zipCode: updateUser.zipCode, role: updateUser.role }).forEach(([k, v]) => formData.append(k, v))
      if (file) formData.append("profilePic", file)
      const res = await axios.put(
        `${import.meta.env.VITE_URL}/api/v1/user/update/${user._id}`,
        formData,
        { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "multipart/form-data" } }
      )
      if (res.data.success) {
        toast.success(res.data.message)
        dispatch(setUser(res.data.user))
        setUpdateUser(res.data.user)
      }
    } catch (error) {
      toast.error("Failed to update profile")
    }
  }

  const fieldStyle = (name) => ({
    borderColor: focused === name ? "#3d6b40" : "rgba(0,0,0,0.1)",
    boxShadow: focused === name ? "0 0 0 3px rgba(61,107,64,0.08)" : "none",
    transition: "all 0.15s",
  })

  const labelClass = (name) =>
    `text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5 mb-1.5 ${focused === name ? "text-green-700" : "text-stone-500"}`

  return (
    <div className="pt-20 min-h-screen" style={{ background: "#f5f0e8" }}>
      <div className="max-w-5xl mx-auto px-6 py-10">

        <Tabs defaultValue="profile" className="w-full">

          {/* Tab switcher */}
          <TabsList className="grid w-full grid-cols-2 mb-8 p-1 rounded-2xl border"
            style={{ background: "rgba(255,255,255,0.7)", borderColor: "rgba(143,185,122,0.25)" }}>
            <TabsTrigger value="profile"
              className="rounded-xl text-sm font-semibold transition-all data-[state=active]:shadow-sm"
              style={{ "--tw-shadow": "none" }}
              data-active-style={{ background: "#2d4a2e", color: "#f5f0e8" }}
            >
              My Profile
            </TabsTrigger>
            <TabsTrigger value="orders"
              className="rounded-xl text-sm font-semibold transition-all data-[state=active]:shadow-sm"
            >
              My Orders
            </TabsTrigger>
          </TabsList>

          {/* ── PROFILE TAB ── */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* LEFT: Avatar Card */}
              <div className="rounded-2xl border p-6 flex flex-col items-center text-center h-fit"
                style={{ background: "#fff", borderColor: "rgba(143,185,122,0.2)" }}>

                {/* Avatar */}
                <div className="relative mb-5">
                  <div className="w-28 h-28 rounded-full p-0.5"
                    style={{ background: "linear-gradient(135deg, #8fb97a, #d4a574)" }}>
                    <img
                      src={updateUser?.profilePic || userLogo}
                      alt="profile"
                      className="w-full h-full rounded-full object-cover border-2 border-white"
                    />
                  </div>
                  <label className="absolute bottom-0 right-0 p-1.5 rounded-full cursor-pointer shadow-md transition-transform hover:scale-110"
                    style={{ background: "#3d6b40", color: "#fff" }}>
                    <Camera className="w-3.5 h-3.5" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>

                <h2 className="text-base font-bold" style={{ color: "#2d2d2d" }}>
                  {updateUser.firstName} {updateUser.lastName}
                </h2>
                <p className="text-xs mt-1" style={{ color: "#9a8a7a" }}>{updateUser.email}</p>

                <span className="mt-3 text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1.5"
                  style={{
                    background: user?.role === "admin" ? "rgba(212,165,116,0.15)" : "rgba(143,185,122,0.12)",
                    color: user?.role === "admin" ? "#7a4f2e" : "#3d6b40",
                  }}>
                  {user?.role === "admin" ? <ShieldCheck className="w-3 h-3" /> : <Wrench className="w-3 h-3" />}
                  {user?.role || "user"}
                </span>

                {updateUser.city && (
                  <p className="text-xs mt-4 flex items-center gap-1" style={{ color: "#9a8a7a" }}>
                    <MapPin className="w-3 h-3" style={{ color: "#8fb97a" }} />
                    {updateUser.city}
                  </p>
                )}

                {/* Divider */}
                <div className="w-full mt-5 pt-5 space-y-2.5" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                  {updateUser.phoneNo && (
                    <div className="flex items-center gap-2 text-xs" style={{ color: "#7a7a7a" }}>
                      <Phone className="w-3 h-3" style={{ color: "#8fb97a" }} />
                      {updateUser.phoneNo}
                    </div>
                  )}
                  {updateUser.address && (
                    <div className="flex items-start gap-2 text-xs text-left" style={{ color: "#7a7a7a" }}>
                      <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: "#d4a574" }} />
                      {updateUser.address}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: Form */}
              <div className="lg:col-span-2 rounded-2xl border p-6"
                style={{ background: "#fff", borderColor: "rgba(143,185,122,0.2)" }}>

                <h3 className="text-base font-bold mb-6" style={{ color: "#2d4a2e" }}>Edit Information</h3>

                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* Name Row */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: "firstName", label: "First Name", icon: <User className="w-3 h-3" />, placeholder: "John" },
                      { name: "lastName", label: "Last Name", icon: <User className="w-3 h-3" />, placeholder: "Doe" },
                    ].map(f => (
                      <div key={f.name}>
                        <label className={labelClass(f.name)}>{f.icon}{f.label}</label>
                        <Input name={f.name} placeholder={f.placeholder} value={updateUser[f.name]}
                          onChange={handleChange} onFocus={() => setFocused(f.name)} onBlur={() => setFocused("")}
                          className="rounded-xl h-11" style={fieldStyle(f.name)} />
                      </div>
                    ))}
                  </div>

                  {/* Email */}
                  <div>
                    <label className={labelClass("email")}><Mail className="w-3 h-3" />Email</label>
                    <Input type="email" name="email" disabled value={updateUser.email}
                      className="rounded-xl h-11 cursor-not-allowed"
                      style={{ background: "#faf7f2", borderColor: "rgba(0,0,0,0.08)", color: "#9a8a7a" }} />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className={labelClass("phoneNo")}><Phone className="w-3 h-3" />Phone Number</label>
                    <Input name="phoneNo" placeholder="9999999999" value={updateUser.phoneNo}
                      onChange={handleChange} onFocus={() => setFocused("phoneNo")} onBlur={() => setFocused("")}
                      className="rounded-xl h-11" style={fieldStyle("phoneNo")} />
                  </div>

                  {/* Address */}
                  <div>
                    <label className={labelClass("address")}><MapPin className="w-3 h-3" />Address</label>
                    <Input name="address" placeholder="House no, Street, Area" value={updateUser.address}
                      onChange={handleChange} onFocus={() => setFocused("address")} onBlur={() => setFocused("")}
                      className="rounded-xl h-11" style={fieldStyle("address")} />
                  </div>

                  {/* City + Zip */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass("city")}><Building2 className="w-3 h-3" />City</label>
                      <Input name="city" placeholder="Mumbai" value={updateUser.city}
                        onChange={handleChange} onFocus={() => setFocused("city")} onBlur={() => setFocused("")}
                        className="rounded-xl h-11" style={fieldStyle("city")} />
                    </div>
                    <div>
                      <label className={labelClass("zipCode")}><Hash className="w-3 h-3" />Zip Code</label>
                      <Input name="zipCode" placeholder="400001" value={updateUser.zipCode}
                        onChange={handleChange} onFocus={() => setFocused("zipCode")} onBlur={() => setFocused("")}
                        className="rounded-xl h-11" style={fieldStyle("zipCode")} />
                    </div>
                  </div>

                  <button type="submit"
                    className="w-full h-11 rounded-xl font-semibold text-sm mt-1 transition-all duration-150 active:scale-[0.98]"
                    style={{ background: "linear-gradient(135deg, #2d4a2e, #3d6b40)", color: "#fff", boxShadow: "0 2px 12px rgba(61,107,64,0.25)" }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(61,107,64,0.35)"}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(61,107,64,0.25)"}
                  >
                    Save Changes
                  </button>

                </form>
              </div>
            </div>
          </TabsContent>

          {/* ── ORDERS TAB ── */}
          <TabsContent value="orders">
            <div className="rounded-2xl border" style={{ background: "#fff", borderColor: "rgba(143,185,122,0.2)" }}>
              <MyOrder />
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}

export default Profile