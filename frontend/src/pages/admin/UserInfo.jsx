import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { ArrowLeft, Camera, User, Mail, Phone, MapPin, Building2, Hash, ShieldCheck, Wrench } from "lucide-react";
import userLogo from "../../assets/def.png";

const UserInfo = () => {
    const navigate = useNavigate();
    const { id: userId } = useParams();
    const [updateUser, setUpdateUser] = useState(null);
    const [file, setFile] = useState(null);
    const [focused, setFocused] = useState("");
    const accessToken = localStorage.getItem("accessToken");

    const handleChange = (e) => setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
    const handleFileChange = (e) => {
        const f = e.target.files[0];
        setFile(f);
        setUpdateUser({ ...updateUser, profilePic: URL.createObjectURL(f) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!accessToken) { toast.error("Please login"); return; }
        try {
            const formData = new FormData();
            ["firstName","lastName","email","phoneNo","address","city","zipcode","role"].forEach(k => formData.append(k, updateUser[k] || ""));
            if (file) formData.append("profilePic", file);
            const res = await axios.put(`${import.meta.env.VITE_URL}/api/v1/user/update/${userId}`, formData,
                { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "multipart/form-data" } });
            if (res.data.success) { toast.success(res.data.message || "Updated"); setUpdateUser(res.data.user); }
        } catch (error) { toast.error("Failed to update"); }
    };

    useEffect(() => {
        const get = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/user/get-user/${userId}`);
                if (res.data.success) setUpdateUser(res.data.user);
            } catch (e) { console.log(e); }
        };
        get();
    }, []);

    const fs = (name) => ({ borderColor: focused === name ? "#3d6b40" : "rgba(0,0,0,0.1)", boxShadow: focused === name ? "0 0 0 3px rgba(61,107,64,0.08)" : "none", transition: "all 0.15s" });
    const lc = (name) => ({ color: focused === name ? "#3d6b40" : "#7a6a5a" });

    return (
        <div className="md:ml-[260px] min-h-screen py-6 md:py-10 px-4 md:px-8" style={{ background: "#f5f0e8" }}>
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                    <button onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition-all"
                        style={{ borderColor: "rgba(143,185,122,0.3)", color: "#3d6b40", background: "#fff" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(143,185,122,0.08)"}
                        onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                        <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <h1 className="text-xl font-bold" style={{ color: "#2d4a2e" }}>Update User</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">

                    {/* Avatar card */}
                    <div className="rounded-2xl border p-5 md:p-6 flex flex-col items-center text-center h-fit"
                        style={{ background: "#fff", borderColor: "rgba(143,185,122,0.2)" }}>
                        <div className="relative mb-4">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-0.5"
                                style={{ background: "linear-gradient(135deg, #8fb97a, #d4a574)" }}>
                                <img src={updateUser?.profilePic || userLogo} alt="profile"
                                    className="w-full h-full rounded-full object-cover border-2 border-white" />
                            </div>
                            <label className="absolute bottom-0 right-0 p-1.5 rounded-full cursor-pointer shadow"
                                style={{ background: "#3d6b40", color: "#fff" }}>
                                <Camera className="w-3 h-3" />
                                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                            </label>
                        </div>
                        <h2 className="font-bold text-sm" style={{ color: "#2d2d2d" }}>
                            {updateUser?.firstName} {updateUser?.lastName}
                        </h2>
                        <p className="text-xs mt-1 break-all" style={{ color: "#9a8a7a" }}>{updateUser?.email}</p>
                        <span className="mt-3 text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1.5"
                            style={{
                                background: updateUser?.role === "admin" ? "rgba(212,165,116,0.15)" : "rgba(143,185,122,0.12)",
                                color: updateUser?.role === "admin" ? "#7a4f2e" : "#3d6b40",
                            }}>
                            {updateUser?.role === "admin" ? <ShieldCheck className="w-3 h-3" /> : <Wrench className="w-3 h-3" />}
                            {updateUser?.role || "user"}
                        </span>

                        {/* Role toggle */}
                        <div className="mt-5 w-full pt-4" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                            <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-left" style={{ color: "#7a6a5a" }}>Role</p>
                            <div className="flex gap-2">
                                {["user","admin"].map(r => (
                                    <button key={r} type="button" onClick={() => setUpdateUser({ ...updateUser, role: r })}
                                        className="flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all"
                                        style={{
                                            background: updateUser?.role === r ? (r === "admin" ? "#d4a574" : "#3d6b40") : "rgba(0,0,0,0.04)",
                                            color: updateUser?.role === r ? "#fff" : "#9a8a7a",
                                        }}>
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="lg:col-span-2 rounded-2xl border p-5 md:p-6"
                        style={{ background: "#fff", borderColor: "rgba(143,185,122,0.2)" }}>
                        <h3 className="text-sm font-bold mb-5" style={{ color: "#2d4a2e" }}>Edit Information</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { name: "firstName", label: "First Name", icon: <User className="w-3 h-3" /> },
                                    { name: "lastName",  label: "Last Name",  icon: <User className="w-3 h-3" /> },
                                ].map(f => (
                                    <div key={f.name}>
                                        <label className="text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5 mb-1.5" style={lc(f.name)}>
                                            {f.icon}{f.label}
                                        </label>
                                        <input type="text" name={f.name} value={updateUser?.[f.name] || ""} onChange={handleChange}
                                            onFocus={() => setFocused(f.name)} onBlur={() => setFocused("")}
                                            className="w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none"
                                            style={{ ...fs(f.name), color: "#2d2d2d", background: "#fff" }} />
                                    </div>
                                ))}
                            </div>

                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5 mb-1.5" style={{ color: "#7a6a5a" }}>
                                    <Mail className="w-3 h-3" />Email
                                </label>
                                <input type="email" value={updateUser?.email || ""} readOnly
                                    className="w-full px-4 py-2.5 rounded-xl text-sm border cursor-not-allowed"
                                    style={{ background: "#faf7f2", borderColor: "rgba(0,0,0,0.08)", color: "#9a8a7a" }} />
                            </div>

                            {[
                                { name: "phoneNo",  label: "Phone",   icon: <Phone className="w-3 h-3" /> },
                                { name: "address",  label: "Address", icon: <MapPin className="w-3 h-3" /> },
                            ].map(f => (
                                <div key={f.name}>
                                    <label className="text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5 mb-1.5" style={lc(f.name)}>
                                        {f.icon}{f.label}
                                    </label>
                                    <input type="text" name={f.name} value={updateUser?.[f.name] || ""} onChange={handleChange}
                                        onFocus={() => setFocused(f.name)} onBlur={() => setFocused("")}
                                        className="w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none"
                                        style={{ ...fs(f.name), color: "#2d2d2d", background: "#fff" }} />
                                </div>
                            ))}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { name: "city",    label: "City",     icon: <Building2 className="w-3 h-3" /> },
                                    { name: "zipcode", label: "Zip Code", icon: <Hash className="w-3 h-3" />      },
                                ].map(f => (
                                    <div key={f.name}>
                                        <label className="text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5 mb-1.5" style={lc(f.name)}>
                                            {f.icon}{f.label}
                                        </label>
                                        <input type="text" name={f.name} value={updateUser?.[f.name] || ""} onChange={handleChange}
                                            onFocus={() => setFocused(f.name)} onBlur={() => setFocused("")}
                                            className="w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none"
                                            style={{ ...fs(f.name), color: "#2d2d2d", background: "#fff" }} />
                                    </div>
                                ))}
                            </div>

                            <button type="submit"
                                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.98]"
                                style={{ background: "linear-gradient(135deg, #2d4a2e, #3d6b40)", boxShadow: "0 2px 12px rgba(61,107,64,0.25)" }}>
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;